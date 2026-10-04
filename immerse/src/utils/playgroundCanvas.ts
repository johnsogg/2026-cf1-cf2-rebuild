import type { Point } from "./geometry"
import { add, scale, sub } from "./geometry"

/**
 * Canvas drawing shared by the geometry playgrounds, so they look alike:
 * p5-style axes (origin top-left inside a margin, y grows downward, positive
 * coordinates only - same as `VectorPlayground`), theme-colored dots, and
 * solid vs. dashed lines.
 *
 * Color roles, read from the theme's CSS custom properties at draw time:
 * - `first` (`--accent`): the first object, and points that are on a curve
 * - `second` (`--success`): the second object, and off-curve control handles
 * - `derived` (`--warning`): computed things - closest points, distances,
 *   tangents, construction lines
 * - `hit` (`--error`): intersections, and the point a construction produces
 * - `muted` (`--text-muted`): axes labels, guide lines, "would be here" marks
 *
 * Solid lines are part of an object; dashed lines are guides or the parts of
 * an infinite line that aren't part of the object.
 */

export const AXIS_MARGIN = 30
export const POINT_RADIUS = 6
export const SMALL_POINT_RADIUS = 3.5
export const LABEL_FONT = `600 14px "Public Sans", system-ui, sans-serif`
export const SMALL_FONT = `500 12px "Public Sans", system-ui, sans-serif`
const CANVAS_SCALE = 2
const ARROWHEAD_LENGTH = 10
const DASH = [6, 5]

export interface PlaygroundColors {
  bg: string
  text: string
  muted: string
  first: string
  second: string
  derived: string
  hit: string
}

export function readColors(): PlaygroundColors {
  const rootStyle = getComputedStyle(document.documentElement)
  const cssVar = (name: string) => rootStyle.getPropertyValue(name).trim()
  return {
    bg: cssVar("--bg"),
    text: cssVar("--text"),
    muted: cssVar("--text-muted"),
    first: cssVar("--accent"),
    second: cssVar("--success"),
    derived: cssVar("--warning"),
    hit: cssVar("--error"),
  }
}

// CSS-variable versions of the same roles, for readout swatches
export const SWATCH = {
  first: "var(--accent)",
  second: "var(--success)",
  derived: "var(--warning)",
  hit: "var(--error)",
  muted: "var(--text-muted)",
}

/** The draggable area, in p5 coordinates: x in [0, maxX], y in [0, maxY]. */
export interface Plot {
  maxX: number
  maxY: number
}

export const plotFor = (width: number, height: number): Plot => ({
  maxX: width - 2 * AXIS_MARGIN,
  maxY: height - 2 * AXIS_MARGIN,
})

export const clampToPlot = (p: Point, plot: Plot): Point => ({
  x: Math.round(Math.min(plot.maxX, Math.max(0, p.x))),
  y: Math.round(Math.min(plot.maxY, Math.max(0, p.y))),
})

/**
 * Sizes the canvas for crisp lines, clears it to the page background, and
 * leaves the context translated so (0, 0) is the p5 origin inside the margin.
 * Draw everything else in p5 coordinates.
 */
export function beginFrame(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  colors: PlaygroundColors,
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  canvas.width = width * CANVAS_SCALE
  canvas.height = height * CANVAS_SCALE
  ctx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0)
  ctx.fillStyle = colors.bg
  ctx.fillRect(0, 0, width, height)
  ctx.translate(AXIS_MARGIN, AXIS_MARGIN)
  return ctx
}

export function drawAxes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: PlaygroundColors,
) {
  const end = {
    x: width - 2 * AXIS_MARGIN + 10,
    y: height - 2 * AXIS_MARGIN + 10,
  }
  drawArrow(ctx, { x: 0, y: 0 }, { x: end.x, y: 0 }, colors.text)
  drawArrow(ctx, { x: 0, y: 0 }, { x: 0, y: end.y }, colors.text)
  ctx.fillStyle = colors.text
  ctx.font = `600 16px "Public Sans", system-ui, sans-serif`
  ctx.textAlign = "left"
  ctx.textBaseline = "middle"
  ctx.fillText("x", end.x + 6, 0)
  ctx.fillText("y", 8, end.y)
  ctx.fillStyle = colors.muted
  ctx.beginPath()
  ctx.arc(0, 0, 3, 0, Math.PI * 2)
  ctx.fill()
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
  lineWidth = 2,
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = lineWidth
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
  drawArrowhead(ctx, to, angle, color)
}

