import { magnitude } from "./solution"

test("3–4–5 right triangle", () => {
  expect(magnitude(3, 4)).toBe(5)
})

test("5–12–13 right triangle", () => {
  expect(magnitude(5, 12)).toBe(13)
})

test("zero at the origin", () => {
  expect(magnitude(0, 0)).toBe(0)
})

test("works along a single axis", () => {
  expect(magnitude(0, 7)).toBe(7)
  expect(magnitude(-6, 0)).toBe(6)
})
