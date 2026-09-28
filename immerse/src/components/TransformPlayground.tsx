import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import { useTheme } from "../hooks/useTheme"
import { SvgIcon } from "./SvgIcon"
import s from "./TransformPlayground.module.css"

/**
 * Usage (in a book `.mdx` section):
 *
 * ```mdx
 * import { TransformPlayground } from "immerse/components/TransformPlayground"
 *
 * <TransformPlayground />
 * ```
 *
 * 2D affine-transform sandbox. The reader builds a stack of translate /
 * rotate / scale transforms (applied top to bottom, the same order as p5
 * calls), and the Magpie from the Space Junk homework is drawn in the
 * resulting object space. User-facing text calls it "the object", since the
 * surrounding prose may not introduce the Magpie by name.
 *
 * Two views:
 * - `"object"`: the camera is locked to object space - the object's origin is
 *   centered and its axes are square to the screen, so the Magpie never looks
 *   any different. The world grid is drawn through the inverse of the stack,
 *   so it's the world that moves, turns, and stretches.
 * - `"world"`: the world origin is centered and square to the screen, and the
 *   Magpie (plus its object grid) is drawn through the stack.
 *
 * Picking a kind under "Add a transform" starts a new one; the first edit to
 * it adds it to the stack (no Add button). Selecting a transform in the stack
 * edits it in place, live; "Revert" restores the values it had when it was
 * selected. The stack starts empty, i.e. the identity. Below the editor, a
 * plain-language narration describes the current view and stack.
 */
export interface TransformPlaygroundProps {
  width?: number
  height?: number
  /** screen px per unit, applied by the camera in both views */
  zoom?: number
  /** what's drawn behind the object to start with (the reader can switch it) */
  backdrop?: Backdrop
}

// [a, b, c, d, e, f] is the canvas/DOMMatrix convention for
//   | a c e |
//   | b d f |
//   | 0 0 1 |
type Mat = [number, number, number, number, number, number]

interface Point {
  x: number
  y: number
}

type Transform =
  | { id: number; kind: "translate"; x: number; y: number }
  | { id: number; kind: "rotate"; angle: number; unit: "rad" | "deg" }
  | { id: number; kind: "scale"; x: number; y: number; locked: boolean }

type Kind = Transform["kind"]
type View = "world" | "object"
type Backdrop = "space" | "grids" | "both"

const BACKDROPS: { value: Backdrop; label: string }[] = [
  { value: "space", label: "Show space" },
  { value: "grids", label: "Show grids" },
  { value: "both", label: "Show both" },
]

const CANVAS_SCALE = 2
const WORLD_GRID = 20
const OBJECT_GRID = 10
// Same length for both, so with an empty stack (identity) the two sets of
// x/y arrows coincide instead of stacking up doubled labels.
const WORLD_BASIS = 30
const OBJECT_BASIS = 30
const ARROWHEAD_LENGTH = 8
// skip grid lines (but keep axes) when a grid gets squashed this dense
const MAX_GRID_LINES = 400
// starfield repeats in square tiles of this many world units
const STAR_TILE = 120
const STARS_PER_TILE = 14
// skip the stars when the world is squashed small enough to need this many
const MAX_STAR_TILES = 600
// After drawing, the space scene is faded this far toward the page background
// (a translucent veil over the finished scene, so overlapping parts like the
// planet and its ring stay opaque to each other), keeping it a quiet backdrop.
const SPACE_FADE = 0.3
const CROSSHAIR = 10
const DRAFT_ID = -1

// Magpie dimensions, copied from space-junk/magpie.js
const DOME_WIDTH = 20
const DOME_HEIGHT = 30
const PLATFORM_WIDTH = DOME_WIDTH + 6
const PLATFORM_HEIGHT = 3
const BEAM_WIDTH = 50
const BEAM_HEIGHT = 60
const WINDOW_WIDTH = DOME_WIDTH / 4
const WINDOW_HEIGHT = DOME_HEIGHT / 4

const IDENTITY: Mat = [1, 0, 0, 1, 0, 0]

function multiply(m: Mat, n: Mat): Mat {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ]
}

// null when the matrix squashes space flat (e.g. a scale of 0)
function invert(m: Mat): Mat | null {
  const [a, b, c, d, e, f] = m
  const det = a * d - b * c
  if (Math.abs(det) < 1e-9) return null
  return [
    d / det,
    -b / det,
    -c / det,
    a / det,
    (c * f - d * e) / det,
    (b * e - a * f) / det,
  ]
}

