import { closestPointOnSegment } from "./solution"

const a = createVector(0, 0)
const b = createVector(10, 0)

// checks x and y, so the answer can be a p5 vector or a plain object
function expectPoint(actual, x, y) {
  expect(actual.x).toBe(x)
  expect(actual.y).toBe(y)
}

test("point beside the middle of the segment", () => {
  expectPoint(closestPointOnSegment(createVector(4, 5), a, b), 4, 0)
})

test("point past the start: closest is A", () => {
  expectPoint(closestPointOnSegment(createVector(-3, 2), a, b), 0, 0)
})

test("point past the end: closest is B", () => {
  expectPoint(closestPointOnSegment(createVector(15, -1), a, b), 10, 0)
})

test("diagonal segment", () => {
  expectPoint(
    closestPointOnSegment(createVector(4, 0), createVector(0, 0), createVector(4, 4)),
    2,
    2,
  )
})
