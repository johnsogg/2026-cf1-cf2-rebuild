import starterCode from "./starter.js?raw"
import testCode from "./tests.js?raw"

const exercise = {
  id: "fn-calisthenics-magnitude",
  title: "magnitude(x, y)",
  description:
    "Given a vector's x and y parts as separate numbers, return its magnitude: the distance from the origin, sqrt(x² + y²).",
  moduleName: "./solution",
  starterCode,
  testCode,
  hints: [
    "A vector's length is sqrt(x² + y²) — see the vectors part of the arithmetic section.",
    "Math.sqrt(n) gives you the square root of n.",
  ],
}

export default exercise
