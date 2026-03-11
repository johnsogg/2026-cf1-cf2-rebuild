import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import type { CodeExerciseProps } from "./CodeExercise"
import type { MultipleChoiceExerciseProps } from "./MultipleChoiceExercise"
import type { P5ExerciseProps } from "./P5Exercise"
import { CodeExercise } from "./CodeExercise"
import { MultipleChoiceExercise } from "./MultipleChoiceExercise"
import { P5Exercise } from "./P5Exercise"
import { IconButton } from "./IconButton"
import { SvgIcon } from "./SvgIcon"
import s from "./Exercise.module.css"
import btn from "../styles/buttons.module.css"
import { useProgress } from "../progress/ProgressContext"
import { useNav } from "../nav/NavContext"
import { getStorageValue, setStorageValue } from "../storage"

export type Exercise = CodeExerciseProps | MultipleChoiceExerciseProps | P5ExerciseProps

const ExerciseNumberContext = createContext<(id: string) => number>(() => 0)

export function ExerciseNumberProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const counter = useRef(0)
  const assigned = useRef(new Map<string, number>())
  counter.current = 0
  assigned.current = new Map()
  const getNext = useCallback((id: string) => {
    if (assigned.current.has(id)) return assigned.current.get(id)!
    const n = ++counter.current
    assigned.current.set(id, n)
    return n
  }, [])
  return (
    <ExerciseNumberContext.Provider value={getNext}>
      {children}
    </ExerciseNumberContext.Provider>
  )
}

export function Exercise({
  exercise,
  questionNumber,
}: {
  exercise: Exercise
  questionNumber?: number
}) {
  const getNumber = useContext(ExerciseNumberContext)
  const resolvedNumber = questionNumber ?? getNumber(exercise.id)

  const { id, hints } = exercise
  const { registerExerciseInSection, notifyExerciseChange } = useProgress()
  const { currentSection } = useNav()
  const sectionPath = useRef(currentSection.urlPath)

  useEffect(() => {
    registerExerciseInSection(id, sectionPath.current)
  }, [id, registerExerciseInSection])

  const [resetKey, setResetKey] = useState(0)
  const [attemptState, setAttemptState] = useState<AttemptState>(
    () =>
      (getStorageValue((d) => d.exercises?.[id]?.state) as AttemptState) ??
      "idle",
  )
  const [hintsRevealed, setHintsRevealed] = useState(0)

  const handleAttempt = useCallback(() => {
    setAttemptState("attempted")
    setStorageValue((d) => {
      ;((d.exercises ??= {})[id] ??= {}).state = "attempted"
    })
    notifyExerciseChange()
  }, [id, notifyExerciseChange])

  const handleComplete = useCallback(() => {
    setAttemptState("complete")
    setStorageValue((d) => {
      ;((d.exercises ??= {})[id] ??= {}).state = "complete"
    })
    notifyExerciseChange()
  }, [id, notifyExerciseChange])

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1)
    setAttemptState("idle")
    setHintsRevealed(0)
    setStorageValue((d) => {
      delete (d.exercises ??= {})[id]
    })
    notifyExerciseChange()
  }, [id, notifyExerciseChange])

  const stateClass = {
    idle: s.exerciseIdle,
    attempted: s.exerciseAttempted,
    complete: s.exerciseComplete,
  }[attemptState]
  return (
    <div className={`${s.exercise} ${stateClass}`}>
      <ExerciseHeader
        questionNumber={resolvedNumber}
        attemptState={attemptState}
        onReset={handleReset}
      />
      <ExerciseTitle title={exercise.title ?? ""} />
      <ExerciseContent
        exercise={exercise}
        resetKey={resetKey}
        onAttempt={handleAttempt}
        onComplete={handleComplete}
      />
      <ExerciseHints
        hints={hints}
        hintsRevealed={hintsRevealed}
        setHintsRevealed={setHintsRevealed}
      />
    </div>
  )
}

export type AttemptState = "idle" | "attempted" | "complete"

type ExerciseHeaderProps = {
  questionNumber: number
  attemptState: AttemptState
  onReset: VoidFunction
}
const ExerciseHeader = ({
  questionNumber,
  attemptState,
  onReset,
}: ExerciseHeaderProps) => {
  const stateIcon = {
    idle: <SvgIcon name="statusIdle" size={18} intent="muted" />,
    attempted: <SvgIcon name="statusAttempted" size={18} intent="error" />,
    complete: <SvgIcon name="statusComplete" size={18} intent="success" />,
  }[attemptState]
  return (
    <div className={s.header}>
      <div className={s.questionContainer}>
        <div className={s.attemptIcon}>{stateIcon}</div>
        <div className={s.question}>{questionNumber}</div>
      </div>
      <IconButton onClick={onReset} aria-label="Reset">
        <SvgIcon name="refresh" size={18} intent="muted" />
      </IconButton>
    </div>
  )
}

type ExerciseTitleProps = {
  title: string
}
const ExerciseTitle = ({ title }: ExerciseTitleProps) => {
  return <div className={s.title}>{title}</div>
}

type ExerciseContentProps = {
  exercise: Exercise
  resetKey: number
  onAttempt: VoidFunction
  onComplete: VoidFunction
}
const ExerciseContent = ({
  exercise,
  resetKey,
  onAttempt,
  onComplete,
}: ExerciseContentProps) => {
  switch (exercise.type) {
    case "code":
      return (
        <CodeExercise
          key={resetKey}
          exercise={exercise}
          onAttempt={onAttempt}
          onComplete={onComplete}
        />
      )
    case "multiple-choice":
      return (
        <MultipleChoiceExercise
          key={resetKey}
          exercise={exercise}
          onAttempt={onAttempt}
          onComplete={onComplete}
        />
      )
    case "p5":
      return (
        <P5Exercise
          key={resetKey}
          exercise={exercise}
        />
      )
  }
}

type ExerciseHintsProps = {
  hints?: string[]
  hintsRevealed: number
  setHintsRevealed: React.Dispatch<React.SetStateAction<number>>
}
const ExerciseHints = ({
  hints,
  hintsRevealed,
  setHintsRevealed,
}: ExerciseHintsProps) => {
  if (hints == null || hints.length === 0) return null
  return (
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
  )
}
