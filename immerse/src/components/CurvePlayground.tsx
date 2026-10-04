import { useLayoutEffect, useRef, useState } from "react"
import { useDragHandles } from "../hooks/useDragHandles"
import { useTheme } from "../hooks/useTheme"
import type { Point, SplineEnds } from "../utils/geometry"
import {
  add,
  cardinalToBezier,
  cross,
  deCasteljau,
  dot,
  length,
  scale,
  sub,
} from "../utils/geometry"
import {
  SMALL_POINT_RADIUS,
  SWATCH,
  beginFrame,
  clampToPlot,
  drawAxes,
  drawDot,
  drawLine,
  plotFor,
  readColors,
} from "../utils/playgroundCanvas"
import type { Plot } from "../utils/playgroundCanvas"
import {
  Checkbox,
  PlaygroundLayout,
  Slider,
  Swatch,
  Toggle,
  fmt,
  fmtPoint,
  styles as s,
} from "./GeometryPlaygroundParts"

/**
 * Usage (in a book `.mdx` section):
 *
 * ```mdx
 * import { CurvePlayground } from "immerse/components/CurvePlayground"
 *
 * <CurvePlayground />
 * <CurvePlayground mode="cardinal" />
 * ```
 *
 * Bézier curves and cardinal splines with draggable points, in p5
 * coordinates. A toggle switches between them; `mode` picks the starting one.
 *
 * Bézier: one cubic curve. Anchors (on the curve) use the first color,
 * handles (off the curve) the second, with dashed lines from each anchor to
 * its handle - the curve's tangent direction at that end. A t slider runs
 * de Casteljau's construction: the three rounds of lerp are drawn, the last
 * segment (tangent to the curve at B(t)) is highlighted, and the curve is
 * traced from 0 up to t. Dragging an anchor carries its handle along, like a
 * design tool's pen.
 *
 * "Chain two curves" joins a second cubic at the first one's end. "Smooth
 * joint" keeps the two handles at the joint pointing in opposite directions
 * (dragging one swings the other), and the readout reports the angle the
 * curve turns through at the joint.
 *
 * Cardinal: six points the spline passes through, a tightness slider (0 is
 * Catmull-Rom, 1 is straight segments), and p5 v2's `ends` setting. The
 * hovered (or last dragged) point shows its construction: the chord between
 * its two neighbors and the tangent parallel to it. "Show Bézier handles"
 * reveals the handles each piece is secretly drawn with.
 *
 * The side panel shows the matching p5 v2 code for the current shape.
 *
 * Shares its look, colors, and drag behavior with the other geometry
 * playgrounds (see `utils/playgroundCanvas.ts`).
 */
export interface CurvePlaygroundProps {
  width?: number
  height?: number
  mode?: Mode
}

type Mode = "bezier" | "cardinal"
type Cubic = [Point, Point, Point, Point]

const MODES: { value: Mode; label: string }[] = [
  { value: "bezier", label: "Bézier" },
  { value: "cardinal", label: "Cardinal spline" },
]

const ENDS: { value: SplineEnds; label: string }[] = [
  { value: "include", label: "INCLUDE" },
  { value: "exclude", label: "EXCLUDE" },
]

const INITIAL_SINGLE: Point[] = [
  { x: 20, y: 220 },
  { x: 60, y: 30 },
  { x: 250, y: 30 },
  { x: 310, y: 200 },
]

const INITIAL_CHAIN: Point[] = [
  { x: 10, y: 210 },
  { x: 30, y: 60 },
  { x: 120, y: 40 },
  { x: 170, y: 120 },
  { x: 220, y: 200 },
  { x: 290, y: 240 },
  { x: 330, y: 90 },
]

const INITIAL_SPLINE: Point[] = [
  { x: 20, y: 190 },
  { x: 80, y: 60 },
  { x: 150, y: 160 },
  { x: 210, y: 50 },
  { x: 270, y: 190 },
  { x: 330, y: 90 },
]

// which handles move along with each anchor
const SINGLE_CARRY: Record<number, number[]> = { 0: [1], 3: [2] }
const CHAIN_CARRY: Record<number, number[]> = { 0: [1], 3: [2, 4], 6: [5] }