function apply(m: Mat, p: Point): Point {
  return {
    x: m[0] * p.x + m[2] * p.y + m[4],
    y: m[1] * p.x + m[3] * p.y + m[5],
  }
}

function toMatrix(t: Transform): Mat {
  switch (t.kind) {
    case "translate":
      return [1, 0, 0, 1, t.x, t.y]
    case "rotate":
      return [
        Math.cos(t.angle),
        Math.sin(t.angle),
        -Math.sin(t.angle),
        Math.cos(t.angle),
        0,
        0,
      ]
    case "scale":
      return [t.x, 0, 0, t.y, 0, 0]
  }
}

function defaultTransform(kind: Kind, id = DRAFT_ID): Transform {
  switch (kind) {
    case "translate":
      return { id, kind, x: 0, y: 0 }
    case "rotate":
      return { id, kind, angle: 0, unit: "rad" }
    case "scale":
      return { id, kind, x: 1, y: 1, locked: true }
  }
}

const round = (v: number, places: number) => {
  const k = 10 ** places
  // `+ 0` turns -0 into 0
  return String(Math.round(v * k) / k + 0)
}

const toDegrees = (rad: number) => (rad * 180) / Math.PI
const toRadians = (deg: number) => (deg * Math.PI) / 180

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

// k quarters of π as a reduced fraction, e.g. 2 -> 1/2, -3 -> -3/4, 8 -> 2/1
function quarterFraction(k: number) {
  const g = gcd(Math.abs(k), 4)
  return { num: k / g, den: 4 / g }
}

// text form for the narration, e.g. 2 -> "π/2", -3 -> "-3π/4"
function piFraction(k: number): string {
  if (k === 0) return "0"
  const { num, den } = quarterFraction(k)
  const coefficient = num === 1 ? "" : num === -1 ? "-" : num
  return `${coefficient}π${den === 1 ? "" : `/${den}`}`
}

// Stacked-fraction label for the rotate presets, fraction to the left of π
// (1/4 π, 1/2 π, 3/4 π...), so the quarter-step progression is easy to see.
const PiLabel = ({ k }: { k: number }) => {
  if (k === 0) return <>0</>
  const { num, den } = quarterFraction(Math.abs(k))
  return (
    <>
      {k < 0 && "-"}
      {den === 1 ? (
        num !== 1 && num
      ) : (
        <span className={s.fraction}>
          <span className={s.numerator}>{num}</span>
          <span>{den}</span>
        </span>
      )}
      π
    </>
  )
}

// the eight quarter-pi stops from 0 to 2π, for the rotate presets
const PI_STOPS = [0, 1, 2, 3, 4, 5, 6, 7, 8]

function narrateRotate(angle: number, unit: "rad" | "deg"): string {
  const k = Math.round(angle / (Math.PI / 4))
  const off = Math.abs(angle - (k * Math.PI) / 4)
  const pi =
    off < 1e-6
      ? `, exactly ${piFraction(k)}`
      : off < 0.02
        ? `, very close to ${piFraction(k)}`
        : ""
  const rad = `${round(angle, 4)} radians`
  const deg = `${round(toDegrees(angle), 1)} degrees`
  return unit === "rad"
    ? `rotate by ${rad} (${deg}${pi})`
    : `rotate by ${deg} (${rad}${pi})`
}

// how one scale factor changes size along an axis, ignoring its sign
function sizeChange(factor: number, bigger: string, smaller: string) {
  const size = Math.abs(factor)
  if (size === 1) return null
  return size > 1 ? bigger : smaller
}

function narrateScale(x: number, y: number): string {
  const uniform = x === y
  let sentence = uniform
    ? `scale uniformly by ${round(x, 2)}`
    : `apply a non-uniform scale (${round(x, 2)} in x, ${round(y, 2)} in y)`
  if (x === 0 || y === 0) {
    return `${sentence}. A factor of 0 squashes the object flat, and nothing drawn after this step is visible`
  }
  const changes = uniform
    ? [sizeChange(x, "larger than it was", "smaller than it was")]
    : [sizeChange(x, "wider", "narrower"), sizeChange(y, "taller", "shorter")]
  const shown = changes.filter((c) => c !== null)
  if (shown.length > 0) {
    sentence += `, so the object comes out ${shown.join(" and ")}`
  }
  // A negative factor turns that axis around. One flipped axis draws the
  // mirror image; flipping both is the same as a half turn.
  if (x < 0 && y < 0) {
    sentence += `. Both factors are negative, which turns the object upside down, the same as rotating by π`
  } else if (x < 0) {
    sentence += `. The negative x factor flips the object left-to-right, like a mirror image`
  } else if (y < 0) {
    sentence += `. The negative y factor flips the object top-to-bottom, like a mirror image`
  }
  return sentence
}

