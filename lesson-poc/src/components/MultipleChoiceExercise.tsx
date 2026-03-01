import { useState } from 'react'

export type MultipleChoiceExerciseProps = {
  type: 'multiple-choice'
  id: string
  title?: string
  prompt: string
  options: Array<{ text: string; image?: string }>
  correct: number
  hints?: string[]
}

export function MultipleChoiceExercise({
  exercise,
  onAttempt,
  onComplete,
}: {
  exercise: MultipleChoiceExerciseProps
  onAttempt?: () => void
  onComplete?: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const isCorrect = selected === exercise.correct

  const handleSubmit = (selectedIndex: number) => {
    setSelected(selectedIndex)
    setSubmitted(true)
    if (selectedIndex === exercise.correct) {
      onComplete?.()
    } else {
      onAttempt?.()
    }
  }

  const handleOptionClick = (i: number, e: React.MouseEvent) => {
    e.preventDefault()
    if (submitted) return
    setSelected(i)
  }

  const handleOptionDoubleClick = (i: number) => {
    if (submitted) return
    handleSubmit(i)
  }

  return (
    <>
      <p style={{ marginTop: 0, marginBottom: 16, fontWeight: 500 }}>
        {exercise.prompt}
      </p>

      <div className="exercise-options">
        {exercise.options.map((option, i) => {
          const classes = [
            'exercise-option',
            submitted ? 'exercise-option--submitted' : '',
            submitted && i === exercise.correct
              ? 'exercise-option--correct'
              : '',
            submitted && i !== exercise.correct && i === selected
              ? 'exercise-option--incorrect'
              : '',
            !submitted && selected === i ? 'exercise-option--selected' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <label
              key={i}
              onClick={(e) => handleOptionClick(i, e)}
              onDoubleClick={() => handleOptionDoubleClick(i)}
              className={classes}
            >
              <input
                type="radio"
                name={exercise.id}
                value={i}
                checked={selected === i}
                onChange={() => {}}
              />
              <span className="exercise-option__label-text">
                {option.text}
                {option.image && (
                  <img
                    src={option.image}
                    alt=""
                    style={{ display: 'block', marginTop: 8, maxWidth: '100%' }}
                  />
                )}
              </span>
            </label>
          )
        })}
      </div>

      {!submitted && (
        <button
          className="btn btn-primary"
          onClick={() => {
            if (selected !== null) handleSubmit(selected)
          }}
          disabled={selected === null}
        >
          Submit
        </button>
      )}
    </>
  )
}
