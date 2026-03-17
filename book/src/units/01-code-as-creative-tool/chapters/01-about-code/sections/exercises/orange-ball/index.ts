import type { P5ExerciseProps } from "immerse/components/P5Exercise"
import initialCode from "./starter.ts?raw"

export const orangeBallExercise: P5ExerciseProps = {
  type: "p5",
  id: "orange-ball-at-cursor",
  title: "Orange ball follows cursor",
  size: "medium",
  initialCode,
}

export default orangeBallExercise
