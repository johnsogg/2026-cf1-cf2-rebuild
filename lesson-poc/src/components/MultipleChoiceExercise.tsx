import { useRef, useState } from 'react'

export type MultipleChoiceExerciseProps = {
  type: 'multiple-choice'
  id: string
  prompt: string
  options: Array<{ text: string; image?: string }>
  correct: number
}

export function MultipleChoiceExercise({ exercise }: { exercise: MultipleChoiceExerciseProps }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const lastClickRef = useRef<{ index: number; time: number } | null>(null)

  const isCorrect = selected === exercise.correct

  const handleOptionClick = (i: number, e: React.MouseEvent) => {
    e.preventDefault()
    if (submitted) return
    const now = Date.now()
    const last = lastClickRef.current
    if (last?.index === i && now - last.time < 500) {
      setSelected(i)
      setSubmitted(true)
      lastClickRef.current = null
    } else {
      setSelected(i)
      lastClickRef.current = { index: i, time: now }
    }
  }

  const handleReset = () => {
    setSelected(null)
    setSubmitted(false)
    lastClickRef.current = null
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 20, marginBottom: 24 }}>
      <p style={{ marginTop: 0, marginBottom: 16, fontWeight: 500 }}>{exercise.prompt}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {exercise.options.map((option, i) => (
          <label
            key={i}
            onClick={(e) => handleOptionClick(i, e)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              cursor: submitted ? 'default' : 'pointer',
              padding: '8px 12px',
              borderRadius: 4,
              border: '1px solid var(--border)',
              background: submitted
                ? i === exercise.correct
                  ? 'var(--success-bg)'
                  : i === selected
                  ? 'var(--error-bg)'
                  : 'var(--bg)'
                : selected === i
                ? 'var(--accent-subtle)'
                : 'var(--bg)',
            }}
          >
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
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={() => { if (selected !== null) setSubmitted(true) }}
          disabled={selected === null}
          style={{
            padding: '8px 20px',
            fontSize: 15,
            cursor: selected === null ? 'not-allowed' : 'pointer',
            background: selected === null ? 'var(--text-muted)' : 'var(--accent)',
            color: 'var(--accent-text)',
            border: 'none',
            borderRadius: 4,
          }}
        >
          Submit
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            padding: '10px 14px',
            borderRadius: 4,
            background: isCorrect ? 'var(--success-bg)' : 'var(--error-bg)',
            border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
          }}>
            {isCorrect ? '✓ Correct!' : `✗ Not quite. The correct answer is: "${exercise.options[exercise.correct].text}"`}
          </div>
          <div>
            <button
              onClick={handleReset}
              style={{
                padding: '8px 20px',
                fontSize: 15,
                cursor: 'pointer',
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                borderRadius: 4,
              }}
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
