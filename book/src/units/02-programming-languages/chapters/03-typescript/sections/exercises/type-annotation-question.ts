import type { MultipleChoiceExerciseProps } from "immerse/components/MultipleChoiceExercise"

const typeAnnotationQuestion: MultipleChoiceExerciseProps = {
  type: "multiple-choice",
  id: "ts-type-annotation-syntax",
  title: "Type annotation syntax",
  prompt:
    "Which of the following correctly annotates a function parameter as a number in TypeScript?",
  options: [
    { text: "function add(x Number) {}" },
    { text: "function add(x: number) {}" },
    { text: "function add(x => number) {}" },
    { text: "function add(number x) {}" },
  ],
  correct: 1,
  hints: [
    "TypeScript uses a colon after the parameter name to specify its type.",
  ],
}

export default typeAnnotationQuestion
