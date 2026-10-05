/// <reference path="../types/p5-math.d.ts" />
import p5Math from "p5/math"

/**
 * p5's math library, without the rest of p5, for code exercises that run in
 * the executor worker (no DOM, no canvas). p5 v2 ships its math as an addon
 * (`p5/math`) that only needs a p5 constructor to register onto, so we hand
 * it a tiny stand-in: `p5.Vector` is the real class, and the global-mode
 * functions (`createVector`, `dist`, `constrain`, `lerp`, `sin`, `atan2`,
 * `random`, `noise`, ...) are the real implementations, bound to an instance.
 *
 * The addon wraps a few methods with decorators (e.g. `v.sub(otherVector)`
 * turns the vector into an array before the raw method sees it), so
 * `registerDecorator` has to actually apply them, the way p5's core does.
 */

// the addon's internals are untyped
type Anything = any

function P5(this: Anything) {
  this._angleMode = "radians"
}
const p5 = P5 as Anything

p5.registerAddon = (addon: Anything) => addon(p5, p5.prototype, {})
p5.registerDecorator = (path: string, decorator: Anything) => {
  // e.g. "p5.Vector.prototype.sub": walk from p5 down to the owner object
  const parts = path.split(".").slice(1)
  const name = parts.pop() as string
  const owner = parts.reduce((o: Anything, key) => o[key], p5)
  owner[name] = decorator(owner[name])
}
p5Math(p5)

// Friendly errors normally come from p5's core; print them to the exercise's
// console output instead.
const friendlyError = (message: string, func?: string) =>
  console.log(`🌸 p5.js says: ${func ? `[${func}] ` : ""}${message}`)
p5._friendlyError = friendlyError
p5.Vector._friendlyError = friendlyError
p5.Vector.prototype._friendlyError = friendlyError

const CONSTANTS = {
  PI: Math.PI,
  HALF_PI: Math.PI / 2,
  QUARTER_PI: Math.PI / 4,
  TWO_PI: Math.PI * 2,
  TAU: Math.PI * 2,
}

/**
 * A fresh set of p5 globals for one exercise run: `p5` itself, every math
 * function bound to a new instance (so `angleMode()` or `randomSeed()` in one
 * run doesn't leak into the next), and the usual constants.
 */
export function p5Globals(): Record<string, unknown> {
  const instance = new p5()
  const globals: Record<string, unknown> = { p5, ...CONSTANTS }
  for (const key of Object.getOwnPropertyNames(p5.prototype)) {
    if (key === "constructor" || key.startsWith("_")) continue
    const value = p5.prototype[key]
    globals[key] = typeof value === "function" ? value.bind(instance) : value
  }
  return globals
}
