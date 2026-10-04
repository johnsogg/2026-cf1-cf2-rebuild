import starterCode from "./starter.js?raw"
import testCode from "./tests.js?raw"

const exercise = {
  id: "geometry-point-in-rect",
  title: "pointInRect",
  description:
    "Write pointInRect(p, r), which returns true if point p is inside (or on the edge of) the axis-aligned rectangle r.",
  moduleName: "./solution",
  starterCode,
  testCode,
  hints: [
    "The rectangle spans r.x to r.x + r.w horizontally, and r.y to r.y + r.h vertically.",
    "The point has to be inside both spans at once, so combine four comparisons with &&.",
  ],
}

export default exercise
