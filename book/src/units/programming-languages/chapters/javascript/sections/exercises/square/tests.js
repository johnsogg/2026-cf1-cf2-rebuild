import { square } from "./solution"

test("squares a positive number", () => {
  expect(square(3)).toBe(9)
  expect(square(5)).toBe(25)
})

test("squares zero", () => {
  expect(square(0)).toBe(0)
})

test("squares a negative number", () => {
  expect(square(-4)).toBe(16)
})
