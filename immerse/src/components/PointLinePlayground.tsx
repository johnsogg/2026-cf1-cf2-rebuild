import { useLayoutEffect, useRef, useState } from "react"
import { useDragHandles } from "../hooks/useDragHandles"
import { useTheme } from "../hooks/useTheme"
import type { Point } from "../utils/geometry"
import { closestPoint, distance, lerp, sub } from "../utils/geometry"
import {
  SMALL_POINT_RADIUS,
  SWATCH,
  beginFrame,
  clampToPlot,
  drawAxes,
  drawDot,
  drawLabel,
  drawLine,
  drawRightAngle,
  plotFor,
  pointAt,
  readColors,
  visibleTRange,
} from "../utils/playgroundCanvas"
import {
  PlaygroundLayout,
  Pythagoras,
  Swatch,
  fmt,
  fmtPoint,
  styles as s,
} from "./GeometryPlaygroundParts"

/**
 * Usage (in a book `.mdx` section):
 *
 * ```mdx
 * import { PointLinePlayground } from "immerse/components/PointLinePlayground"
 *
 * <PointLinePlayground />
 * ```
 *
 * Distance from a draggable point P to a draggable segment AB, in p5
 * coordinates. The segment is solid; the rest of the infinite line through A
 * and B is dashed. Draws the shortest path from P to the segment (with its
 * Δx/Δy legs) and, when the foot of the perpendicular falls off the end of
 * the segment, the perpendicular to the infinite line as a dashed guide - so
 * the reader sees why the closest point is then an endpoint.
 *
 * The side panel shows the projection parameter t (unclamped), the closest
 * point, where it falls, Δx/Δy, and the distance (to the segment and to the
 * infinite line), plus the Pythagorean theorem with live numbers.
 *
 * Shares its look, colors, and drag behavior with the other geometry
 * playgrounds (see `utils/playgroundCanvas.ts`).
 */
export interface PointLinePlaygroundProps {
  width?: number
  height?: number
}

export const PointLinePlayground: React.FC<PointLinePlaygroundProps> = ({
  width = 360,
  height = 300,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useTheme()
  const plot = plotFor(width, height)
  const [points, setPoints] = useState<Point[]>([
    { x: 150, y: 40 },
    { x: 40, y: 190 },
    { x: 220, y: 130 },
  ])
  const [p, a, b] = points
  const closest = closestPoint(p, { a, b, kind: "segment" })
  const q = closest.point
  const foot = lerp(a, b, closest.rawT)
  const offEnd = closest.rawT < 0 || closest.rawT > 1
  const dx = q.x - p.x
  const dy = q.y - p.y

  const drag = useDragHandles(points, width, height, (i, pos) =>
    setPoints((prev) =>
      prev.map((old, j) => (j === i ? clampToPlot(pos, plot) : old)),
    ),
  )

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = readColors()
    const ctx = beginFrame(canvas, width, height, colors)
    if (!ctx) return
    drawAxes(ctx, width, height, colors)

    // the infinite line through A and B, then the segment on top
    const dir = sub(b, a)
    const range = visibleTRange(a, dir, width, height)
    if (range && (dir.x !== 0 || dir.y !== 0)) {
      drawLine(
        ctx,
        pointAt(a, dir, range[0]),
        pointAt(a, dir, range[1]),
        colors.second,
        {
          dashed: true,
          alpha: 0.5,
        },
      )
    }
    drawLine(ctx, a, b, colors.second, { width: 3 })

    // perpendicular to the infinite line, when it misses the segment
    if (offEnd) {
      drawLine(ctx, p, foot, colors.muted, { dashed: true })
      drawRightAngle(ctx, foot, p, a, colors.muted)
      drawDot(ctx, foot, colors.muted, {
        hollow: true,
        radius: SMALL_POINT_RADIUS,
      })
    } else if (distance(p, q) > 0) {
      drawRightAngle(ctx, q, p, distance(q, a) > 0 ? a : b, colors.derived)
    }

    // Δx / Δy legs of the shortest path
    const corner = { x: q.x, y: p.y }
    drawLine(ctx, p, corner, colors.muted, { dashed: true, width: 1 })
    drawLine(ctx, corner, q, colors.muted, { dashed: true, width: 1 })

    drawLine(ctx, p, q, colors.derived, { width: 3 })
    if (distance(p, q) > 0) {
      drawLabel(
        ctx,
        `d = ${fmt(distance(p, q))}`,
        lerp(p, q, 0.5),
        colors.derived,
        colors,
      )
    }

    drawDot(ctx, q, colors.derived, {
      radius: SMALL_POINT_RADIUS + 1,
      label: "Q",
      labelSide: "below",
    })
    drawDot(ctx, a, colors.second, { label: "A" })
    drawDot(ctx, b, colors.second, { label: "B" })
    drawDot(ctx, p, colors.first, { label: "P" })
  })

  const where =
    closest.rawT < 0
      ? "Past A (t < 0), so the closest point on the segment is A itself."
      : closest.rawT > 1
        ? "Past B (t > 1), so the closest point on the segment is B itself."
        : "Between A and B (0 ≤ t ≤ 1), so the shortest path meets the segment at a right angle."

  return (
    <PlaygroundLayout
      width={width}
      height={height}
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
          <table className={s.readout}>
            <tbody>
              <tr>
                <td>
                  <Swatch color={SWATCH.first} />P
                </td>
                <td>{fmtPoint(p)}</td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.second} />
                  A, B
                </td>
                <td>
                  {fmtPoint(a)}, {fmtPoint(b)}
                </td>
              </tr>
              <tr>
                <td>t of the perpendicular</td>
                <td>{fmt(closest.rawT)}</td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.derived} />
                  closest point Q
                </td>
                <td>{fmtPoint(q)}</td>
              </tr>
              <tr>
                <td>Δx, Δy (P to Q)</td>
                <td>
                  {fmt(dx)}, {fmt(dy)}
                </td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.derived} />
                  distance to segment
                </td>
                <td>{fmt(distance(p, q))}</td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.muted} />
                  distance to infinite line
                </td>
                <td>{fmt(distance(p, foot))}</td>
              </tr>
            </tbody>
          </table>
          <p className={s.status}>{where}</p>
          <Pythagoras dx={dx} dy={dy} />
        </>
      }
    />
  )
}
