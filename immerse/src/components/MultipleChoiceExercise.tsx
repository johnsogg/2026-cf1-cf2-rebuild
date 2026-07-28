import { useEffect, useState } from "react"
import s from "./MultipleChoiceExercise.module.css"
import btn from "../styles/buttons.module.css"
import { getStorageValue, setStorageValue } from "../storage"
import { useAsk } from "./Ask"

export type MultipleChoiceExerciseProps = {
  prompt: string
  options: Array<{ text: string; image?: string }>
  correct: number
}

/**
 * Single-answer multiple-choice question. Click an option to select it,
 * double-click to submit. Options can carry an optional `image`.
 */
export function MultipleChoiceExercise({
  exercise,
}: {
  exercise: MultipleChoiceExerciseProps
}) {
  const { id, declareGradable, reportGrade } = useAsk()

  useEffect(() => {
    declareGradable()
  }, [declareGradable])

  const [selected, setSelected] = useState<number | null>(
    () => getStorageValue((d) => d.exercises?.[id]?.selected) ?? null,
  )
  const [submitted, setSubmitted] = useState(
    () => getStorageValue((d) => d.exercises?.[id]?.submitted) ?? false,
  )

  const handleSubmit = (selectedIndex: number) => {
    setSelected(selectedIndex)
    setSubmitted(true)
    setStorageValue((d) => {
      const e = ((d.exercises ??= {})[id] ??= {})
      e.selected = selectedIndex
      e.submitted = true
    })
    reportGrade(selectedIndex === exercise.correct)
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
      <p className={s.prompt}>{exercise.prompt}</p>

      <div className={s.options}>
        {exercise.options.map((option, i) => {
          const classes = [
            s.option,
            submitted ? s.optionSubmitted : "",
            submitted && i === exercise.correct ? s.optionCorrect : "",
            submitted && i !== exercise.correct && i === selected
              ? s.optionIncorrect
              : "",
            !submitted && selected === i ? s.optionSelected : "",
          ]
            .filter(Boolean)
            .join(" ")

          return (
            <label
              key={i}
              onClick={(e) => handleOptionClick(i, e)}
              onDoubleClick={() => handleOptionDoubleClick(i)}
              className={classes}
            >
              <input
                type="radio"
                name={id}
                value={i}
                checked={selected === i}
                onChange={() => {}}
              />
              <span className={s.labelText}>
                {option.text}
                {option.image && (
                  <img src={option.image} alt="" className={s.optionImage} />
                )}
              </span>
            </label>
          )
        })}
      </div>

      {!submitted && (
        <button
          className={btn.btnPrimary}
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
