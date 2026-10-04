import { useLayoutEffect, useRef, useState } from "react"
import { useDragHandles } from "../hooks/useDragHandles"
import { useTheme } from "../hooks/useTheme"
import type { Intersection, LineKind, Linear, Point } from "../utils/geometry"
import {
  T_RANGE,
  cross,
  dot,
  inRange,
  intersect,
  lerp,
  separation,
  sub,
} from "../utils/geometry"
import {
  SMALL_POINT_RADIUS,
  SWATCH,
  beginFrame,
  clampToPlot,
  drawArrowhead,
  drawAxes,
  drawDot,
  drawLabel,
  drawLine,
  plotFor,
  pointAt,
  readColors,
  visibleTRange,
} from "../utils/playgroundCanvas"
import type { PlaygroundColors } from "../utils/playgroundCanvas"
import {
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
 * import { LinePlayground } from "immerse/components/LinePlayground"
 *
 * <LinePlayground />
 * <LinePlayground showParameters />
 * ```
 *
 * Two draggable linear objects, AB and CD, in p5 coordinates. Each one can be
 * toggled between a segment, a ray (starting at its first point, heading
 * through its second), and an infinite line. The parts that belong to the
 * object are solid; the rest of the infinite line it sits on is dashed.
 *
 * Shows where the infinite lines cross (a hollow mark if that point isn't on
 * both objects, a solid one if it is), the shortest distance between the two
 * objects as they're currently defined (drawn as a path between the closest
 * points), and a readout of the direction vectors r = B − A and s = D − C
 * with their dot and cross products.
 *
 * `showParameters` adds the parametric view: the t and u of the crossing, a
 * sentence about which case that is, and a t slider that moves P(t) along AB
 * (past the ends, too) so the reader can see which values of t are on the
 * object. Leave it off where the book hasn't introduced parameters yet.
 *
 * Shares its look, colors, and drag behavior with the other geometry
 * playgrounds (see `utils/playgroundCanvas.ts`).
 */
export interface LinePlaygroundProps {
  width?: number
  height?: number
  showParameters?: boolean
}

const KINDS: { value: LineKind; label: string }[] = [
  { value: "segment", label: "Segment" },
  { value: "ray", label: "Ray" },
  { value: "line", label: "Line" },
]

// Draws a segment/ray/line: the part on the object solid, the rest of its
// infinite line dashed, and arrowheads where it runs off to infinity.
function drawLinear(
  ctx: CanvasRenderingContext2D,
  { a, b, kind }: Linear,
  color: string,
  width: number,
  height: number,
) {
  const dir = sub(b, a)
  if (dir.x === 0 && dir.y === 0) return
  const visible = visibleTRange(a, dir, width, height)
  if (!visible) return
  const [vlo, vhi] = visible
  const [lo, hi] = T_RANGE[kind]
  const slo = Math.max(lo, vlo)
  const shi = Math.min(hi, vhi)

  const dashed = (t0: number, t1: number) => {
    if (t1 > t0) {
      drawLine(ctx, pointAt(a, dir, t0), pointAt(a, dir, t1), color, {
        dashed: true,
        alpha: 0.5,
      })
    }
  }
  dashed(vlo, Math.min(slo, vhi))
  dashed(Math.max(shi, vlo), vhi)
  if (shi > slo) {
    drawLine(ctx, pointAt(a, dir, slo), pointAt(a, dir, shi), color, {
      width: 3,
    })
  }

  const angle = Math.atan2(dir.y, dir.x)
  if (hi === Infinity) drawArrowhead(ctx, pointAt(a, dir, vhi), angle, color)
  if (lo === -Infinity)
    drawArrowhead(ctx, pointAt(a, dir, vlo), angle + Math.PI, color)
}

const near = (v: number, target: number) => Math.abs(v - target) < 1e-6

function describe(
  hit: Intersection,
  first: Linear,
  second: Linear,
  showParameters: boolean,
): string {
  const n1 = `first ${first.kind}`
  const n2 = `second ${second.kind}`
  if (hit.kind === "parallel")
    return "They're parallel, so the infinite lines never cross."
  if (hit.kind === "collinear") {
    return hit.overlapping
      ? "They lie on the same line, and they overlap."
      : "They lie on the same line, but they don't overlap."
  }
  const at = fmtPoint(hit.point)
  const tu = (name: string, v: number) =>
    showParameters ? ` (${name} = ${fmt(v)})` : ""
  if (hit.onFirst && hit.onSecond) {
    const endpoint =
      (first.kind !== "line" &&
        (near(hit.t, 0) || (first.kind === "segment" && near(hit.t, 1)))) ||
      (second.kind !== "line" &&
        (near(hit.u, 0) || (second.kind === "segment" && near(hit.u, 1))))
    return `The ${n1} and the ${n2} cross at ${at}.${endpoint ? " That's exactly at an endpoint, so they just touch." : ""}`
  }
  if (hit.onFirst) {
    return `The infinite lines cross at ${at}. That's on the ${n1}, but not on the ${n2}${tu("u", hit.u)}.`
  }
  if (hit.onSecond) {
    return `The infinite lines cross at ${at}. That's on the ${n2}, but not on the ${n1}${tu("t", hit.t)}.`
  }
  return `The infinite lines cross at ${at}, but that point isn't on either one${showParameters ? ` (t = ${fmt(hit.t)}, u = ${fmt(hit.u)})` : ""}.`
}