function narrate(view: View, stack: Transform[]): string {
  const intro = `You're viewing the scene in ${view} space.`
  const outro =
    view === "object"
      ? "The camera follows object space, so the object appears to stay put while the world moves instead."
      : "The object is drawn at the origin of the resulting object space."
  if (stack.length === 0) {
    return `${intro} The stack is empty (just the identity), so world space and object space line up exactly.`
  }
  const steps = stack.map((t, i) => {
    const phrase =
      t.kind === "translate"
        ? `translate by (${round(t.x, 2)}, ${round(t.y, 2)})`
        : t.kind === "rotate"
          ? narrateRotate(t.angle, t.unit)
          : narrateScale(t.x, t.y)
    return `${i === 0 ? "First" : "Then"}, ${phrase}.`
  })
  return [intro, ...steps, outro].join(" ")
}

// k quarters of π using p5's built-in constants, e.g. 2 -> "HALF_PI",
// -3 -> "-3 * QUARTER_PI"
function p5PiConstant(k: number): string {
  const sign = k < 0 ? "-" : ""
  const n = Math.abs(k)
  const named: Record<number, string> = {
    1: "QUARTER_PI",
    2: "HALF_PI",
    4: "PI",
    8: "TWO_PI",
  }
  if (n === 0) return "0"
  if (named[n]) return sign + named[n]
  return n % 2 === 0 ? `${sign}${n / 2} * HALF_PI` : `${sign}${n} * QUARTER_PI`
}

function p5Call(t: Transform): string {
  switch (t.kind) {
    case "translate":
      return `translate(${round(t.x, 2)}, ${round(t.y, 2)});`
    case "scale":
      return t.x === t.y
        ? `scale(${round(t.x, 3)});`
        : `scale(${round(t.x, 3)}, ${round(t.y, 3)});`
    case "rotate": {
      // p5's rotate() takes radians unless angleMode(DEGREES) is set, so
      // degrees go through radians() to keep the reader's number visible
      if (t.unit === "deg") {
        return `rotate(radians(${round(toDegrees(t.angle), 2)}));`
      }
      const k = Math.round(t.angle / (Math.PI / 4))
      return Math.abs(t.angle - (k * Math.PI) / 4) < 1e-6
        ? `rotate(${p5PiConstant(k)});`
        : `rotate(${round(t.angle, 4)});`
    }
  }
}

function p5Code(stack: Transform[]): string {
  return [
    "function drawScene() {",
    "  push();",
    ...stack.map((t) => `  ${p5Call(t)}`),
    "  drawObject(); // replace with your render code",
    "  pop();",
    "}",
    "",
  ].join("\n")
}

function describe(t: Transform): React.ReactNode {
  switch (t.kind) {
    case "translate":
      return `translate ${round(t.x, 2)}, ${round(t.y, 2)}`
    case "rotate": {
      // exact quarter-π stops (e.g. from a preset) read as degrees plus the
      // π fraction, whichever unit is chosen
      const k = Math.round(t.angle / (Math.PI / 4))
      if (Math.abs(t.angle - (k * Math.PI) / 4) < 1e-6) {
        return (
          <>
            rotate {k * 45}° (<PiLabel k={k} />)
          </>
        )
      }
      return t.unit === "rad"
        ? `rotate ${round(t.angle, 3)} rad`
        : `rotate ${round(toDegrees(t.angle), 1)}°`
    }
    case "scale":
      return t.locked
        ? `scale ${round(t.x, 2)}`
        : `scale ${round(t.x, 2)}, ${round(t.y, 2)}`
  }
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
  label: string,
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(to.x, to.y)
  ctx.lineTo(
    to.x - ARROWHEAD_LENGTH * Math.cos(angle - Math.PI / 6),
    to.y - ARROWHEAD_LENGTH * Math.sin(angle - Math.PI / 6),
  )
  ctx.lineTo(
    to.x - ARROWHEAD_LENGTH * Math.cos(angle + Math.PI / 6),
    to.y - ARROWHEAD_LENGTH * Math.sin(angle + Math.PI / 6),
  )
  ctx.closePath()
  ctx.fill()
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(label, to.x + 10 * Math.cos(angle), to.y + 10 * Math.sin(angle))
}

