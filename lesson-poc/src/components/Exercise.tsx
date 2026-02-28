import type { CodeExerciseProps } from './CodeExercise'
import type { MultipleChoiceExerciseProps } from './MultipleChoiceExercise'
import { CodeExercise } from './CodeExercise'
import { MultipleChoiceExercise } from './MultipleChoiceExercise'

export type Exercise = CodeExerciseProps | MultipleChoiceExerciseProps

export function Exercise({ exercise }: { exercise: Exercise }) {
  switch (exercise.type) {
    case 'code':
      return <CodeExercise exercise={exercise} />
    case 'multiple-choice':
      return <MultipleChoiceExercise exercise={exercise} />
  }
}