export function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  tip: Point,
  angle: number,
  color: string,
) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(tip.x, tip.y)
  ctx.lineTo(
    tip.x - ARROWHEAD_LENGTH * Math.cos(angle - Math.PI / 6),
    tip.y - ARROWHEAD_LENGTH * Math.sin(angle - Math.PI / 6),
  )
  ctx.lineTo(
    tip.x - ARROWHEAD_LENGTH * Math.cos(angle + Math.PI / 6),
    tip.y - ARROWHEAD_LENGTH * Math.sin(angle + Math.PI / 6),
  )
  ctx.closePath()
  ctx.fill()
}

interface LineStyle {
  dashed?: boolean
  width?: number
  alpha?: number
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
  { dashed = false, width = 2, alpha = 1 }: LineStyle = {},
) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.setLineDash(dashed ? DASH : [])
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
  ctx.restore()
}

interface DotStyle {
  label?: string
  radius?: number
  /** ring instead of a filled dot: a guide, or a "would be here" mark */
  hollow?: boolean
  /** which side of the dot the label goes on */
  labelSide?: "right" | "left" | "above" | "below"
}

export function drawDot(
  ctx: CanvasRenderingContext2D,
  p: Point,
  color: string,
  {
    label,
    radius = POINT_RADIUS,
    hollow = false,
    labelSide = "right",
  }: DotStyle = {},
) {
  ctx.save()
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
  if (hollow) {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue("--bg")
      .trim()
    ctx.fill()
    ctx.stroke()
  } else {
    ctx.fillStyle = color
    ctx.fill()
  }
  if (label) {
    ctx.fillStyle = color
    ctx.font = LABEL_FONT
    const gap = radius + 4
    const at = {
      right: { x: p.x + gap, y: p.y - 2, align: "left", base: "bottom" },
      left: { x: p.x - gap, y: p.y - 2, align: "right", base: "bottom" },
      above: { x: p.x, y: p.y - gap, align: "center", base: "bottom" },
      below: { x: p.x, y: p.y + gap, align: "center", base: "top" },
    }[labelSide]
    ctx.textAlign = at.align as CanvasTextAlign
    ctx.textBaseline = at.base as CanvasTextBaseline
    ctx.fillText(label, at.x, at.y)
  }
  ctx.restore()
}

/** Small text label centered at `p`, on a background-colored backing. */
export function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  p: Point,
  color: string,
  colors: PlaygroundColors,
) {
  ctx.save()
  ctx.font = SMALL_FONT
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  const w = ctx.measureText(text).width + 6
  ctx.globalAlpha = 0.85
  ctx.fillStyle = colors.bg
  ctx.fillRect(p.x - w / 2, p.y - 8, w, 16)
  ctx.globalAlpha = 1
  ctx.fillStyle = color
  ctx.fillText(text, p.x, p.y)
  ctx.restore()
}

/** The little square that marks a right angle at `corner`. */
export function drawRightAngle(
  ctx: CanvasRenderingContext2D,
  corner: Point,
  towardA: Point,
  towardB: Point,
  color: string,
  size = 9,
) {
  const unit = (v: Point) => {
    const len = Math.hypot(v.x, v.y)
    return len === 0 ? { x: 0, y: 0 } : scale(v, size / len)
  }
  const ua = unit(sub(towardA, corner))
  const ub = unit(sub(towardB, corner))
  if ((ua.x === 0 && ua.y === 0) || (ub.x === 0 && ub.y === 0)) return
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(corner.x + ua.x, corner.y + ua.y)
  ctx.lineTo(corner.x + ua.x + ub.x, corner.y + ua.y + ub.y)
  ctx.lineTo(corner.x + ub.x, corner.y + ub.y)
  ctx.stroke()
  ctx.restore()
}

/**
 * The range of t for which `a + t * dir` is inside the visible area (the plot
 * plus the margin around it), or null if the line misses it entirely.
 * Liang-Barsky clipping.
 */
export function visibleTRange(
  a: Point,
  dir: Point,
  width: number,
  height: number,
): [number, number] | null {
  const min = { x: -AXIS_MARGIN, y: -AXIS_MARGIN }
  const max = { x: width - AXIS_MARGIN, y: height - AXIS_MARGIN }
  let lo = -Infinity
  let hi = Infinity
  for (const axis of ["x", "y"] as const) {
    if (dir[axis] === 0) {
      if (a[axis] < min[axis] || a[axis] > max[axis]) return null
      continue
    }
    const t1 = (min[axis] - a[axis]) / dir[axis]
    const t2 = (max[axis] - a[axis]) / dir[axis]
    lo = Math.max(lo, Math.min(t1, t2))
    hi = Math.min(hi, Math.max(t1, t2))
  }
  return lo <= hi ? [lo, hi] : null
}

export const pointAt = (a: Point, dir: Point, t: number) =>
  add(a, scale(dir, t))
