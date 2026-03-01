import { useRef, useState } from 'react'

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
  const lastClickRef = useRef<{ index: number; time: number } | null>(null)

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
    const now = Date.now()
    const last = lastClickRef.current
    if (last?.index === i && now - last.time < 500) {
      handleSubmit(i)
      lastClickRef.current = null
    } else {
      setSelected(i)
      lastClickRef.current = { index: i, time: now }
    }
  }

  return (
    <>
      <p style={{ marginTop: 0, marginBottom: 16, fontWeight: 500 }}>{exercise.prompt}</p>

      <div className="exercise-options">
        {exercise.options.map((option, i) => {
          const classes = [
            'exercise-option',
            submitted ? 'exercise-option--submitted' : '',
            submitted && i === exercise.correct ? 'exercise-option--correct' : '',
            submitted && i !== exercise.correct && i === selected ? 'exercise-option--incorrect' : '',
            !submitted && selected === i ? 'exercise-option--selected' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <label key={i} onClick={(e) => handleOptionClick(i, e)} className={classes}>
              <input
                type="radio"
                name={exercise.id}
                value={i}
                checked={selected === i}
                onChange={() => {}}
                style={{ marginTop: 2 }}
              />
              <span>
                {option.text}
                {option.image && (
                  <img src={option.image} alt="" style={{ display: 'block', marginTop: 8, maxWidth: '100%' }} />
                )}
              </span>
            </label>
          )
        })}
      </div>

      {!submitted ? (
        <button
          className="btn btn-primary"
          onClick={() => { if (selected !== null) handleSubmit(selected) }}
          disabled={selected === null}
        >
          Submit
        </button>
      ) : (
        <div className={`exercise-feedback ${isCorrect ? 'exercise-feedback--correct' : 'exercise-feedback--incorrect'}`}>
          {isCorrect
            ? '✓ Correct!'
            : `✗ Not quite. The correct answer is: "${exercise.options[exercise.correct].text}"`}
        </div>
      )}
    </>
  )
}
