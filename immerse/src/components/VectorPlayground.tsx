import { useLayoutEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import { useTheme } from "../hooks/useTheme"
import s from "./VectorPlayground.module.css"

/**
 * Usage (in a book `.mdx` section):
 *
 * ```mdx
 * import { VectorPlayground } from "immerse/components/VectorPlayground"
 *
 * <VectorPlayground />
 * ```
 *
 * Draggable two-vector sandbox using the p5/screen coordinate convention
 * (origin top-left, y grows downward) - same theme-color approach as
 * `CoordinatePlane`'s `"screen"` variant. Drag either dot (A or B); the
 * closest dot to where you click follows the mouse for the rest of that
 * drag. Alongside the two draggable vectors, draws the derived vectors
 * `B - A` (anchored at A, arrow to B) and `A + B` (anchored at B, arrow to
 * the sum point) to illustrate vector subtraction/addition geometrically.
 * A side readout lists X/Y/Z/magnitude for all four vectors (Z is always
 * 0 in this 2D playground) plus the cross and dot products - the cross
 * product's Z column is where its actual value shows up.
 */
export interface VectorPlaygroundProps {
  width?: number
  height?: number
}

interface Point {
  x: number
  y: number
}

const CANVAS_SCALE = 2
const AXIS_MARGIN = 30
const ARROWHEAD_LENGTH = 10
const POINT_RADIUS = 6
const SUM_POINT_RADIUS = 3
const LABEL_FONT = 15

const INITIAL_A: Point = { x: 100, y: 50 }
const INITIAL_B: Point = { x: 25, y: 200 }

function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y }
}

function sub(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y }
}

function magnitude(v: Point): number {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}

function dot(a: Point, b: Point): number {
  return a.x * b.x + a.y * b.y
}

// 2D cross product, treated as the z-component of the 3D cross product of
// (a.x, a.y, 0) x (b.x, b.y, 0) - the x/y components are always zero.
function cross(a: Point, b: Point): number {
  return a.x * b.y - a.y * b.x
}

