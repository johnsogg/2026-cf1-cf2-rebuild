import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { CodeExerciseProps } from './CodeExercise'
import type { MultipleChoiceExerciseProps } from './MultipleChoiceExercise'
import { CodeExercise } from './CodeExercise'
import { MultipleChoiceExercise } from './MultipleChoiceExercise'
import s from './Exercise.module.css'
import btn from '../styles/buttons.module.css'

export type Exercise = CodeExerciseProps | MultipleChoiceExerciseProps

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

  const [resetKey, setResetKey] = useState(0)
  const [attemptState, setAttemptState] = useState<AttemptState>(
    () =>
      (localStorage.getItem(`exercise:${id}:state`) as AttemptState) ?? 'idle'
  )
  const [hintsRevealed, setHintsRevealed] = useState(0)

  const handleAttempt = () => {
    setAttemptState('attempted')
    localStorage.setItem(`exercise:${id}:state`, 'attempted')
  }

  const handleComplete = () => {
    setAttemptState('complete')
    localStorage.setItem(`exercise:${id}:state`, 'complete')
  }

  const handleReset = () => {
    setResetKey((k) => k + 1)
    setAttemptState('idle')
    setHintsRevealed(0)
    localStorage.removeItem(`exercise:${id}:state`)
  }

  const stateClass = { idle: s.exerciseIdle, attempted: s.exerciseAttempted, complete: s.exerciseComplete }[attemptState]

  return (
    <div className={`${s.exercise} ${stateClass}`}>
      <ExerciseHeader
        questionNumber={resolvedNumber}
        attemptState={attemptState}
        onReset={handleReset}
      />
      <ExerciseTitle title={exercise.title ?? ''} />
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

export type AttemptState = 'idle' | 'attempted' | 'complete'

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
  const stateIcon = { idle: '☐', attempted: '✗', complete: '✓' }[attemptState]
  const attemptClass = { idle: s.attemptIdle, attempted: s.attemptAttempted, complete: s.attemptComplete }[attemptState]
  return (
    <div className={s.header}>
      <div className={s.questionContainer}>
        <div className={attemptClass}>
          {stateIcon}
        </div>
        <div className={s.question}>{questionNumber}</div>
      </div>
      <button
        className={s.resetBtn}
        onClick={onReset}
        aria-label="Reset"
      >
        ↺
      </button>
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
    case 'code':
      return (
        <CodeExercise
          key={resetKey}
          exercise={exercise}
          onAttempt={onAttempt}
          onComplete={onComplete}
        />
      )
    case 'multiple-choice':
      return (
        <MultipleChoiceExercise
          key={resetKey}
          exercise={exercise}
          onAttempt={onAttempt}
          onComplete={onComplete}
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
  if (hints == null || hints.length == 0) return null
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
