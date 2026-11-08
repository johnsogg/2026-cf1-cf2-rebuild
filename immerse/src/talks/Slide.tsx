import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import s from "./talks.module.css"

/**
 * present: one slide at a time, fullscreen, keyboard driven.
 * notes:   every slide in a column, each followed by its presenter notes.
 * print:   every slide, no notes (the slides-only PDF).
 */
export type TalkMode = "present" | "notes" | "print"

// Slides are authored on a fixed 1920x1080 canvas and scaled to fit.
export const SLIDE_W = 1920
export const SLIDE_H = 1080

// Reveal steps are lettered: a slide with three steps is 4A, 4B, 4C.
export const stepLetter = (step: number) => String.fromCharCode(65 + step)

export type TalkMeta = {
  author?: string
  /** ISO date (YYYY-MM-DD) of original authoring. */
  date?: string
  /** ISO date of the last substantial content revision, if any. */
  lastRevised?: string
}

export const TalkMetaContext = createContext<TalkMeta>({})

// "2026-11-07" -> "November 7, 2026". Parsed by hand so time zones can't shift it.
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/** For a title slide: author, date, and (if present) the revision date. */
export const Byline = () => {
  const { author, date, lastRevised } = useContext(TalkMetaContext)
  if (!author && !date) return null
  return (
    <p className={s.byline}>
      {author}
      {author && date && <br />}
      {date && formatDate(date)}
      {lastRevised && ` (revised ${formatDate(lastRevised)})`}
    </p>
  )
}

type TalkContextValue = {
  mode: TalkMode
  current: number
  step: number
  setSteps: (slideIndex: number, steps: number) => void
}

export const TalkContext = createContext<TalkContextValue>({
  mode: "notes",
  current: 0,
  step: Infinity,
  setSteps: () => {},
})

type SlideContextValue = {
  // Infinity means "show everything" (notes, print, non-current slides).
  step: number
  // False only in present mode, before you have reached this slide.
  arrived: boolean
  notesEl: HTMLElement | null
  requireSteps: (n: number) => void
}

const SlideContext = createContext<SlideContextValue | null>(null)

/**
 * The current reveal step of the enclosing slide. Components that change
 * with each key press use this; `states` is how many extra steps they need
 * the slide to have.
 */
export const useSlideStep = (extraSteps = 0): number => {
  const ctx = useContext(SlideContext)
  const requireSteps = ctx?.requireSteps
  // Child layout effects run before the Slide's own, so the Slide sees this
  // when it totals up its steps.
  useLayoutEffect(() => {
    requireSteps?.(extraSteps)
  }, [requireSteps, extraSteps])
  return ctx ? ctx.step : Infinity
}

/**
 * Whether you have reached this slide yet. Lets a component hold a "before"
 * state and animate into its real one on arrival.
 */
export const useSlideArrived = (): boolean =>
  useContext(SlideContext)?.arrived ?? true

export type SlideProps = {
  children: ReactNode
  layout?: "default" | "title" | "center" | "wide"
  /** Name in the slide finder. Defaults to the slide's first heading. */
  title?: string
}

export const Slide = ({ children, layout = "default", title }: SlideProps) => {
  const talk = useContext(TalkContext)
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const required = useRef(0)
  const [index, setIndex] = useState(-1)
  const [notesEl, setNotesEl] = useState<HTMLElement | null>(null)
  const [scale, setScale] = useState(1)
  const [stepCount, setStepCount] = useState(0)

  const isCurrent = index === talk.current
  const visible = talk.mode !== "present" || isCurrent
  // In present mode a slide waits in its first state until you arrive (so
  // arriving doesn't animate from the end state back to the start), and rests
  // in its last state once you've passed it (so going back lands on 4C, not
  // 4A). Everywhere else every step shows.
  const step =
    talk.mode !== "present"
      ? Infinity
      : isCurrent
        ? talk.step
        : index > talk.current
          ? 0
          : stepCount

  const requireSteps = useCallback((n: number) => {
    required.current = Math.max(required.current, n)
  }, [])

  // Runs after children mount: find our position in the deck and total up
  // how many reveal steps we have.
  const { setSteps } = talk
  useLayoutEffect(() => {
    const el = sectionRef.current!
    const deck = el.closest("[data-deck]")!
    const i = Array.from(deck.querySelectorAll("[data-slide]")).indexOf(el)
    let auto = 0
    let max = required.current
    el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((r) => {
      const at = r.dataset.at ? Number(r.dataset.at) : ++auto
      r.dataset.resolvedAt = String(at)
      max = Math.max(max, at)
    })
    el.dataset.title =
      title ??
      el.querySelector(`.${s.canvas} h1, .${s.canvas} h2, .${s.canvas} h3`)
        ?.textContent?.trim() ??
      ""
    setIndex(i)
    setStepCount(max)
    setSteps(i, max)
  }, [setSteps, title])

  // Show or hide each <Reveal> for the current step.
  useLayoutEffect(() => {
    sectionRef.current!
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((r) => {
        r.toggleAttribute(
          "data-hidden",
          Number(r.dataset.resolvedAt ?? 0) > step,
        )
      })
  }, [step, index])

  // Keep the canvas scaled to its frame.
  useLayoutEffect(() => {
    const frame = frameRef.current!
    const update = () => {
      if (frame.clientWidth > 0) setScale(frame.clientWidth / SLIDE_W)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(frame)
    return () => ro.disconnect()
  }, [])

  // A hidden slide (display: none) measures 0 wide, so it keeps a stale scale.
  // Re-measure in a layout effect the moment it shows, before the browser
  // paints, so it never flashes at the wrong size.
  useLayoutEffect(() => {
    const w = frameRef.current!.clientWidth
    if (w > 0) setScale(w / SLIDE_W)
  }, [visible])

  const arrived = talk.mode !== "present" || !(index > talk.current)
  const ctx = useMemo(
    () => ({ step, arrived, notesEl, requireSteps }),
    [step, arrived, notesEl, requireSteps],
  )

  return (
    <SlideContext.Provider value={ctx}>
      <section
        ref={sectionRef}
        className={s.slide}
        data-slide=""
        data-active={visible ? "" : undefined}
      >
        <div className={s.frame} ref={frameRef}>
          <div
            className={s.canvas}
            data-layout={layout}
            style={{ transform: `scale(${scale})` }}
          >
            {children}
            <div className={s.slideNumber}>
              {index + 1}
              {stepCount > 0 && isCurrent && talk.mode === "present"
                ? stepLetter(talk.step)
                : ""}
            </div>
          </div>
        </div>
        <aside className={s.notes} ref={setNotesEl} />
      </section>
    </SlideContext.Provider>
  )
}

/** Presenter notes. Written inside a Slide; shown in the notes view. */
export const Notes = ({ children }: { children: ReactNode }) => {
  const ctx = useContext(SlideContext)
  return ctx?.notesEl ? createPortal(children, ctx.notesEl) : null
}

/**
 * Hidden until its turn. Reveals appear one per key press, in document order,
 * unless `at` says which step shows it.
 */
export const Reveal = ({
  children,
  at,
}: {
  children: ReactNode
  at?: number
}) => (
  <div className={s.reveal} data-reveal="" data-at={at}>
    {children}
  </div>
)

export const Columns = ({ children }: { children: ReactNode }) => (
  <div className={s.columns}>{children}</div>
)