export const LinePlayground: React.FC<LinePlaygroundProps> = ({
  width = 380,
  height = 320,
  showParameters = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useTheme()
  const plot = plotFor(width, height)
  const [points, setPoints] = useState<Point[]>([
    { x: 30, y: 200 },
    { x: 170, y: 60 },
    { x: 90, y: 30 },
    { x: 280, y: 170 },
  ])
  const [kinds, setKinds] = useState<[LineKind, LineKind]>([
    "segment",
    "segment",
  ])
  const [t, setT] = useState(0.5)

  const [a, b, c, d] = points
  const first: Linear = { a, b, kind: kinds[0] }
  const second: Linear = { a: c, b: d, kind: kinds[1] }
  const r = sub(b, a)
  const sv = sub(d, c)
  const hit = intersect(first, second)
  const gap = separation(first, second)
  const pt = lerp(a, b, t)

  const drag = useDragHandles(points, width, height, (i, pos) =>
    setPoints((prev) =>
      prev.map((old, j) => (j === i ? clampToPlot(pos, plot) : old)),
    ),
  )

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors: PlaygroundColors = readColors()
    const ctx = beginFrame(canvas, width, height, colors)
    if (!ctx) return
    drawAxes(ctx, width, height, colors)

    drawLinear(ctx, first, colors.first, width, height)
    drawLinear(ctx, second, colors.second, width, height)

    if (gap.distance > 0) {
      drawLine(ctx, gap.from, gap.to, colors.derived, { width: 2 })
      drawDot(ctx, gap.from, colors.derived, { radius: SMALL_POINT_RADIUS })
      drawDot(ctx, gap.to, colors.derived, { radius: SMALL_POINT_RADIUS })
      drawLabel(
        ctx,
        `d = ${fmt(gap.distance)}`,
        lerp(gap.from, gap.to, 0.5),
        colors.derived,
        colors,
      )
    }

    if (showParameters) {
      drawDot(ctx, pt, colors.derived, {
        label: "P(t)",
        labelSide: "below",
        hollow: !inRange(t, kinds[0]),
      })
    }

    drawDot(ctx, a, colors.first, { label: "A", labelSide: "left" })
    drawDot(ctx, b, colors.first, { label: "B" })
    drawDot(ctx, c, colors.second, { label: "C", labelSide: "left" })
    drawDot(ctx, d, colors.second, { label: "D" })

    if (hit.kind === "crossing") {
      const on = hit.onFirst && hit.onSecond
      drawDot(ctx, hit.point, on ? colors.hit : colors.muted, {
        hollow: !on,
        label: on ? "X" : undefined,
        labelSide: "above",
      })
    }
  })

  const kindToggle = (i: 0 | 1, label: string) => (
    <Toggle
      label={label}
      value={kinds[i]}
      options={KINDS}
      onChange={(k) =>
        setKinds((prev) => (i === 0 ? [k, prev[1]] : [prev[0], k]))
      }
    />
  )

  return (
    <PlaygroundLayout
      width={width}
      height={height}
      controls={
        <>
          {kindToggle(0, "A→B")}
          {kindToggle(1, "C→D")}
          {showParameters && (
            <Slider
              label="t"
              value={t}
              min={-1}
              max={2}
              step={0.01}
              onChange={setT}
            />
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
          <table className={s.readout}>
            <tbody>
              <tr>
                <td>
                  <Swatch color={SWATCH.first} />r = B − A
                </td>
                <td>{fmtPoint(r)}</td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.second} />s = D − C
                </td>
                <td>{fmtPoint(sv)}</td>
              </tr>
              <tr>
                <td>r ⋅ s (dot product)</td>
                <td>{fmt(dot(r, sv))}</td>
              </tr>
              <tr>
                <td>r × s (cross product)</td>
                <td>{fmt(cross(r, sv))}</td>
              </tr>
              {showParameters && (
                <>
                  <tr>
                    <td>t at the crossing</td>
                    <td>{hit.kind === "crossing" ? fmt(hit.t) : "—"}</td>
                  </tr>
                  <tr>
                    <td>u at the crossing</td>
                    <td>{hit.kind === "crossing" ? fmt(hit.u) : "—"}</td>
                  </tr>
                  <tr>
                    <td>
                      <Swatch color={SWATCH.derived} />
                      P(t) = A + t(B − A)
                    </td>
                    <td>{fmtPoint(pt)}</td>
                  </tr>
                </>
              )}
              <tr>
                <td>
                  <Swatch color={SWATCH.hit} />
                  intersection
                </td>
                <td>
                  {hit.kind === "crossing" && hit.onFirst && hit.onSecond
                    ? fmtPoint(hit.point)
                    : hit.kind === "collinear" && hit.overlapping
                      ? "overlap"
                      : "none"}
                </td>
              </tr>
              <tr>
                <td>
                  <Swatch color={SWATCH.derived} />
                  distance
                </td>
                <td>{fmt(gap.distance)}</td>
              </tr>
            </tbody>
          </table>
          <p className={s.status}>
            {describe(hit, first, second, showParameters)}
            {gap.distance > 0 &&
              ` The closest they get is ${fmt(gap.distance)}.`}
            {showParameters &&
              ` P(t) is ${inRange(t, kinds[0]) ? "on" : "not on"} the first ${kinds[0]} at t = ${fmt(t)}.`}
          </p>
        </>
      }
    />
  )
}
