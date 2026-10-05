import { distance } from "./solution"

test("a 3-4-5 triangle", () => {
  expect(distance(createVector(0, 0), createVector(3, 4))).toBe(5)
})

test("the order of the points doesn't matter", () => {
  expect(distance(createVector(3, 4), createVector(0, 0))).toBe(5)
})

test("a point is zero distance from itself", () => {
  expect(distance(createVector(7, 2), createVector(7, 2))).toBe(0)
})

test("points that aren't at the origin", () => {
  expect(distance(createVector(10, 20), createVector(16, 28))).toBe(10)
})