function strokeCubic(
  ctx: CanvasRenderingContext2D,
  [p0, p1, p2, p3]: Cubic,
  color: string,
  alpha = 1,
) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(p0.x, p0.y)
  ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)
  ctx.stroke()
  ctx.restore()
}

// `anchor + dir * len`, shortened if needed so it stays inside the plot
function fitInside(anchor: Point, dir: Point, len: number, plot: Plot): Point {
  const dlen = length(dir)
  if (dlen === 0) return anchor
  const u = scale(dir, 1 / dlen)
  let max = len
  if (u.x > 0) max = Math.min(max, (plot.maxX - anchor.x) / u.x)
  if (u.x < 0) max = Math.min(max, -anchor.x / u.x)
  if (u.y > 0) max = Math.min(max, (plot.maxY - anchor.y) / u.y)
  if (u.y < 0) max = Math.min(max, -anchor.y / u.y)
  return clampToPlot(add(anchor, scale(u, Math.max(0, max))), plot)
}

// the joint's other handle, pointing opposite `handle`, keeping its length
function mirrored(
  joint: Point,
  handle: Point,
  other: Point,
  plot: Plot,
): Point {
  return fitInside(joint, sub(joint, handle), length(sub(other, joint)), plot)
}

// how far (in degrees) the curve turns at the joint between two cubics
function jointTurn(chain: Point[]): number | null {
  const incoming = sub(chain[3], chain[2])
  const outgoing = sub(chain[4], chain[3])
  if (length(incoming) === 0 || length(outgoing) === 0) return null
  return Math.abs(
    (Math.atan2(cross(incoming, outgoing), dot(incoming, outgoing)) * 180) /
      Math.PI,
  )
}

const xy = (p: Point) => `${p.x}, ${p.y}`

