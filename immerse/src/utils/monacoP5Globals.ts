import type { Monaco } from "@monaco-editor/react"

/**
 * Type declarations for the p5 math globals that code exercises can use at
 * run time (see `workers/p5Headless.ts`), so the editor doesn't underline
 * `p5.Vector` or `createVector` as unknown names. Loosely typed on purpose:
 * this is for red squiggles and autocomplete, not strict checking.
 *
 * Written as a module with `declare global` because `isolateMonacoTypescriptFiles`
 * makes every file a module, which would otherwise hide these declarations.
 */
const P5_GLOBALS_DTS = `
export {}

declare global {
  class P5Vector {
    x: number
    y: number
    z: number
    set(...args: any[]): P5Vector
    copy(): P5Vector
    add(...args: any[]): P5Vector
    sub(...args: any[]): P5Vector
    mult(...args: any[]): P5Vector
    div(...args: any[]): P5Vector
    mag(): number
    magSq(): number
    dot(v: P5Vector): number
    cross(v: P5Vector): P5Vector
    dist(v: P5Vector): number
    normalize(): P5Vector
    limit(max: number): P5Vector
    setMag(len: number): P5Vector
    heading(): number
    setHeading(angle: number): P5Vector
    rotate(angle: number): P5Vector
    angleBetween(v: P5Vector): number
    lerp(...args: any[]): P5Vector
    array(): number[]
    equals(...args: any[]): boolean
    static add(a: P5Vector, b: P5Vector): P5Vector
    static sub(a: P5Vector, b: P5Vector): P5Vector
    static mult(v: P5Vector, n: number): P5Vector
    static div(v: P5Vector, n: number): P5Vector
    static dot(a: P5Vector, b: P5Vector): number
    static cross(a: P5Vector, b: P5Vector): P5Vector
    static dist(a: P5Vector, b: P5Vector): number
    static lerp(a: P5Vector, b: P5Vector, t: number): P5Vector
    static mag(v: P5Vector): number
    static normalize(v: P5Vector): P5Vector
    static fromAngle(angle: number, length?: number): P5Vector
  }

  const p5: { Vector: typeof P5Vector }
  function createVector(...components: number[]): P5Vector

  function abs(n: number): number
  function ceil(n: number): number
  function floor(n: number): number
  function round(n: number, decimals?: number): number
  function constrain(n: number, low: number, high: number): number
  function dist(...coords: number[]): number
  function lerp(start: number, stop: number, amt: number): number
  function map(value: number, start1: number, stop1: number, start2: number, stop2: number, withinBounds?: boolean): number
  function norm(value: number, start: number, stop: number): number
  function mag(x: number, y: number): number
  function max(...args: any[]): number
  function min(...args: any[]): number
  function pow(n: number, e: number): number
  function sq(n: number): number
  function sqrt(n: number): number
  function exp(n: number): number
  function log(n: number): number
  function fract(n: number): number
  function random(...args: any[]): any
  function randomGaussian(mean?: number, sd?: number): number
  function randomSeed(seed: number): void
  function noise(x: number, y?: number, z?: number): number
  function noiseSeed(seed: number): void
  function noiseDetail(lod: number, falloff: number): void
  function sin(angle: number): number
  function cos(angle: number): number
  function tan(angle: number): number
  function asin(n: number): number
  function acos(n: number): number
  function atan(n: number): number
  function atan2(y: number, x: number): number
  function degrees(radians: number): number
  function radians(degrees: number): number
  function angleMode(mode?: string): any

  const PI: number
  const HALF_PI: number
  const QUARTER_PI: number
  const TWO_PI: number
  const TAU: number
  const DEGREES: string
  const RADIANS: string
}
`

let registered = false

/** Call in every exercise editor's beforeMount handler. Idempotent. */
export function registerMonacoP5Globals(monaco: Monaco): void {
  if (registered) return
  registered = true
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    P5_GLOBALS_DTS,
    "file:///p5-globals.d.ts",
  )
}
