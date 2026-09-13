import { lerp } from "./solution"

test("input value at a source range boundary", () => {
  expect(lerp(0, 0, 1, 2, 5)).toBe(2)
  expect(lerp(1, 0, 1, 2, 5)).toBe(5)
})

test("input value outside the source range", () => {
  expect(lerp(2, 0, 1, 2, 5)).toBe(8)
})

test("target range encompasses the source range", () => {
  expect(lerp(0.5, 0, 1, -10, 10)).toBe(0)
})

test("target range is smaller than the source range", () => {
  expect(lerp(25, 0, 100, 0, 10)).toBe(2.5)
})
