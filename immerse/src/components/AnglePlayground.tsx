import { useLayoutEffect, useRef, useState } from "react"
import type { PointerEvent } from "react"
import { useTheme } from "../hooks/useTheme"
import type { Point } from "../utils/geometry"
import {
  AXIS_MARGIN,
  SMALL_FONT,
  SWATCH,
  beginFrame,
  drawArrow,
  drawDot,
  drawLabel,
  drawLine,
  readColors,
} from "../utils/playgroundCanvas"
import {
  PlaygroundLayout,
  Swatch,
  Toggle,
  fmt,
  styles as s,
} from "./GeometryPlaygroundParts"

/**
 * Usage (in a book `.mdx` section):
 *
 * ```mdx
 * import { AnglePlayground } from "immerse/components/AnglePlayground"
 *
 * <AnglePlayground />
 * ```
 *
 * A fixed-length vector spinning around an origin at the center of the
 * canvas, in p5 coordinates (y grows downward, so positive angles turn
 * clockwise on screen). Press or drag anywhere to point it; it snaps to
 * multiples of 45° when close, so exact values are easy to hit.
 *
 * Draws the angle θ as an arc from the zero direction, and the vector's
 * shadows on the x and y axes, color coded: cos θ in the first color, sin θ
 * in the second. A toggle picks which way θ = 0 points: along +x (the usual
 * convention, and what p5's `cos()`/`sin()` assume) or up the screen (−y,
 * like a compass heading). Pointing up swaps the roles - x becomes
 * `sin(θ)` and y becomes `-cos(θ)` - and the shadows recolor to match.
 *
 * Shares its look and colors with the other geometry playgrounds (see
 * `utils/playgroundCanvas.ts`), but puts the origin in the middle.
 */
export interface AnglePlaygroundProps {
  width?: number
  height?: number
  /** length of the vector, in canvas units */
  radius?: number
}

type Zero = "right" | "up"

const ZEROS: { value: Zero; label: string }[] = [
  { value: "right", label: "Right (+x)" },
  { value: "up", label: "Up (−y)" },
]

const TWO_PI = Math.PI * 2
const SNAP = (2 * Math.PI) / 180 // within 2° of a 45° multiple

// angle in [0, 2π)
const wrap = (a: number) => ((a % TWO_PI) + TWO_PI) % TWO_PI

