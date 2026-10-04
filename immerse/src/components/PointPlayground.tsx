import { useLayoutEffect, useRef, useState } from "react"
import { useDragHandles } from "../hooks/useDragHandles"
import { useTheme } from "../hooks/useTheme"
import type { Point } from "../utils/geometry"
import { distance, lerp } from "../utils/geometry"
import {
  SMALL_FONT,
  SWATCH,
  beginFrame,
  clampToPlot,
  drawAxes,
  drawDot,
  drawLabel,
  drawLine,
  drawRightAngle,
  plotFor,
  readColors,
} from "../utils/playgroundCanvas"
import {
  PlaygroundLayout,
  Pythagoras,
  Swatch,
  fmt,
  styles as s,
} from "./GeometryPlaygroundParts"

/**
 * Usage (in a book `.mdx` section):
 *
 * ```mdx
 * import { PointPlayground } from "immerse/components/PointPlayground"
 *
 * <PointPlayground />
 * ```
 *
 * Distance between two draggable points A and B, in p5 coordinates (origin
 * top-left, y grows downward). Draws the right triangle they form: the Δx
 * and Δy legs (dashed guides) and the hypotenuse (the distance). The side
 * panel shows both points, Δx, Δy, the Pythagorean theorem with the live
 * numbers filled in, and the matching p5 `dist()` call.
 *
 * Shares its look, colors, and drag behavior with the other geometry
 * playgrounds (see `utils/playgroundCanvas.ts`).
 */
export interface PointPlaygroundProps {
  width?: number
  height?: number
}

export const PointPlayground: React.FC<PointPlaygroundProps> = ({
  width = 340,
  height = 300,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useTheme()
  const plot = plotFor(width, height)
  const [points, setPoints] = useState<Point[]>([
    { x: 40, y: 200 },
    { x: 240, y: 50 },
  ])
  const [a, b] = points
  const corner = { x: b.x, y: a.y }
  const dx = b.x - a.x
  const dy = b.y - a.y

  const drag = useDragHandles(points, width, height, (i, p) =>
    setPoints((prev) =>
      prev.map((old, j) => (j === i ? clampToPlot(p, plot) : old)),
    ),
  )

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = readColors()
    const ctx = beginFrame(canvas, width, height, colors)
    if (!ctx) return
    drawAxes(ctx, width, height, colors)

    if (dx !== 0 && dy !== 0) drawRightAngle(ctx, corner, a, b, colors.muted)
    drawLine(ctx, a, corner, colors.muted, { dashed: true })
    drawLine(ctx, corner, b, colors.muted, { dashed: true })
    drawLine(ctx, a, b, colors.derived, { width: 3 })

    // leg labels sit just outside the triangle
    const below = dy < 0 ? 12 : -12
    const outside = dx < 0 ? -10 : 10
    if (dx !== 0) {
      drawLabel(
        ctx,
        `Δx = ${fmt(dx)}`,
        { x: (a.x + b.x) / 2, y: a.y + below },
        colors.muted,
        colors,
      )
    }
    if (dy !== 0) {
      ctx.font = SMALL_FONT
      const half = ctx.measureText(`Δy = ${fmt(dy)}`).width / 2 + 6
      drawLabel(
        ctx,
        `Δy = ${fmt(dy)}`,
        { x: b.x + outside + Math.sign(outside) * half, y: (a.y + b.y) / 2 },
        colors.muted,
        colors,
      )
    }
    drawLabel(
      ctx,
      `d = ${fmt(distance(a, b))}`,
      lerp(a, b, 0.5),
      colors.derived,
      colors,
    )

    drawDot(ctx, a, colors.first, {
      label: "A",
      labelSide: dx < 0 ? "right" : "left",
    })
    drawDot(ctx, b, colors.second, {
      label: "B",
      labelSide: dx < 0 ? "left" : "right",
    })
  })

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
            <thead>
              <tr>
                <th></th>
                <th>x</th>
                <th>y</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Swatch color={SWATCH.first} />A
                </td>
                <td>{a.x}</td>
                <td>{a.y}</td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.second} />B
                </td>
                <td>{b.x}</td>
                <td>{b.y}</td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.muted} />
                  Δx = B.x − A.x
                </td>
                <td colSpan={2}>{fmt(dx)}</td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.muted} />
                  Δy = B.y − A.y
                </td>
                <td colSpan={2}>{fmt(dy)}</td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.derived} />
                  distance d
                </td>
                <td colSpan={2}>{fmt(distance(a, b))}</td>
              </tr>
            </tbody>
          </table>
          <Pythagoras dx={dx} dy={dy} />
          <pre className={s.code}>
            <code>
              dist({a.x}, {a.y}, {b.x}, {b.y}) // {fmt(distance(a, b))}
            </code>
          </pre>
        </>
      }
    />
  )
}
