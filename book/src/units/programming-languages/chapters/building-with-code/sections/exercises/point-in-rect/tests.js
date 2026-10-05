import { pointInRect } from "./solution"

const r = { x: 10, y: 20, w: 100, h: 50 }

test("point inside", () => {
  expect(pointInRect(createVector(50, 40), r)).toBe(true)
})

test("point on the edge counts as inside", () => {
  expect(pointInRect(createVector(10, 20), r)).toBe(true)
  expect(pointInRect(createVector(110, 70), r)).toBe(true)
})

test("point left of or right of the rectangle", () => {
  expect(pointInRect(createVector(5, 40), r)).toBe(false)
  expect(pointInRect(createVector(111, 40), r)).toBe(false)
})

test("point above or below the rectangle", () => {
  expect(pointInRect(createVector(50, 19), r)).toBe(false)
  expect(pointInRect(createVector(50, 71), r)).toBe(false)
})
