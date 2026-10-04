import starterCode from "./starter.js?raw"
import testCode from "./tests.js?raw"

const exercise = {
  id: "geometry-closest-point",
  title: "closestPointOnSegment",
  description:
    "Write closestPointOnSegment(p, a, b), which returns the point on segment AB that's closest to p, as an object with x and y.",
  moduleName: "./solution",
  starterCode,
  testCode,
  hints: [
    "With r = B - A, the t of the closest point on the infinite line is ((p.x - a.x) * r.x + (p.y - a.y) * r.y) / (r.x * r.x + r.y * r.y).",
    "Clamp t so it stays between 0 and 1: Math.min(1, Math.max(0, t)).",
    "Then plug t back into the parametric form: { x: a.x + t * r.x, y: a.y + t * r.y }.",
  ],
}

export default exercise
