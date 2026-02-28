import type { MultipleChoiceExerciseProps } from '../components/MultipleChoiceExercise'

const whatIsAVariable: MultipleChoiceExerciseProps = {
  type: 'multiple-choice',
  id: 'what-is-a-variable',
  prompt: 'Which of the following best describes a variable in JavaScript?',
  options: [
    { text: 'A fixed value that cannot be changed after it is set.' },
    { text: 'A named container that holds a value, which can be updated over time.' },
    { text: 'A function that returns different values each time it is called.' },
    { text: 'A built-in JavaScript keyword used to print output.' },
  ],
  correct: 1,
}

export default whatIsAVariable
