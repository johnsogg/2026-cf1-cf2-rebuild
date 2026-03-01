import { useState } from 'react'
import type { CodeExerciseProps } from './CodeExercise'
import type { MultipleChoiceExerciseProps } from './MultipleChoiceExercise'
import { CodeExercise } from './CodeExercise'
import { MultipleChoiceExercise } from './MultipleChoiceExercise'

export type Exercise = CodeExerciseProps | MultipleChoiceExerciseProps

export function Exercise({
  exercise,
  questionNumber,
}: {
  exercise: Exercise
  questionNumber: number
}) {
  const { id, hints } = exercise

  const [resetKey, setResetKey] = useState(0)
  // TODO: need to use a constrained string union AttemptedState instead of a boolean to mark progress - so replace isComplete with attemptState
  const [isComplete, setIsComplete] = useState(
    () => localStorage.getItem(`exercise:${id}:complete`) === 'true'
  )
  const [hintsRevealed, setHintsRevealed] = useState(0)

  const handleComplete = () => {
    setIsComplete(true)
    localStorage.setItem(`exercise:${id}:complete`, 'true')
  }

  const handleReset = () => {
    setResetKey((k) => k + 1)
    setIsComplete(false)
    setHintsRevealed(0)
    localStorage.removeItem(`exercise:${id}:complete`)
  }
  return (
    <div className="exercise">
      <ExerciseHeader
        questionNumber={questionNumber}
        attemptState={attemptState}
      />
      <ExerciseTitle title={exercise.title ?? ''} />
      {/* TODO: Render child component based on the exercise type */}
      <ExerciseContent
        exercise={exercise}
        resetKey={resetKey}
        handleComplete={handleComplete}
      />
      {/* TODO: Render hints component */}
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
}
const ExerciseHeader = ({
  questionNumber,
  attemptState,
}: ExerciseHeaderProps) => {
  return (
    <div className="exercise-header">
      <div className="exercise-header__question">{questionNumber}</div>
      <div className="exercise-header__actions-container">
        <div className="exercise-header__attempt">{attemptState}</div>
        <div className="exercise-header__reset">Reset Btn</div>
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
  handleComplete: VoidFunction
}
const ExerciseContent = ({
  exercise,
  resetKey,
  handleComplete,
}: ExerciseContentProps) => {
  switch (exercise.type) {
    case 'code':
      return (
        <CodeExercise
          key={resetKey}
          exercise={exercise}
          onComplete={handleComplete}
        />
      )
    case 'multiple-choice':
      return (
        <MultipleChoiceExercise
          key={resetKey}
          exercise={exercise}
          onComplete={handleComplete}
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
