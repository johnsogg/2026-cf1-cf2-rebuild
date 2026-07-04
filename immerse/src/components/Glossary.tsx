import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import s from "./Glossary.module.css"

export type GlossaryEntry = {
  term: string[] // first element is primary; rest are variants
  definition: string
}

type GlossaryContextValue = {
  lookup(t: string): GlossaryEntry | undefined
  sortedEntries: GlossaryEntry[]
}

export const GlossaryContext = createContext<GlossaryContextValue | null>(null)

export function GlossaryProvider({
  entries,
  children,
}: {
  entries: GlossaryEntry[]
  children: ReactNode
}) {
  const map = useMemo(() => {
    const m = new Map<string, GlossaryEntry>()
    for (const entry of entries) {
      for (const t of entry.term) {
        m.set(t.toLowerCase(), entry)
      }
    }
    return m
  }, [entries])

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => a.term[0].localeCompare(b.term[0])),
    [entries],
  )

  const value = useMemo(
    () => ({ lookup: (t: string) => map.get(t.toLowerCase()), sortedEntries }),
    [map, sortedEntries],
  )

  return (
    <GlossaryContext.Provider value={value}>
      {children}
    </GlossaryContext.Provider>
  )
}

export function GlossaryView() {
  const ctx = useContext(GlossaryContext)
  if (!ctx) return null
  const { sortedEntries } = ctx

  return (
    <div>
      <h1>Glossary</h1>
      {sortedEntries.map((entry) => {
        const primary = entry.term[0]
        return (
          <div key={primary} className={s.glossaryEntry}>
            <div>
              <strong>{primary}</strong>
            </div>
            <div>{entry.definition}</div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Marks an inline term, e.g. `<Term>recursion</Term>`, that pops up its
 * glossary definition on click. Globally available in book `.mdx` sections,
 * no import needed. Looks up `children` (case-insensitively) against
 * `glossaryEntries` passed to `ImmerseApp`; renders with an obvious "missing"
 * style if no entry matches, as a signal to add one.
 */
export function Term({ children }: { children: string }) {
  const ctx = useContext(GlossaryContext)
  const entry = ctx?.lookup(children)
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<"top" | "bottom">("top")
  const ref = useRef<HTMLSpanElement>(null)
  const popoverRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!open || !popoverRef.current) return
    const { top } = popoverRef.current.getBoundingClientRect()
    if (top < 0) setPlacement("bottom")
  }, [open, placement])

  useEffect(() => {
    if (!open) {
      setPlacement("top")
      return
    }

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("click", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  if (!ctx || !entry) {
    return <span className={s.termMissing}>{children}</span>
  }

  return (
    <span ref={ref} className={s.termAnchor}>
      <span className={s.termTrigger} onClick={() => setOpen((o) => !o)}>
        {children}
      </span>
      {open && (
        <span
          ref={popoverRef}
          className={
            placement === "top" ? s.termPopoverTop : s.termPopoverBottom
          }
        >
          <strong className={s.termPopoverTitle}>{entry.term[0]}</strong>
          {entry.definition}
        </span>
      )}
    </span>
  )
}
