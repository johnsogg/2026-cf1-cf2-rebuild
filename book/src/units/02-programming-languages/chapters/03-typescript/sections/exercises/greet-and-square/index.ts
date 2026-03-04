import type { CodeExerciseProps } from 'immerse/components/CodeExercise'
import starterCode from './starter.ts?raw'
import testCode from './tests.ts?raw'

const exercise: CodeExerciseProps = {
  type: 'code',
  id: 'greet-and-square',
  title: 'greet and square',
  description: 'Implement two functions:\n- greet(name) should return "Hello <name>"\n- square(n) should return n²',
  moduleName: './solution',
  starterCode,
  testCode,
  hints: [
    'Use a template literal: return `Hello ${name}`',
    'For square, multiply the number by itself: return n * n',
  ],
}

export default exercise
