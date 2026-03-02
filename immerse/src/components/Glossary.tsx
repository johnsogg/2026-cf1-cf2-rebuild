import { createContext, useContext, useMemo, type ReactNode } from 'react'

export type GlossaryEntry = {
  term: string
  definition: string
}

type GlossaryContextValue = { lookup(t: string): GlossaryEntry | undefined }

const GlossaryContext = createContext<GlossaryContextValue | null>(null)

export function GlossaryProvider({ entries, children }: { entries: GlossaryEntry[], children: ReactNode }) {
  const map = useMemo(() => {
    const m = new Map<string, GlossaryEntry>()
    for (const entry of entries) {
      m.set(entry.term.toLowerCase(), entry)
    }
    return m
  }, [entries])

  const value = useMemo(() => ({ lookup: (t: string) => map.get(t.toLowerCase()) }), [map])

  return <GlossaryContext.Provider value={value}>{children}</GlossaryContext.Provider>
}

export function Term({ children }: { children: string }) {
  const ctx = useContext(GlossaryContext)
  const entry = ctx?.lookup(children)

  if (!ctx || !entry) {
    return <span style={{ color: 'hotpink', fontWeight: 'bold' }}>{children}</span>
  }

  return (
    <span
      title={entry.definition}
      style={{ borderBottom: '2px dotted currentColor', cursor: 'help' }}
    >
      {children}
    </span>
  )
}
