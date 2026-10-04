import starterCode from "./starter.js?raw"
import testCode from "./tests.js?raw"

const exercise = {
  id: "geometry-distance",
  title: "distance",
  description:
    "Write distance(a, b), which returns the distance between two points. Each point has x and y properties, like a p5 vector from createVector.",
  moduleName: "./solution",
  starterCode,
  testCode,
  hints: [
    "Start with the legs of the triangle: dx = b.x - a.x and dy = b.y - a.y.",
    "The distance is the hypotenuse: Math.sqrt(dx * dx + dy * dy).",
  ],
}

export default exercise
