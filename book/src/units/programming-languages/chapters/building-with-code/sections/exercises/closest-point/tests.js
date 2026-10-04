import { closestPointOnSegment } from "./solution"

const a = { x: 0, y: 0 }
const b = { x: 10, y: 0 }

test("point beside the middle of the segment", () => {
  expect(closestPointOnSegment({ x: 4, y: 5 }, a, b)).toEqual({ x: 4, y: 0 })
})

test("point past the start: closest is A", () => {
  expect(closestPointOnSegment({ x: -3, y: 2 }, a, b)).toEqual({ x: 0, y: 0 })
})

test("point past the end: closest is B", () => {
  expect(closestPointOnSegment({ x: 15, y: -1 }, a, b)).toEqual({ x: 10, y: 0 })
})

test("diagonal segment", () => {
  expect(
    closestPointOnSegment({ x: 4, y: 0 }, { x: 0, y: 0 }, { x: 4, y: 4 }),
  ).toEqual({ x: 2, y: 2 })
})