// The part of whatever space `toScreen` maps from that lands on the canvas,
// as a bounding box in that space: pull the canvas corners back through it.
function visibleBounds(toScreen: Mat, width: number, height: number) {
  const fromScreen = invert(toScreen)
  if (!fromScreen) return null
  const corners = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: 0, y: height },
    { x: width, y: height },
  ].map((p) => apply(fromScreen, p))
  return {
    minX: Math.min(...corners.map((p) => p.x)),
    maxX: Math.max(...corners.map((p) => p.x)),
    minY: Math.min(...corners.map((p) => p.y)),
    maxY: Math.max(...corners.map((p) => p.y)),
  }
}

// Small seeded PRNG (mulberry32), so each star tile comes out the same on
// every repaint.
function seededRandom(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let r = Math.imul(a ^ (a >>> 15), 1 | a)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

// Landmarks, in world units. With the default zoom, world view shows roughly
// x in [-120, 120] and y in [-90, 90].
const PLANET = { x: 70, y: -45, r: 22 }
const RING = { rx: 38, ry: 8, tilt: -0.3 }
const MOONS = [
  { x: 108, y: -8, r: 3 },
  { x: -85, y: 50, r: 7 },
  { x: -45, y: -68, r: 4 },
]

/**
 * A plain space scene drawn in world space, to give the world some landmarks:
 * a seeded, tiled starfield (so it never runs out, however far the world is
 * panned), a ringed planet, and a few moons. Everything is drawn through
 * `worldToScreen`, so it moves, turns, and stretches exactly like the world
 * grid does. Stars use the theme's text color, so the light theme reads like
 * a star chart.
 */
function drawSpace(
  ctx: CanvasRenderingContext2D,
  worldToScreen: Mat,
  starColor: string,
  bg: string,
  width: number,
  height: number,
) {
  const bounds = visibleBounds(worldToScreen, width, height)
  if (!bounds) return

  ctx.save()
  ctx.transform(...worldToScreen)

  const i0 = Math.floor(bounds.minX / STAR_TILE)
  const i1 = Math.floor(bounds.maxX / STAR_TILE)
  const j0 = Math.floor(bounds.minY / STAR_TILE)
  const j1 = Math.floor(bounds.maxY / STAR_TILE)
  if ((i1 - i0 + 1) * (j1 - j0 + 1) <= MAX_STAR_TILES) {
    ctx.fillStyle = starColor
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const random = seededRandom((i * 73856093) ^ (j * 19349663))
        for (let n = 0; n < STARS_PER_TILE; n++) {
          const x = (i + random()) * STAR_TILE
          const y = (j + random()) * STAR_TILE
          const r = 0.3 + random() * random() * 1.2
          ctx.globalAlpha = 0.25 + random() * 0.55
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    ctx.globalAlpha = 1
  }

  const shaded = (
    x: number,
    y: number,
    r: number,
    light: string,
    dark: string,
  ) => {
    const g = ctx.createRadialGradient(
      x - r * 0.4,
      y - r * 0.4,
      r * 0.1,
      x,
      y,
      r,
    )
    g.addColorStop(0, light)
    g.addColorStop(1, dark)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  for (const moon of MOONS) {
    shaded(moon.x, moon.y, moon.r, "#c9ccd1", "#6d727a")
  }

  // ring: the far half goes behind the planet, the near half in front
  const ring = (start: number, end: number) => {
    ctx.strokeStyle = "#e3c99a"
    ctx.globalAlpha = 0.8
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(PLANET.x, PLANET.y, RING.rx, RING.ry, RING.tilt, start, end)
    ctx.stroke()
    ctx.globalAlpha = 1
  }
  ring(Math.PI, Math.PI * 2)
  shaded(PLANET.x, PLANET.y, PLANET.r, "#e2a86f", "#8a4f2c")
  ring(0, Math.PI)

  ctx.restore()

  ctx.globalAlpha = SPACE_FADE
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)
  ctx.globalAlpha = 1
}

/**
 * Draws a grid for whatever space `toScreen` maps from. Lines are found by
 * pulling the canvas corners back into that space, then each line's endpoints
 * are pushed forward to the screen - so line widths stay in screen pixels no
 * matter how the space is scaled.
 */
function drawGrid(
  ctx: CanvasRenderingContext2D,
  toScreen: Mat,
  spacing: number,
  basisLength: number,
  color: string,
  width: number,
  height: number,
) {
  const bounds = visibleBounds(toScreen, width, height)
  if (!bounds) return
  const { minX, maxX, minY, maxY } = bounds

  const line = (from: Point, to: Point) => {
    const a = apply(toScreen, from)
    const b = apply(toScreen, to)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  const i0 = Math.ceil(minX / spacing)
  const i1 = Math.floor(maxX / spacing)
  const j0 = Math.ceil(minY / spacing)
  const j1 = Math.floor(maxY / spacing)

  ctx.strokeStyle = color
  if (i1 - i0 + (j1 - j0) < MAX_GRID_LINES) {
    ctx.globalAlpha = 0.3
    ctx.lineWidth = 1
    for (let i = i0; i <= i1; i++) {
      line({ x: i * spacing, y: minY }, { x: i * spacing, y: maxY })
    }
    for (let j = j0; j <= j1; j++) {
      line({ x: minX, y: j * spacing }, { x: maxX, y: j * spacing })
    }
  }

  ctx.globalAlpha = 0.8
  ctx.lineWidth = 1.5
  line({ x: 0, y: minY }, { x: 0, y: maxY })
  line({ x: minX, y: 0 }, { x: maxX, y: 0 })
  ctx.globalAlpha = 1

  const origin = apply(toScreen, { x: 0, y: 0 })
  ctx.font = `600 13px "Public Sans", system-ui, sans-serif`
  drawArrow(ctx, origin, apply(toScreen, { x: basisLength, y: 0 }), color, "x")
  drawArrow(ctx, origin, apply(toScreen, { x: 0, y: basisLength }), color, "y")
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(origin.x, origin.y, 3, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * Port of `Magpie.drawMagpie` (beam on) to canvas 2D. The p5 version's
 * `rotate(physics.rotation)` is dropped - here the stack does that job. p5's
 * default 1-unit black stroke is kept, so the outline scales like it does in
 * the game.
 */
function drawMagpie(ctx: CanvasRenderingContext2D, toScreen: Mat) {
  ctx.save()
  ctx.transform(...toScreen)
  ctx.strokeStyle = "#000"
  ctx.lineWidth = 1

  const bx = BEAM_WIDTH / 2
  ctx.fillStyle = "#f5f37040"
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(bx, BEAM_HEIGHT)
  ctx.lineTo(-bx, BEAM_HEIGHT)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = "#525d80"
  ctx.beginPath()
  ctx.roundRect(-DOME_WIDTH / 2, -DOME_HEIGHT / 2, DOME_WIDTH, DOME_HEIGHT, 8)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = "#959ebb"
  ctx.beginPath()
  ctx.rect(
    -PLATFORM_WIDTH / 2,
    DOME_HEIGHT / 2 - PLATFORM_HEIGHT / 2,
    PLATFORM_WIDTH,
    PLATFORM_HEIGHT,
  )
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = "#70eef5"
  ctx.beginPath()
  ctx.roundRect(
    DOME_WIDTH / 2 - WINDOW_WIDTH,
    -WINDOW_HEIGHT,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
    1.5,
  )
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

// Stand-in for "a 3x3 matrix" in the stack list.
const MatrixIcon = () => (
  <svg className={s.matrixIcon} width={16} height={16} viewBox="0 0 16 16">
    {[3, 8, 13].flatMap((y) =>
      [3, 8, 13].map((x) => <circle key={`${x},${y}`} cx={x} cy={y} r={1.6} />),
    )}
  </svg>
)

interface NumberSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}

const NumberSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: NumberSliderProps) => {
  // The text box keeps its own string so half-typed input ("-", "0.") isn't
  // clobbered; it only resyncs when the value changes from elsewhere (the
  // slider, a revert, a unit switch).
  const [text, setText] = useState(round(value, 4))
  const [synced, setSynced] = useState(value)
  if (Math.abs(value - synced) > 1e-9) {
    setSynced(value)
    setText(round(value, 4))
  }

  const commit = (v: number) => {
    setSynced(v)
    onChange(v)
  }

  return (
    <label className={s.field}>
      <span className={s.fieldLabel}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value)
          setText(round(v, 4))
          commit(v)
        }}
      />
      <input
        type="number"
        className={s.number}
        step={step}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          const v = parseFloat(e.target.value)
          if (Number.isFinite(v)) commit(v)
        }}
      />
    </label>
  )
}

