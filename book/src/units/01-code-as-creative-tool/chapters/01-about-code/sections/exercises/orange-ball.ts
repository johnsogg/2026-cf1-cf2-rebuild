import type { P5ExerciseProps } from "immerse/components/P5Exercise"

export const orangeBallExercise: P5ExerciseProps = {
  type: "p5",
  id: "orange-ball-at-cursor",
  title: "Orange ball follows cursor",
  size: "large",
  initialCode: `function setup() {
  createCanvas(windowWidth, windowHeight)
  noStroke()
}

function draw() {
  background(30)
  fill(255, 140, 0)
  ellipse(mouseX, mouseY, 40, 40)
}
`,
}