export const AnglePlayground: React.FC<AnglePlaygroundProps> = ({
  width = 340,
  height = 340,
  radius = 100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useTheme()
  const [theta, setTheta] = useState(Math.PI / 6)
  const [zero, setZero] = useState<Zero>("right")
  const [dragging, setDragging] = useState(false)

  // where θ = 0 points, as a canvas angle (canvas angles also grow clockwise)
  const zeroAngle = zero === "right" ? 0 : -Math.PI / 2
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  // the vector's components: (cos, sin) from +x, (sin, -cos) from up
  const unit: Point =
    zero === "right" ? { x: cos, y: sin } : { x: sin, y: -cos }
  const tip: Point = { x: radius * unit.x, y: radius * unit.y }

  // which function each axis shows, and its color
  const xAxis =
    zero === "right"
      ? { name: "cos θ", value: cos, color: "first" }
      : { name: "sin θ", value: sin, color: "second" }
  const yAxis =
    zero === "right"
      ? { name: "sin θ", value: sin, color: "second" }
      : { name: "−cos θ", value: -cos, color: "first" }

  const pointAt = (e: PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * width - width / 2
    const y = ((e.clientY - rect.top) / rect.height) * height - height / 2
    if (x === 0 && y === 0) return
    let a = wrap(Math.atan2(y, x) - zeroAngle)
    const nearest = Math.round(a / (Math.PI / 4)) * (Math.PI / 4)
    if (Math.abs(a - nearest) < SNAP) a = wrap(nearest)
    setTheta(a)
  }

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = readColors()
    const ctx = beginFrame(canvas, width, height, colors)
    if (!ctx) return
    // origin in the middle instead of the top-left
    ctx.translate(width / 2 - AXIS_MARGIN, height / 2 - AXIS_MARGIN)
    const hw = width / 2 - 14
    const hh = height / 2 - 14

    // axes through the origin
    drawLine(ctx, { x: -hw, y: 0 }, { x: 0, y: 0 }, colors.text, { width: 1.5 })
    drawLine(ctx, { x: 0, y: -hh }, { x: 0, y: 0 }, colors.text, { width: 1.5 })
    drawArrow(ctx, { x: 0, y: 0 }, { x: hw, y: 0 }, colors.text, 1.5)
    drawArrow(ctx, { x: 0, y: 0 }, { x: 0, y: hh }, colors.text, 1.5)
    ctx.fillStyle = colors.text
    ctx.font = `600 16px "Public Sans", system-ui, sans-serif`
    ctx.textAlign = "left"
    ctx.textBaseline = "bottom"
    ctx.fillText("x", hw - 8, -6)
    ctx.fillText("y", 8, hh)

    // the circle the tip travels on
    ctx.save()
    ctx.strokeStyle = colors.muted
    ctx.globalAlpha = 0.5
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, TWO_PI)
    ctx.stroke()
    ctx.restore()

    // θ = 0 direction
    const zeroDir = { x: Math.cos(zeroAngle), y: Math.sin(zeroAngle) }
    drawLine(
      ctx,
      { x: 0, y: 0 },
      { x: zeroDir.x * (radius + 18), y: zeroDir.y * (radius + 18) },
      colors.muted,
      { dashed: true },
    )
    const zeroLabel = {
      x: zeroDir.x * (radius + 34) + (zero === "up" ? 0 : -6),
      y: zeroDir.y * (radius + 30) + (zero === "up" ? 0 : -12),
    }
    drawLabel(ctx, "θ = 0", zeroLabel, colors.muted, colors)

    // the angle, as an arc from the zero direction
    const arcR = 34
    ctx.save()
    ctx.strokeStyle = colors.derived
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, arcR, zeroAngle, zeroAngle + theta)
    ctx.stroke()
    ctx.restore()

    // shadows on the axes, with guides from the tip
    const xColor = colors[xAxis.color as "first" | "second"]
    const yColor = colors[yAxis.color as "first" | "second"]
    drawLine(ctx, tip, { x: tip.x, y: 0 }, colors.muted, {
      dashed: true,
      width: 1,
    })
    drawLine(ctx, tip, { x: 0, y: tip.y }, colors.muted, {
      dashed: true,
      width: 1,
    })
    drawLine(ctx, { x: 0, y: 0 }, { x: tip.x, y: 0 }, xColor, { width: 5 })
    drawLine(ctx, { x: 0, y: 0 }, { x: 0, y: tip.y }, yColor, { width: 5 })
    // Keep the axis labels clear of the θ arc: a label sits halfway along its
    // bar, but no closer to the origin than it takes for its whole box (the
    // drawLabel backing, 16px tall) to stay outside the arc.
    const clearance = arcR + 6
    ctx.font = SMALL_FONT
    const halfWidth = (text: string) => ctx.measureText(text).width / 2 + 3
    // how far along an axis a label's center must be, given its half size
    // along the axis, its offset off the axis, and its half size across it
    const clearAlong = (
      alongHalf: number,
      offset: number,
      acrossHalf: number,
    ) => {
      const near = Math.max(0, Math.abs(offset) - acrossHalf)
      return alongHalf + Math.sqrt(Math.max(0, clearance ** 2 - near ** 2))
    }
    const along = (bar: number, min: number) =>
      Math.sign(bar) * Math.max(Math.abs(bar) / 2, min)
    // label boxes drawn so far, as center + half sizes, for the θ label to
    // steer around
    const boxes: { c: Point; hw: number; hh: number }[] = [
      { c: zeroLabel, hw: halfWidth("θ = 0"), hh: 8 },
    ]
    if (Math.abs(tip.x) > 20) {
      const offset = tip.y > 0 ? -12 : 12
      const c = {
        x: along(tip.x, clearAlong(halfWidth(xAxis.name), offset, 8)),
        y: offset,
      }
      drawLabel(ctx, xAxis.name, c, xColor, colors)
      boxes.push({ c, hw: halfWidth(xAxis.name), hh: 8 })
    }
    if (Math.abs(tip.y) > 20) {
      const c = {
        x: tip.x > 0 ? -24 : 24,
        y: along(tip.y, clearAlong(8, 24, halfWidth(yAxis.name))),
      }
      drawLabel(ctx, yAxis.name, c, yColor, colors)
      boxes.push({ c, hw: halfWidth(yAxis.name), hh: 8 })
    }

    // The θ label goes just outside the arc, on the arc's bisector if there's
    // room. Otherwise it takes the nearest spot (farther out, or around the
    // circle) that clears the other labels, the arrow, the axis bars, the
    // dashed guides, and the zero-direction line. Hidden only if nothing fits.
    if (theta > 0.02) {
      const hw = halfWidth("θ")
      const hh = 8
      const segments: [Point, Point][] = [
        [{ x: 0, y: 0 }, tip],
        [
          { x: 0, y: 0 },
          { x: zeroDir.x * (radius + 18), y: zeroDir.y * (radius + 18) },
        ],
        [
          { x: 0, y: 0 },
          { x: tip.x, y: 0 },
        ],
        [
          { x: 0, y: 0 },
          { x: 0, y: tip.y },
        ],
        // the dashed guides from the tip to each axis
        [tip, { x: tip.x, y: 0 }],
        [tip, { x: 0, y: tip.y }],
      ]
      const segmentDistance = (p: Point, [a, b]: [Point, Point]) => {
        const r = { x: b.x - a.x, y: b.y - a.y }
        const rr = r.x * r.x + r.y * r.y
        const t =
          rr === 0
            ? 0
            : Math.min(
                1,
                Math.max(0, ((p.x - a.x) * r.x + (p.y - a.y) * r.y) / rr),
              )
        return Math.hypot(p.x - (a.x + t * r.x), p.y - (a.y + t * r.y))
      }
      const fits = (c: Point) =>
        Math.hypot(c.x, c.y) - Math.hypot(hw, hh) > arcR + 2 &&
        segments.every(
          (seg) => segmentDistance(c, seg) > Math.hypot(hw, hh) + 2,
        ) &&
        boxes.every(
          (b) =>
            Math.abs(c.x - b.c.x) > hw + b.hw + 2 ||
            Math.abs(c.y - b.c.y) > hh + b.hh + 2,
        )
      // candidates scored by how far they stray: outward from the arc, and
      // around from the bisector (a radian around costs about 60px outward)
      const mid = zeroAngle + theta / 2
      const candidates: { c: Point; score: number }[] = []
      for (let k = -36; k <= 36; k++) {
        const offset = k * 0.05
        for (let r = arcR + 14; r <= radius + 10; r += 4) {
          const c = {
            x: r * Math.cos(mid + offset),
            y: r * Math.sin(mid + offset),
          }
          candidates.push({ c, score: r - arcR + 60 * Math.abs(offset) })
        }
      }
      candidates.sort((a, b) => a.score - b.score)
      const spot = candidates.find(({ c }) => fits(c))?.c
      if (spot) drawLabel(ctx, "θ", spot, colors.derived, colors)
    }

    drawArrow(ctx, { x: 0, y: 0 }, tip, colors.text, 3)
    drawDot(ctx, tip, colors.text, { radius: 5 })
    drawDot(ctx, { x: 0, y: 0 }, colors.muted, { radius: 3 })
  })

  const deg = (theta * 180) / Math.PI
  const xCode = zero === "right" ? "cos(theta)" : "sin(theta)"
  const yCode = zero === "right" ? "sin(theta)" : "-cos(theta)"

  return (
    <PlaygroundLayout
      width={width}
      height={height}
      controls={
        <Toggle
          label="θ = 0 points"
          value={zero}
          options={ZEROS}
          onChange={setZero}
        />
      }
      canvas={
        <canvas
          ref={canvasRef}
          className={s.canvas}
          style={{ cursor: dragging ? "grabbing" : "grab" }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            setDragging(true)
            pointAt(e)
          }}
          onPointerMove={(e) => dragging && pointAt(e)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        />
      }
      side={
        <>
          <table className={s.readout}>
            <tbody>
              <tr>
                <td>
                  <Swatch color={SWATCH.derived} />
                  angle θ
                </td>
                <td>{fmt(theta, 3)} radians</td>
              </tr>
              <tr>
                <td></td>
                <td>{fmt(deg, 1)}°</td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.first} />
                  cos θ
                </td>
                <td>{fmt(cos, 3)}</td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.second} />
                  sin θ
                </td>
                <td>{fmt(sin, 3)}</td>
              </tr>
              <tr>
                <td>tip x</td>
                <td>{fmt(tip.x, 1)}</td>
              </tr>
              <tr>
                <td>tip y</td>
                <td>{fmt(tip.y, 1)}</td>
              </tr>
            </tbody>
          </table>
          <pre className={s.code}>
            <code>
              {`let x = ${xCode} * ${radius} // ${fmt(tip.x, 1)}\nlet y = ${yCode} * ${radius} // ${fmt(tip.y, 1)}`}
            </code>
          </pre>
          <p className={s.status}>
            {zero === "right"
              ? "θ = 0 points along +x. This is the usual convention, and it's what p5's cos() and sin() assume: x comes from cos, y comes from sin."
              : "θ = 0 points up the screen, like a compass heading. Measuring from a different starting direction swaps the roles: now x comes from sin, and y comes from −cos."}{" "}
            Either way, θ grows clockwise on screen, because y points down.
          </p>
        </>
      }
    />
  )
}
