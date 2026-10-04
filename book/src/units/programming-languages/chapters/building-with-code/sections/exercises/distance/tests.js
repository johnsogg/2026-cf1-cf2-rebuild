import { distance } from "./solution"

test("a 3-4-5 triangle", () => {
  expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
})

test("the order of the points doesn't matter", () => {
  expect(distance({ x: 3, y: 4 }, { x: 0, y: 0 })).toBe(5)
})

test("a point is zero distance from itself", () => {
  expect(distance({ x: 7, y: 2 }, { x: 7, y: 2 })).toBe(0)
})

test("points that aren't at the origin", () => {
  expect(distance({ x: 10, y: 20 }, { x: 16, y: 28 })).toBe(10)
})
