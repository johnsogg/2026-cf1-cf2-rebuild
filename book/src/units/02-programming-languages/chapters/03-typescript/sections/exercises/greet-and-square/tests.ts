// @ts-nocheck
import { greet, square } from './solution'

test('greet returns a greeting', () => {
  expect(greet('Alice')).toBe('Hello, Alice')
  expect(greet('World')).toBe('Hello, World')
})

test('square returns the square of a number', () => {
  expect(square(3)).toBe(9)
  expect(square(4)).toBe(16)
  expect(square(0)).toBe(0)
  expect(square(-2)).toBe(4)
})
