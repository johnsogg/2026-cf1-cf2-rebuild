import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { IconButton } from "./IconButton"
import { SvgIcon } from "./SvgIcon"
import s from "./Ask.module.css"
import btn from "../styles/buttons.module.css"
import { useProgress } from "../progress/ProgressContext"
import { useNav } from "../nav/NavContext"
import { getStorageValue, setStorageValue } from "../storage"

/**
 * Wraps any content (prose, a sketch, an editor, a mixture) and declares
 * whether/how it counts toward book progress, independent of what's
 * rendered inside. `<Solution id="...">` pairs with an `Ask` by reusing
 * its id — see `Solution.tsx`. Globally available in book `.mdx` sections,
 * no import needed — see root CLAUDE.md for authoring conventions.
 */
export type AskMode = "untracked" | "interacted" | "graded"
export type AskState = "idle" | "attempted" | "complete"

export type AskContextValue = {
  id: string
  mode: AskMode
  declareGradable: () => void
  reportGrade: (passed: boolean) => void
}

export const AskContext = createContext<AskContextValue | null>(null)

export function useAsk(): AskContextValue {
  const ctx = useContext(AskContext)
  if (!ctx) throw new Error("useAsk must be used within an Ask or Solution")
  return ctx
}

type AskRegistryValue = {
  getNumber: (id: string) => number
  registerId: (id: string, title?: string) => void
  hasId: (id: string) => boolean
  getTitle: (id: string) => string | undefined
}

const AskRegistryContext = createContext<AskRegistryValue | null>(null)

export function useAskRegistry(): AskRegistryValue {
  const ctx = useContext(AskRegistryContext)
  if (!ctx) throw new Error("Ask/Solution must be used within an AskProvider")
  return ctx
}

/**
 * Provides per-section question numbering and a page-scoped registry of
 * which `Ask` ids have been rendered, so a `Solution` can tell whether it
 * has a matching `Ask` on the same page. Resets every render, same as the
 * numbering it replaces — relies on `Ask` registering itself during render
 * (not in an effect) so a `Solution` authored after it in the document
 * always sees it already registered.
 */
export function AskProvider({ children }: { children: ReactNode }) {
  const counter = useRef(0)
  const assignedNumbers = useRef(new Map<string, number>())
  const knownIds = useRef(new Set<string>())
  const titles = useRef(new Map<string, string>())
  counter.current = 0
  assignedNumbers.current = new Map()
  knownIds.current = new Set()
  titles.current = new Map()

  const getNumber = useCallback((id: string) => {
    if (assignedNumbers.current.has(id)) return assignedNumbers.current.get(id)!
    const n = ++counter.current
    assignedNumbers.current.set(id, n)
    return n
  }, [])

  const registerId = useCallback((id: string, title?: string) => {
    knownIds.current.add(id)
    if (title) titles.current.set(id, title)
  }, [])

  const hasId = useCallback((id: string) => knownIds.current.has(id), [])

  const getTitle = useCallback((id: string) => titles.current.get(id), [])

  return (
    <AskRegistryContext.Provider
      value={{ getNumber, registerId, hasId, getTitle }}
    >
      {children}
    </AskRegistryContext.Provider>
  )
}

export type AskProps = {
  id: string
  mode: AskMode
  title?: string
  hints?: string[]
  children: ReactNode
}

export function Ask({ id, mode, title, hints, children }: AskProps) {
  const { getNumber, registerId } = useAskRegistry()
  const number = mode === "untracked" ? undefined : getNumber(id)
  registerId(id, title)

  const { registerExerciseInSection, notifyExerciseChange } = useProgress()
  const { currentSection } = useNav()
  const sectionPath = useRef(currentSection.urlPath)

  useEffect(() => {
    if (mode === "untracked") return
    registerExerciseInSection(id, sectionPath.current)
  }, [id, mode, registerExerciseInSection])

  const [resetKey, setResetKey] = useState(0)
  const [state, setState] = useState<AskState>(() =>
    mode === "untracked"
      ? "idle"
      : ((getStorageValue((d) => d.exercises?.[id]?.state) as AskState) ??
        "idle"),
  )
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [hasGradableChild, setHasGradableChild] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const persistState = useCallback(
    (next: AskState) => {
      setState(next)
      setStorageValue((d) => {
        ;((d.exercises ??= {})[id] ??= {}).state = next
      })
      notifyExerciseChange()
    },
    [id, notifyExerciseChange],
  )

  const declareGradable = useCallback(() => setHasGradableChild(true), [])

  const reportGrade = useCallback(
    (passed: boolean) => persistState(passed ? "complete" : "attempted"),
    [persistState],
  )

  const handleCheckboxToggle = useCallback(() => {
    persistState(state === "complete" ? "idle" : "complete")
  }, [state, persistState])

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1)
    setHintsRevealed(0)
    setState("idle")
    setStorageValue((d) => {
      delete (d.exercises ??= {})[id]
    })
    notifyExerciseChange()
  }, [id, notifyExerciseChange])

  const showGradedWarning = mode === "graded" && mounted && !hasGradableChild

  const contextValue: AskContextValue = {
    id,
    mode,
    declareGradable,
    reportGrade,
  }

  const stateClass = {
    idle: s.stateIdle,
    attempted: s.stateAttempted,
    complete: s.stateComplete,
  }[state]

  return (
    <div
      className={`${s.ask} ${mode === "untracked" ? s.untracked : stateClass}`}
    >
      <div className={s.header}>
        <div className={s.questionContainer}>
          {mode === "interacted" && (
            <label className={s.checkboxLabel}>
              <input
                type="checkbox"
                className={s.checkbox}
                checked={state === "complete"}
                onChange={handleCheckboxToggle}
                aria-label="Mark as done"
              />
            </label>
          )}
          {mode === "graded" && (
            <div className={s.attemptIcon}>
              <SvgIcon
                name={
                  state === "complete"
                    ? "statusComplete"
                    : state === "attempted"
                      ? "statusAttempted"
                      : "statusIdle"
                }
                size={18}
                intent={
                  state === "complete"
                    ? "success"
                    : state === "attempted"
                      ? "error"
                      : "muted"
                }
              />
            </div>
          )}
          {number !== undefined && <div className={s.question}>{number}</div>}
        </div>
        <IconButton onClick={handleReset} aria-label="Reset">
          <SvgIcon name="refresh" size={18} intent="muted" />
        </IconButton>
      </div>

      {title && <div className={s.title}>{title}</div>}

      {showGradedWarning && (
        <div className={s.warningBanner} role="alert">
          ⚠ mode="graded" but nothing inside this Ask reported a grade —
          only CodeExercise/MultipleChoiceExercise can. This will never
          reach "complete."
        </div>
      )}

      <AskContext.Provider value={contextValue} key={resetKey}>
        {children}
      </AskContext.Provider>

      {hints && hints.length > 0 && (
        <div className={s.hints}>
          {hints.slice(0, hintsRevealed).map((hint, i) => (
            <div key={i} className={s.hint}>
              <strong>Hint {i + 1}:</strong> {hint}
            </div>
          ))}
          {hintsRevealed < hints.length && (
            <div className={s.hintAction}>
              <button
                className={btn.btnSecondary}
                onClick={() => setHintsRevealed((n) => n + 1)}
              >
                Get a hint
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