function distance(a: Point, b: Point): number {
  return magnitude(sub(a, b))
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
  // pull the tip back this many px along the line, so it doesn't get
  // buried under a dot drawn at `to`
  toRadius = 0,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2

  const angle = Math.atan2(to.y - from.y, to.x - from.x)
  const tip: Point = {
    x: to.x - toRadius * Math.cos(angle),
    y: to.y - toRadius * Math.sin(angle),
  }

  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(tip.x, tip.y)
  ctx.stroke()

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

export const VectorPlayground: React.FC<VectorPlaygroundProps> = ({
  width = 320,
  height = 320,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [theme] = useTheme()
  const [a, setA] = useState<Point>(INITIAL_A)
  const [b, setB] = useState<Point>(INITIAL_B)
  const [dragging, setDragging] = useState<"A" | "B" | null>(null)

  const bMinusA = sub(b, a)
  const aPlusB = add(a, b)
  const dotProduct = dot(a, b)
  const crossProduct = cross(a, b)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width * CANVAS_SCALE
    canvas.height = height * CANVAS_SCALE
    ctx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const rootStyle = getComputedStyle(document.documentElement)
    const cssVar = (name: string) => rootStyle.getPropertyValue(name).trim()
    const bg = cssVar("--bg")
    const text = cssVar("--text")
    const textMuted = cssVar("--text-muted")
    const accent = cssVar("--accent")
    const success = cssVar("--success")
    const warning = cssVar("--warning")
    const error = cssVar("--error")

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    const origin: Point = { x: AXIS_MARGIN, y: AXIS_MARGIN }
    const toCanvas = (v: Point): Point => add(v, origin)

    // axes
    ctx.strokeStyle = text
    ctx.fillStyle = text
    ctx.lineWidth = 2
    drawArrow(ctx, origin, { x: width - AXIS_MARGIN, y: origin.y }, text)
    drawArrow(ctx, origin, { x: origin.x, y: height - AXIS_MARGIN }, text)
    ctx.font = `600 16px "Public Sans", system-ui, sans-serif`
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("x", width - AXIS_MARGIN + 8, origin.y)
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("y", origin.x + 8, height - AXIS_MARGIN)

    const canvasA = toCanvas(a)
    const canvasB = toCanvas(b)
    const canvasSum = toCanvas(aPlusB)

    // derived vectors first, so the primary A/B arrows draw on top
    drawArrow(ctx, canvasA, canvasB, warning, POINT_RADIUS)
    drawArrow(ctx, canvasB, canvasSum, error, SUM_POINT_RADIUS)

    // primary vectors
    drawArrow(ctx, origin, canvasA, accent, POINT_RADIUS)
    drawArrow(ctx, origin, canvasB, success, POINT_RADIUS)

    // dots
    ctx.font = `600 ${LABEL_FONT}px "Public Sans", system-ui, sans-serif`
    ctx.textBaseline = "bottom"

    ctx.fillStyle = accent
    ctx.beginPath()
    ctx.arc(canvasA.x, canvasA.y, POINT_RADIUS, 0, Math.PI * 2)
    ctx.fill()
    ctx.textAlign = "left"
    ctx.fillText("A", canvasA.x + POINT_RADIUS + 4, canvasA.y - 2)

    ctx.fillStyle = success
    ctx.beginPath()
    ctx.arc(canvasB.x, canvasB.y, POINT_RADIUS, 0, Math.PI * 2)
    ctx.fill()
    ctx.textAlign = "left"
    ctx.fillText("B", canvasB.x + POINT_RADIUS + 4, canvasB.y - 2)

    ctx.fillStyle = error
    ctx.beginPath()
    ctx.arc(canvasSum.x, canvasSum.y, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.textAlign = "left"
    ctx.fillText("A+B", canvasSum.x + 8, canvasSum.y - 2)

    ctx.fillStyle = textMuted
    ctx.beginPath()
    ctx.arc(origin.x, origin.y, 3, 0, Math.PI * 2)
    ctx.fill()
  }, [width, height, a, b, aPlusB, theme])

  const pickPoint = (canvasPos: Point): "A" | "B" => {
    const origin: Point = { x: AXIS_MARGIN, y: AXIS_MARGIN }
    const canvasA = add(a, origin)
    const canvasB = add(b, origin)
    return distance(canvasPos, canvasA) <= distance(canvasPos, canvasB)
      ? "A"
      : "B"
  }

  const canvasPosFromEvent = (e: MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * width,
      y: ((e.clientY - rect.top) / rect.height) * height,
    }
  }

  const movePointTo = (which: "A" | "B", canvasPos: Point) => {
    const maxX = width - 2 * AXIS_MARGIN
    const maxY = height - 2 * AXIS_MARGIN
    const next: Point = {
      x: Math.round(Math.min(maxX, Math.max(0, canvasPos.x - AXIS_MARGIN))),
      y: Math.round(Math.min(maxY, Math.max(0, canvasPos.y - AXIS_MARGIN))),
    }
    if (which === "A") setA(next)
    else setB(next)
  }

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const pos = canvasPosFromEvent(e)
    const which = pickPoint(pos)
    setDragging(which)
    movePointTo(which, pos)
  }

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return
    movePointTo(dragging, canvasPosFromEvent(e))
  }

  const stopDragging = () => setDragging(null)

  const row = (
    label: string,
    color: string,
    operation: string,
    v: Point,
    mag: number,
  ) => (
    <tr>
      <td>
        <span className={s.swatch} style={{ background: color }} />
        {label}
      </td>
      <td>{operation}</td>
      <td>{v.x}</td>
      <td>{v.y}</td>
      <td>0</td>
      <td>{mag.toFixed(3)}</td>
    </tr>
  )

  return (
    <div className={s.wrapper}>
      <div
        className={s.canvasWrapper}
        style={
          {
            "--vp-aspect-ratio": `${width} / ${height}`,
            "--vp-width": `${width}px`,
          } as React.CSSProperties
        }
      >
        <canvas
          ref={canvasRef}
          className={`${s.canvas} ${dragging ? s.dragging : ""}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        />
      </div>
      <table className={s.readout}>
        <thead>
          <tr>
            <th>Vector</th>
            <th>Operation</th>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
            <th>mag</th>
          </tr>
        </thead>
        <tbody>
          {row("A", "var(--accent)", "given", a, magnitude(a))}
          {row("B", "var(--success)", "given", b, magnitude(b))}
          {row(
            "B − A",
            "var(--warning)",
            "subtraction",
            bMinusA,
            magnitude(bMinusA),
          )}
          {row("A + B", "var(--error)", "addition", aPlusB, magnitude(aPlusB))}
          <tr>
            <td>A × B</td>
            <td>cross product</td>
            <td>0</td>
            <td>0</td>
            <td>{crossProduct}</td>
            <td>{Math.abs(crossProduct).toFixed(3)}</td>
          </tr>
          <tr>
            <td>A ⋅ B</td>
            <td>dot product</td>
            <td colSpan={4}>{dotProduct.toFixed(3)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
