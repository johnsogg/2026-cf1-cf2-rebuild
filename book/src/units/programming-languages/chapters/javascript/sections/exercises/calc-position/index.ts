import starterCode from "./starter.js?raw"
import testCode from "./tests.js?raw"

const exercise = {
  id: "fn-calisthenics-calc-position",
  title: "calcPosition(position, velocity)",
  description:
    "position and velocity are p5 vectors. Return a new vector for the object's position after one step of motion: position + velocity.",
  moduleName: "./solution",
  starterCode,
  testCode,
  hints: [
    "p5.Vector.add(a, b) returns a new vector and leaves a and b alone — see the arithmetic section.",
    "You can also build the vector yourself: createVector(position.x + velocity.x, position.y + velocity.y).",
  ],
}

export default exercise
