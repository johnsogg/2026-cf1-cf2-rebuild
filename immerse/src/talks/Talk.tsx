import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type MouseEvent,
} from "react"
import { Link, useNavigate } from "react-router-dom"
import { ThemePicker } from "../components/ThemePicker"
import { TalkContext, TalkMetaContext, stepLetter, type TalkMeta, type TalkMode } from "./Slide"
import s from "./talks.module.css"

const PAGE_RULES: Record<TalkMode, string> = {
  // Slides-only PDF: one slide per page, at full canvas size.
  print: "@page { size: 1920px 1080px; margin: 0 }",
  // Slides plus notes: ordinary letter pages.
  notes: "@page { size: letter portrait; margin: 0.5in }",
  present: "",
}

const toggleFullscreen = () => {
  if (document.fullscreenElement) document.exitFullscreen()
  else document.documentElement.requestFullscreen().catch(() => {})
}

export type TalkProps = {
  slug: string
  title: string
  Content: ComponentType
  mode: TalkMode
  meta?: TalkMeta
}

export const Talk = ({ slug, title, Content, mode, meta = {} }: TalkProps) => {
  const navigate = useNavigate()
  const deckRef = useRef<HTMLDivElement>(null)
  const stepsPerSlide = useRef<number[]>([])
  const [current, setCurrent] = useState(0)
  const [step, setStep] = useState(0)
  const [total, setTotal] = useState(0)
  const [slideTitles, setSlideTitles] = useState<string[]>([])
  const [showNotes, setShowNotes] = useState(false)
  const [idle, setIdle] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)

  const setSteps = useCallback((slideIndex: number, steps: number) => {
    stepsPerSlide.current[slideIndex] = steps
  }, [])

  // After every slide has mounted: count them and honor #n in the URL.
  useLayoutEffect(() => {
    const count = deckRef.current!.querySelectorAll("[data-slide]").length
    setTotal(count)
    setSlideTitles(
      Array.from(deckRef.current!.querySelectorAll<HTMLElement>("[data-slide]")).map(
        (el) => el.dataset.title ?? "",
      ),
    )
    // #4 is slide 4; #4b is its second reveal step.
    const m = /^(\d+)([a-z]?)$/i.exec(window.location.hash.slice(1))
    if (mode === "present" && m) {
      const slide = Math.max(0, Math.min(Number(m[1]), count) - 1)
      const letter = m[2] ? m[2].toUpperCase().charCodeAt(0) - 65 : 0
      setCurrent(slide)
      setStep(Math.min(letter, stepsPerSlide.current[slide] ?? 0))
    }
  }, [mode])

  const go = useCallback(
    (dir: 1 | -1) => {
      if (dir === 1) {
        if (step < (stepsPerSlide.current[current] ?? 0)) setStep(step + 1)
        else if (current < total - 1) {
          setCurrent(current + 1)
          setStep(0)
        }
      } else if (step > 0) setStep(step - 1)
      else if (current > 0) {
        setCurrent(current - 1)
        setStep(stepsPerSlide.current[current - 1] ?? 0)
      }
    },
    [current, step, total],
  )

  const jump = useCallback(
    (i: number) => {
      setCurrent(Math.max(0, Math.min(total - 1, i)))
      setStep(0)
    },
    [total],
  )

  // Keyboard (present mode only).
  useEffect(() => {
    if (mode !== "present") return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Enter":
          go(1)
          break
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          go(-1)
          break
        case "Home":
          jump(0)
          break
        case "End":
          jump(total - 1)
          break
        case "f":
        case "F":
          toggleFullscreen()
          break
        case "n":
        case "N":
          setShowNotes((v) => !v)
          break
        case "Escape":
          // In fullscreen the browser takes Escape itself and we never see it.
          navigate(`/talks/${slug}`)
          break
        default:
          return
      }
      e.preventDefault()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mode, go, jump, total, navigate, slug])

  // Keep the slide number in the URL so a reload lands on the same slide.
  useEffect(() => {
    if (mode !== "present" || total === 0) return
    const letter = (stepsPerSlide.current[current] ?? 0) > 0 ? stepLetter(step) : ""
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${current + 1}${letter}`,
    )
  }, [mode, current, step, total])

  // Hide the cursor and controls when the mouse rests.
  useEffect(() => {
    if (mode !== "present") return
    let timer: number
    const wake = () => {
      setIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIdle(true), 2500)
    }
    wake()
    window.addEventListener("mousemove", wake)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("mousemove", wake)
    }
  }, [mode])

  // ?print on the slides URL opens the print dialog once things have laid out.
  useEffect(() => {
    if (mode !== "print") return
    const t = window.setTimeout(() => window.print(), 1000)
    return () => window.clearTimeout(t)
  }, [mode])

  const onDeckClick = (e: MouseEvent<HTMLDivElement>) => {
    if (mode !== "present") return
    if ((e.target as HTMLElement).closest("a, button, aside, select")) return
    go(e.clientX < window.innerWidth / 3 ? -1 : 1)
  }

  const present = () => {
    document.documentElement.requestFullscreen().catch(() => {})
    navigate(`/talks/${slug}/slides`)
  }

  const ctx = useMemo(
    () => ({ mode, current, step, setSteps }),
    [mode, current, step, setSteps],
  )

  return (
    <TalkContext.Provider value={ctx}>
      <style>{PAGE_RULES[mode]}</style>
      <div
        ref={deckRef}
        className={s.deck}
        data-deck=""
        data-mode={mode}
        data-notes={showNotes ? "on" : "off"}
        data-idle={idle ? "" : undefined}
        onClick={onDeckClick}
      >
        {mode === "notes" && (
          <header className={s.header}>
            <h1>{title}</h1>
            <div className={s.actions}>
              <button type="button" onClick={present}>
                ▶ Present
              </button>
              <button type="button" onClick={() => window.print()}>
                Print slides + notes
              </button>
              <Link to={`/talks/${slug}/slides?print`}>Print slides only</Link>
              <button type="button" onClick={() => setThemeOpen((v) => !v)}>
                🎨
              </button>
            </div>
            {themeOpen && (
              <div className={s.themePanel}>
                <ThemePicker />
              </div>
            )}
          </header>
        )}

        <div className={s.slides}>
          <TalkMetaContext.Provider value={meta}>
            <Content />
          </TalkMetaContext.Provider>
        </div>

        {mode === "present" && (
          <>
            <div className={s.controls}>
              <span>
                {current + 1}
                {(stepsPerSlide.current[current] ?? 0) > 0
                  ? stepLetter(step)
                  : ""}{" "}
                / {total}
              </span>
              <select
                aria-label="Go to slide"
                value={current}
                onChange={(e) => {
                  jump(Number(e.target.value))
                  e.target.blur()
                }}
              >
                {slideTitles.map((t, i) => (
                  <option key={i} value={i}>
                    {i + 1}. {t || "(untitled)"}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => setShowNotes((v) => !v)}>
                Notes (N)
              </button>
              <button type="button" onClick={toggleFullscreen}>
                Fullscreen (F)
              </button>
              <Link to={`/talks/${slug}`}>Exit</Link>
            </div>
            <div
              className={s.progress}
              style={{
                width: total > 1 ? `${(current / (total - 1)) * 100}%` : "0",
              }}
            />
          </>
        )}
      </div>
    </TalkContext.Provider>
  )
}
