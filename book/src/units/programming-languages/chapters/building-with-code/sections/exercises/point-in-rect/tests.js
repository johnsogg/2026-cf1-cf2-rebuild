import { pointInRect } from "./solution"

const r = { x: 10, y: 20, w: 100, h: 50 }

test("point inside", () => {
  expect(pointInRect({ x: 50, y: 40 }, r)).toBe(true)
})

test("point on the edge counts as inside", () => {
  expect(pointInRect({ x: 10, y: 20 }, r)).toBe(true)
  expect(pointInRect({ x: 110, y: 70 }, r)).toBe(true)
})

test("point left of or right of the rectangle", () => {
  expect(pointInRect({ x: 5, y: 40 }, r)).toBe(false)
  expect(pointInRect({ x: 111, y: 40 }, r)).toBe(false)
})

test("point above or below the rectangle", () => {
  expect(pointInRect({ x: 50, y: 19 }, r)).toBe(false)
  expect(pointInRect({ x: 50, y: 71 }, r)).toBe(false)
})