export const CurvePlayground: React.FC<CurvePlaygroundProps> = ({
  width = 400,
  height = 320,
  mode: initialMode = "bezier",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useTheme()
  const plot = plotFor(width, height)
  const [mode, setMode] = useState<Mode>(initialMode)
  const [single, setSingle] = useState(INITIAL_SINGLE)
  const [chain, setChain] = useState(INITIAL_CHAIN)
  const [chained, setChained] = useState(false)
  const [smooth, setSmooth] = useState(true)
  const [t, setT] = useState(0.4)
  const [spline, setSpline] = useState(INITIAL_SPLINE)
  const [tightness, setTightness] = useState(0)
  const [ends, setEnds] = useState<SplineEnds>("include")
  const [showHandles, setShowHandles] = useState(false)
  const [focus, setFocus] = useState(2)

  const handles = mode === "cardinal" ? spline : chained ? chain : single

  const dragBezier = (
    prev: Point[],
    i: number,
    p: Point,
    carry: Record<number, number[]>,
  ) => {
    const next = [...prev]
    const target = clampToPlot(p, plot)
    const delta = sub(target, prev[i])
    next[i] = target
    for (const h of carry[i] ?? [])
      next[h] = clampToPlot(add(prev[h], delta), plot)
    if (chained && smooth && prev.length === 7) {
      if (i === 2) next[4] = mirrored(next[3], next[2], prev[4], plot)
      if (i === 4) next[2] = mirrored(next[3], next[4], prev[2], plot)
    }
    return next
  }

  const drag = useDragHandles(handles, width, height, (i, p) => {
    if (mode === "cardinal") {
      setFocus(i)
      setSpline((prev) =>
        prev.map((old, j) => (j === i ? clampToPlot(p, plot) : old)),
      )
    } else if (chained) {
      setChain((prev) => dragBezier(prev, i, p, CHAIN_CARRY))
    } else {
      setSingle((prev) => dragBezier(prev, i, p, SINGLE_CARRY))
    }
  })

  const toggleSmooth = (on: boolean) => {
    setSmooth(on)
    if (on)
      setChain((prev) => {
        const next = [...prev]
        next[4] = mirrored(prev[3], prev[2], prev[4], plot)
        return next
      })
  }

  const focused = mode === "cardinal" ? (drag.hover ?? focus) : null
  const levels = deCasteljau(single, t)
  const curvePoint = levels[3][0]
  const pieces = cardinalToBezier(spline, tightness, ends)
  const turn = jointTurn(chain)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = readColors()
    const ctx = beginFrame(canvas, width, height, colors)
    if (!ctx) return
    drawAxes(ctx, width, height, colors)

    const handleLine = (anchor: Point, handle: Point) =>
      drawLine(ctx, anchor, handle, colors.second, { dashed: true })

    if (mode === "bezier" && !chained) {
      const [p0, p1, p2, p3] = single
      drawLine(ctx, p1, p2, colors.muted, { dashed: true, width: 1 })
      handleLine(p0, p1)
      handleLine(p3, p2)

      // the whole curve faintly, then traced from 0 to t: the left half of a
      // de Casteljau split at t is itself a cubic Bézier
      strokeCubic(ctx, single as Cubic, colors.text, 0.3)
      strokeCubic(
        ctx,
        [p0, levels[1][0], levels[2][0], curvePoint],
        colors.text,
      )

      const [q0, q1, q2] = levels[1]
      drawLine(ctx, q0, q1, colors.muted, { width: 1.5 })
      drawLine(ctx, q1, q2, colors.muted, { width: 1.5 })
      for (const q of levels[1])
        drawDot(ctx, q, colors.muted, { radius: SMALL_POINT_RADIUS })
      const [r0, r1] = levels[2]
      drawLine(ctx, r0, r1, colors.derived, { width: 2 })
      for (const q of levels[2])
        drawDot(ctx, q, colors.derived, { radius: SMALL_POINT_RADIUS })

      drawDot(ctx, p1, colors.second, { label: "P1" })
      drawDot(ctx, p2, colors.second, { label: "P2" })
      drawDot(ctx, p0, colors.first, { label: "P0" })
      drawDot(ctx, p3, colors.first, { label: "P3" })
      drawDot(ctx, curvePoint, colors.hit, {
        label: "B(t)",
        labelSide: "below",
      })
    } else if (mode === "bezier") {
      const c = chain
      handleLine(c[0], c[1])
      handleLine(c[3], c[2])
      handleLine(c[3], c[4])
      handleLine(c[6], c[5])
      strokeCubic(ctx, [c[0], c[1], c[2], c[3]], colors.text)
      strokeCubic(ctx, [c[3], c[4], c[5], c[6]], colors.text)
      for (const i of [1, 2, 4, 5])
        drawDot(ctx, c[i], colors.second, { label: `P${i}` })
      for (const i of [0, 3, 6]) {
        drawDot(ctx, c[i], colors.first, {
          label: `P${i}`,
          labelSide: i === 3 ? "left" : "right",
        })
      }
    } else {
      for (const piece of pieces) strokeCubic(ctx, piece, colors.text)

      if (showHandles) {
        for (const [b, h1, h2, c] of pieces) {
          handleLine(b, h1)
          handleLine(c, h2)
          drawDot(ctx, h1, colors.second, {
            radius: SMALL_POINT_RADIUS,
            hollow: true,
          })
          drawDot(ctx, h2, colors.second, {
            radius: SMALL_POINT_RADIUS,
            hollow: true,
          })
        }
      }

      // construction at the focused point: chord between its neighbors, and
      // the tangent through the point parallel to it
      if (focused !== null) {
        const n = spline.length
        const isEnd = focused === 0 || focused === n - 1
        if (!(isEnd && ends === "exclude")) {
          const prev = spline[Math.max(0, focused - 1)]
          const next = spline[Math.min(n - 1, focused + 1)]
          const p = spline[focused]
          const m = scale(sub(next, prev), (1 - tightness) / 6)
          drawLine(ctx, prev, next, colors.derived, { dashed: true })
          drawLine(ctx, sub(p, m), add(p, m), colors.derived, { width: 3 })
        }
      }

      spline.forEach((p, i) => {
        const guide = ends === "exclude" && (i === 0 || i === spline.length - 1)
        drawDot(ctx, p, colors.first, {
          label: guide ? `P${i} (guide)` : `P${i}`,
          hollow: guide,
          radius: i === focused ? 8 : undefined,
        })
      })
    }
  })

  const code =
    mode === "cardinal"
      ? [
          "beginShape()",
          ...(tightness !== 0
            ? [`splineProperty("tightness", ${fmt(tightness)})`]
            : []),
          ...(ends === "exclude" ? ['splineProperty("ends", EXCLUDE)'] : []),
          ...spline.map((p) => `splineVertex(${xy(p)})`),
          "endShape()",
        ]
      : chained
        ? [
            "beginShape()",
            `vertex(${xy(chain[0])})`,
            ...chain.slice(1).map((p) => `bezierVertex(${xy(p)})`),
            "endShape()",
          ]
        : [`bezier(${single.map(xy).join(", ")})`]

  return (
    <PlaygroundLayout
      width={width}
      height={height}
      controls={
        <>
          <Toggle value={mode} options={MODES} onChange={setMode} />
          {mode === "bezier" && (
            <>
              <Checkbox
                label="Chain two curves"
                checked={chained}
                onChange={setChained}
              />
              {chained ? (
                <Checkbox
                  label="Smooth joint"
                  checked={smooth}
                  onChange={toggleSmooth}
                />
              ) : (
                <Slider
                  label="t"
                  value={t}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={setT}
                />
              )}
            </>
          )}
          {mode === "cardinal" && (
            <>
              <Slider
                label="tightness"
                value={tightness}
                min={0}
                max={1}
                step={0.05}
                onChange={setTightness}
              />
              <Toggle
                label="ends"
                value={ends}
                options={ENDS}
                onChange={setEnds}
              />
              <Checkbox
                label="Show Bézier handles"
                checked={showHandles}
                onChange={setShowHandles}
              />
            </>
          )}
        </>
      }
      canvas={
        <canvas
          ref={canvasRef}
          className={s.canvas}
          style={{ cursor: drag.cursor }}
          {...drag.canvasProps}
        />
      }
      side={
        <>
          {mode === "bezier" && !chained && (
            <table className={s.readout}>
              <tbody>
                <tr>
                  <td>
                    <Swatch color={SWATCH.first} />
                    anchors P0, P3
                  </td>
                  <td>
                    {fmtPoint(single[0], 0)}, {fmtPoint(single[3], 0)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Swatch color={SWATCH.second} />
                    handles P1, P2
                  </td>
                  <td>
                    {fmtPoint(single[1], 0)}, {fmtPoint(single[2], 0)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Swatch color={SWATCH.muted} />
                    1st round of lerp
                  </td>
                  <td>3 points</td>
                </tr>
                <tr>
                  <td>
                    <Swatch color={SWATCH.derived} />
                    2nd round (tangent)
                  </td>
                  <td>2 points</td>
                </tr>
                <tr>
                  <td>
                    <Swatch color={SWATCH.hit} />
                    B({fmt(t)})
                  </td>
                  <td>{fmtPoint(curvePoint)}</td>
                </tr>
              </tbody>
            </table>
          )}
          {mode === "bezier" && chained && (
            <p className={s.status}>
              {turn === null
                ? "A handle is sitting right on top of the joint, so there's no direction to compare."
                : turn < 0.5
                  ? "Smooth: the handles on either side of P3 point in exactly opposite directions, so the curve doesn't change direction at the joint."
                  : `Corner: the curve changes direction by ${fmt(turn, 1)}° at the joint, because the handles on either side of P3 don't line up.`}
            </p>
          )}
          {mode === "cardinal" && (
            <p className={s.status}>
              {focused !== null &&
              ends === "exclude" &&
              (focused === 0 || focused === spline.length - 1)
                ? `P${focused} is a guide: with EXCLUDE ends, it steers the curve's direction at its neighbor but isn't drawn through.`
                : `The tangent at P${focused} (solid) is parallel to the chord between its neighbors (dashed). Hover a point to see its construction.`}
            </p>
          )}
          <pre className={s.code}>
            <code>{code.join("\n")}</code>
          </pre>
        </>
      }
    />
  )
}
