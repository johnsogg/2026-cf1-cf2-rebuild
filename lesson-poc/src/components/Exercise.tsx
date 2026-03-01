import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { CodeExerciseProps } from './CodeExercise'
import type { MultipleChoiceExerciseProps } from './MultipleChoiceExercise'
import { CodeExercise } from './CodeExercise'
import { MultipleChoiceExercise } from './MultipleChoiceExercise'

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
  return (
    <div className={`exercise exercise--${attemptState}`}>
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

type AttemptState = 'idle' | 'attempted' | 'complete'

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
  console.log('attemptState:', attemptState)
  return (
    <div className="exercise-header">
      <div className="exercise-header__question">{questionNumber}</div>
      <div className="exercise-header__actions-container">
        <div className={`exercise-header__attempt--${attemptState}`}>
          {attemptState}
        </div>
        <button
          className="btn btn-secondary exercise-header__reset"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

type ExerciseTitleProps = {
  title: string
}
const ExerciseTitle = ({ title }: ExerciseTitleProps) => {
  return <div className="exercise-title">{title}</div>
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
    <div className="exercise-hints">
      {hints.slice(0, hintsRevealed).map((hint, i) => (
        <div key={i} className="exercise-hint">
          <strong>Hint {i + 1}:</strong> {hint}
        </div>
      ))}
      {hintsRevealed < hints.length && (
        <div className="exercise-hint-action">
          <button
            className="btn btn-secondary"
            onClick={() => setHintsRevealed((n) => n + 1)}
          >
            Get a hint
          </button>
        </div>
      )}
    </div>
  )
}
