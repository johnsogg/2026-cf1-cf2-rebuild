import { calcPosition } from "./solution"

// --- Test setup: a tiny stand-in for p5's vectors so createVector and
// --- p5.Vector.add behave here the way they do in a sketch. Ignore this part.
class Vec {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  copy() {
    return new Vec(this.x, this.y)
  }
  add(v) {
    this.x += v.x
    this.y += v.y
    return this
  }
}
globalThis.createVector = (x, y) => new Vec(x, y)
globalThis.p5 = {
  Vector: {
    add: (a, b) => new Vec(a.x + b.x, a.y + b.y),
    sub: (a, b) => new Vec(a.x - b.x, a.y - b.y),
  },
}
// --- end test setup ---

test("adds the velocity to the position", () => {
  const result = calcPosition(createVector(10, 5), createVector(2, -3))
  expect(result.x).toBe(12)
  expect(result.y).toBe(2)
})

test("zero velocity leaves the position where it was", () => {
  const result = calcPosition(createVector(7, 9), createVector(0, 0))
  expect(result.x).toBe(7)
  expect(result.y).toBe(9)
})

test("returns a new vector without changing the original position", () => {
  const pos = createVector(4, 4)
  const result = calcPosition(pos, createVector(1, 1))
  expect(result.x).toBe(5)
  expect(result.y).toBe(5)
  expect(pos.x).toBe(4)
  expect(pos.y).toBe(4)
})

test("works with fractional components", () => {
  const result = calcPosition(createVector(2.5, 0), createVector(0.5, 1.25))
  expect(result.x).toBe(3)
  expect(result.y).toBe(1.25)
})