interface TransformFieldsProps {
  transform: Transform
  onChange: (t: Transform) => void
}

const TransformFields = ({ transform: t, onChange }: TransformFieldsProps) => {
  switch (t.kind) {
    case "translate":
      return (
        <div className={s.fields}>
          <NumberSlider
            label="x"
            value={t.x}
            min={-200}
            max={200}
            step={1}
            onChange={(x) => onChange({ ...t, x })}
          />
          <NumberSlider
            label="y"
            value={t.y}
            min={-200}
            max={200}
            step={1}
            onChange={(y) => onChange({ ...t, y })}
          />
        </div>
      )
    case "rotate": {
      const deg = t.unit === "deg"
      return (
        <div className={s.fields}>
          <div className={s.options}>
            {(["rad", "deg"] as const).map((unit) => (
              <label key={unit}>
                <input
                  type="radio"
                  checked={t.unit === unit}
                  onChange={() => onChange({ ...t, unit })}
                />
                {unit === "rad" ? "radians" : "degrees"}
              </label>
            ))}
          </div>
          <NumberSlider
            label="angle"
            value={deg ? toDegrees(t.angle) : t.angle}
            min={deg ? -360 : -2 * Math.PI}
            max={deg ? 360 : 2 * Math.PI}
            step={deg ? 1 : 0.01}
            onChange={(v) => onChange({ ...t, angle: deg ? toRadians(v) : v })}
          />
          <div className={s.presets}>
            {PI_STOPS.map((k) => (
              <button
                key={k}
                className={s.preset}
                onClick={() => onChange({ ...t, angle: (k * Math.PI) / 4 })}
              >
                <PiLabel k={k} />
              </button>
            ))}
          </div>
        </div>
      )
    }
    case "scale":
      return (
        <div className={s.fields}>
          <div className={s.options}>
            <label>
              <input
                type="checkbox"
                checked={t.locked}
                onChange={(e) =>
                  onChange({ ...t, locked: e.target.checked, y: t.x })
                }
              />
              lock x &amp; y
            </label>
          </div>
          {t.locked ? (
            <NumberSlider
              label="scale by"
              value={t.x}
              min={-3}
              max={3}
              step={0.05}
              onChange={(v) => onChange({ ...t, x: v, y: v })}
            />
          ) : (
            <>
              <NumberSlider
                label="x"
                value={t.x}
                min={-3}
                max={3}
                step={0.05}
                onChange={(x) => onChange({ ...t, x })}
              />
              <NumberSlider
                label="y"
                value={t.y}
                min={-3}
                max={3}
                step={0.05}
                onChange={(y) => onChange({ ...t, y })}
              />
            </>
          )}
        </div>
      )
  }
}

export const TransformPlayground: React.FC<TransformPlaygroundProps> = ({
  width = 480,
  height = 360,
  zoom = 2,
  backdrop: initialBackdrop = "both",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nextId = useRef(1)
  // subscribe so a theme change re-renders (and so repaints: the draw effect
  // below runs after every render)
  useTheme()
  const [view, setView] = useState<View>("object")
  const [stack, setStack] = useState<Transform[]>([])
  // kind of the not-yet-added transform shown in the editor when nothing is
  // selected; it joins the stack on its first edit
  const [draftKind, setDraftKind] = useState<Kind>("translate")
  const [selectedId, setSelectedId] = useState<number | null>(null)
  // what the selected transform looked like when it was tapped, for Revert
  const [snapshot, setSnapshot] = useState<Transform | null>(null)
  const [mouse, setMouse] = useState<Point | null>(null)
  const [backdrop, setBackdrop] = useState<Backdrop>(initialBackdrop)
  const showSpace = backdrop !== "grids"
  const showGrids = backdrop !== "space"
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)
  const copiedTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(copiedTimer.current), [])

  const selected = stack.find((t) => t.id === selectedId) ?? null
  const composite = stack.reduce<Mat>(
    (m, t) => multiply(m, toMatrix(t)),
    IDENTITY,
  )

  const camera: Mat = [zoom, 0, 0, zoom, width / 2, height / 2]
  let worldToScreen: Mat | null
  let objectToScreen: Mat
  if (view === "world") {
    worldToScreen = camera
    objectToScreen = multiply(camera, composite)
  } else {
    const inverse = invert(composite)
    worldToScreen = inverse && multiply(camera, inverse)
    objectToScreen = camera
  }

  const screenToWorld = worldToScreen && invert(worldToScreen)
  const screenToObject = invert(objectToScreen)
  const mouseWorld = mouse && screenToWorld && apply(screenToWorld, mouse)
  const mouseObject = mouse && screenToObject && apply(screenToObject, mouse)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width * CANVAS_SCALE
    canvas.height = height * CANVAS_SCALE
    ctx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0)

    const rootStyle = getComputedStyle(document.documentElement)
    const cssVar = (name: string) => rootStyle.getPropertyValue(name).trim()
    const bg = cssVar("--bg")
    const text = cssVar("--text")
    const textMuted = cssVar("--text-muted")
    const accent = cssVar("--accent")

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    if (showSpace && worldToScreen) {
      drawSpace(ctx, worldToScreen, text, bg, width, height)
    }

    if (showGrids && worldToScreen) {
      drawGrid(
        ctx,
        worldToScreen,
        WORLD_GRID,
        WORLD_BASIS,
        textMuted,
        width,
        height,
      )
    }
    if (showGrids) {
      drawGrid(
        ctx,
        objectToScreen,
        OBJECT_GRID,
        OBJECT_BASIS,
        accent,
        width,
        height,
      )
    }
    drawMagpie(ctx, objectToScreen)

    if (!worldToScreen) {
      ctx.fillStyle = text
      ctx.font = `600 14px "Public Sans", system-ui, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(
        "This stack has no inverse, so the world can't be drawn.",
        width / 2,
        12,
      )
    }

    if (mouse) {
      ctx.strokeStyle = text
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(mouse.x - CROSSHAIR, mouse.y)
      ctx.lineTo(mouse.x + CROSSHAIR, mouse.y)
      ctx.moveTo(mouse.x, mouse.y - CROSSHAIR)
      ctx.lineTo(mouse.x, mouse.y + CROSSHAIR)
      ctx.stroke()
    }
  })

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * width,
      y: ((e.clientY - rect.top) / rect.height) * height,
    })
  }

  const select = (t: Transform) => {
    if (t.id === selectedId) {
      setSelectedId(null)
      setSnapshot(null)
    } else {
      setSelectedId(t.id)
      setSnapshot(t)
    }
  }

  const replace = (t: Transform) =>
    setStack((prev) => prev.map((old) => (old.id === t.id ? t : old)))

  const remove = (id: number) => {
    setStack((prev) => prev.filter((t) => t.id !== id))
    if (id === selectedId) {
      setSelectedId(null)
      setSnapshot(null)
    }
  }

  const move = (index: number, delta: -1 | 1) =>
    setStack((prev) => {
      const next = [...prev]
      const [t] = next.splice(index, 1)
      next.splice(index + delta, 0, t)
      return next
    })

  // first edit of a new transform: add it and select it, so further edits
  // land on it and Revert takes it back to its defaults
  const add = (t: Transform) => {
    const id = nextId.current++
    setStack((prev) => [...prev, { ...t, id }])
    setSelectedId(id)
    setSnapshot(defaultTransform(t.kind, id))
  }

  const code = p5Code(stack)

  // Copy the generated code (also kept in a visually hidden <pre>). If the
  // Clipboard API isn't available or is refused, fall back to selecting the
  // <pre>'s text and using the older execCommand("copy").
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const pre = codeRef.current
      const selection = window.getSelection()
      if (!pre || !selection) return
      const range = document.createRange()
      range.selectNodeContents(pre)
      selection.removeAllRanges()
      selection.addRange(range)
      const ok = document.execCommand("copy")
      selection.removeAllRanges()
      if (!ok) return
    }
    setCopied(true)
    window.clearTimeout(copiedTimer.current)
    copiedTimer.current = window.setTimeout(() => setCopied(false), 3000)
  }

  const startNew = (kind: Kind) => {
    setSelectedId(null)
    setSnapshot(null)
    setDraftKind(kind)
  }

  // each number gets its own fixed-width, right-aligned slot, so nothing
  // shifts as the digits change
  const coords = (p: Point | null) => (
    <>
      <span className={s.coord}>{p ? p.x.toFixed(2) : "—"}</span>,
      <span className={s.coord}>{p ? p.y.toFixed(2) : "—"}</span>
    </>
  )

  return (
    <div className={s.wrapper}>
      <div className={s.topBar}>
        <div className={s.viewToggle} role="radiogroup" aria-label="View">
          {(["world", "object"] as const).map((v) => (
            <button
              key={v}
              role="radio"
              aria-checked={view === v}
              className={view === v ? s.viewActive : undefined}
              onClick={() => setView(v)}
            >
              {v === "world" ? "World space" : "Object space"}
            </button>
          ))}
        </div>
        <div className={s.backdrops} role="radiogroup" aria-label="Backdrop">
          {BACKDROPS.map(({ value, label }) => (
            <label key={value}>
              <input
                type="radio"
                checked={backdrop === value}
                onChange={() => setBackdrop(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className={s.main}>
        <div
          className={s.canvasWrapper}
          style={
            {
              "--tp-aspect-ratio": `${width} / ${height}`,
              "--tp-width": `${width}px`,
            } as React.CSSProperties
          }
        >
          <canvas
            ref={canvasRef}
            className={s.canvas}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMouse(null)}
          />
          <div className={s.readout} aria-label="At mouse">
            <span className={s.readoutItem}>
              <span
                className={s.swatch}
                style={{ background: "var(--text-muted)" }}
              />
              World space
              {coords(mouseWorld)}
            </span>
            <span className={s.readoutItem}>
              <span
                className={s.swatch}
                style={{ background: "var(--accent)" }}
              />
              Object space
              {coords(mouseObject)}
            </span>
          </div>
        </div>

        <div className={s.side}>
          <div className={s.heading}>Transforms:</div>
          <ul className={s.stack}>
            <li className={s.identityRow}>
              <MatrixIcon />
              identity
            </li>
            {stack.map((t, i) => (
              <li
                key={t.id}
                className={`${s.row} ${t.id === selectedId ? s.selected : ""}`}
              >
                <button className={s.entry} onClick={() => select(t)}>
                  <MatrixIcon />
                  <span>{describe(t)}</span>
                </button>
                <button
                  className={s.iconButton}
                  aria-label="Move up"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  <SvgIcon name="chevronUp" size={16} intent="muted" />
                </button>
                <button
                  className={s.iconButton}
                  aria-label="Move down"
                  disabled={i === stack.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <SvgIcon name="chevronDown" size={16} intent="muted" />
                </button>
                <button
                  className={s.iconButton}
                  aria-label="Delete"
                  onClick={() => remove(t.id)}
                >
                  <SvgIcon name="trash" size={16} intent="muted" />
                </button>
              </li>
            ))}
          </ul>
          <button className={s.button} onClick={copyCode}>
            {copied ? "Copied to clipboard" : "Output p5.js code"}
          </button>
          <pre ref={codeRef} className={s.hiddenCode} aria-hidden="true">
            {code}
          </pre>
        </div>
      </div>

      <div className={s.editor}>
        <div className={s.kinds}>
          <div className={s.heading}>Add a transform:</div>
          {(["translate", "scale", "rotate"] as const).map((kind) => (
            <label key={kind}>
              <input
                type="radio"
                checked={!selected && draftKind === kind}
                onChange={() => startNew(kind)}
              />
              {kind}
            </label>
          ))}
        </div>
        <div className={s.fields}>
          <div className={s.heading}>
            {selected
              ? `Editing transform ${stack.indexOf(selected) + 1}: ${selected.kind}`
              : `New ${draftKind}`}
            {!selected && (
              <span className={s.hint}> (change a value to add it)</span>
            )}
          </div>
          <TransformFields
            transform={selected ?? defaultTransform(draftKind)}
            onChange={selected ? replace : add}
          />
          {selected && (
            <div className={s.actions}>
              <button
                className={s.button}
                onClick={() => snapshot && replace(snapshot)}
              >
                Revert
              </button>
            </div>
          )}
        </div>
      </div>

      <p className={s.narration}>{narrate(view, stack)}</p>
    </div>
  )
}
