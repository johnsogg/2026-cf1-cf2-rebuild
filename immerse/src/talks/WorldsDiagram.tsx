import { useEffect, useId, useRef, useState } from "react"
import { useSlideArrived, useSlideStep } from "./Slide"

export interface WorldsDiagramProps {
  /**
   * Which perspectives to draw: indices into the available shapes (0-5). Give
   * an array of arrays to step through states, one per key press, e.g.
   * `[[1], [1, 2], [1, 2, 3]]`.
   *
   * 0 is the tall "hero" shape for a diagram with a single view of the world.
   * 1, 2, 3 are shorter shapes at different heights (top, middle, bottom),
   * overlapping partway. 4 and 5 are spares. All of them share the same
   * "coastline" facing the other world, which is what the Plan is cut to fit.
   */
  shapes?: number[] | number[][]
  /** Optional name for each perspective, by index ("you", "your boss", ...). */
  labels?: string[]
  /**
   * 0 to 1: how far each perspective has been pulled toward the hero shape
   * (the consensus). Give an array to step through values; the shapes glide
   * between them.
   */
  agreement?: number | number[]
  /**
   * The agreement to show until you arrive at the slide. On arrival the shapes
   * glide from this to `agreement`, so a slide can pick up exactly where the
   * previous one ended and then change.
   */
  from?: number
  /** The Plan shape between the two worlds. */
  plan?: boolean
  /** "The world as it is" / "The world as it is imagined" under each side. */
  captions?: boolean
}

type Point = [number, number]
type Box = { outer: number; top: number; bottom: number; off: number }

const W = 1000
const H = 530
const EDGE_POINTS = 13
const PLAN_POINTS = 15
const GAP = 16 // space left between the Plan and each world's coastline

// Tiny seeded generator so every shape is stable between renders.
const seeded = (seed: number) => {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// A closed, smooth curve through the points (Catmull-Rom as cubic Beziers).
const smoothClosed = (pts: Point[]): string => {
  const n = pts.length
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d + " Z"
}

// The coastlines: x of each world's facing edge at height y, in left-world
// coordinates (the right world is mirrored). Every perspective follows its
// side's coastline, and the Plan is cut to fit between the two.
const coastLeft = (y: number) =>
  395 + 15 * Math.sin(y / 37 + 0.8) + 10 * Math.sin(y / 15 + 2.1)
const coastRight = (y: number) =>
  395 + 15 * Math.sin(y / 43 + 2.4) + 10 * Math.sin(y / 18 + 0.3)

// One world: a blob with a rounded outer side and a ragged edge that follows
// the coastline, as outline points. Drawn for the left side, then mirrored for
// the right. Every world has the same number of points so they can be blended.
const makeWorld = (box: Box, seed: number, side: "left" | "right") => {
  const r = seeded(seed)
  const { outer, top, bottom, off } = box
  const coast = side === "left" ? coastLeft : coastRight
  const edgeAt = (y: number) => coast(y) + off + (r() - 0.5) * 8
  const mid = (top + bottom) / 2
  const edgePts: Point[] = []
  for (let i = 0; i < EDGE_POINTS; i++) {
    const y = top + 25 + ((bottom - top - 50) * i) / (EDGE_POINTS - 1)
    edgePts.push([edgeAt(y), y])
  }
  const pts: Point[] = [
    [outer + 20, top + 25],
    [outer + 130, top],
    [edgeAt(top + 5) - 120, top + 5],
    [edgeAt(top + 25) - 25, top + 25],
    ...edgePts,
    [edgeAt(bottom - 20) - 30, bottom - 20],
    [edgeAt(bottom) - 140, bottom],
    [outer + 120, bottom - 5],
    [outer + 15, bottom - 35],
    [outer - 5, mid + 20],
    [outer - 3, mid - 30],
  ]
  return pts.map((p): Point => (side === "left" ? p : [W - p[0], p[1]]))
}

// `off` pulls a perspective's edge back from the coastline (negative = left).
const LEFT_BOXES: Box[] = [
  { outer: 30, top: 60, bottom: 420, off: 0 }, // hero
  { outer: 20, top: 15, bottom: 255, off: -40 }, // top
  { outer: 75, top: 120, bottom: 360, off: -8 }, // middle
  { outer: 35, top: 225, bottom: 465, off: -28 }, // bottom
  { outer: 50, top: 90, bottom: 400, off: -15 },
  { outer: 20, top: 30, bottom: 450, off: -5 },
]
const RIGHT_BOXES: Box[] = [
  { outer: 35, top: 50, bottom: 430, off: 0 },
  { outer: 45, top: 20, bottom: 265, off: -15 },
  { outer: 25, top: 125, bottom: 365, off: -38 },
  { outer: 60, top: 215, bottom: 470, off: -5 },
  { outer: 40, top: 75, bottom: 410, off: -20 },
  { outer: 25, top: 25, bottom: 455, off: -10 },
]
const COUNT = LEFT_BOXES.length
const LEFT = LEFT_BOXES.map((b, i) => makeWorld(b, 11 + i * 7, "left"))
const RIGHT = RIGHT_BOXES.map((b, i) => makeWorld(b, 97 + i * 13, "right"))

// Perspective 0 is drawn in the text color; the rest take theme accents.
const COLORS = [
  "var(--text)",
  "var(--accent)",
  "var(--warning)",
  "var(--success)",
  "var(--error)",
  "var(--text-muted)",
]

// Move each point a fraction `a` of the way toward the hero shape's point.
const toward = (pts: Point[], hero: Point[], a: number): Point[] =>
  pts.map((p, i): Point => [
    p[0] + (hero[i][0] - p[0]) * a,
    p[1] + (hero[i][1] - p[1]) * a,
  ])

// The Plan shape: its left side fits the left world's coastline and its
// right side fits the right world's, like continents that once fit together.
const PLAN_PATH = (() => {
  const top = 85
  const bottom = 395
  const ys = Array.from(
    { length: PLAN_POINTS },
    (_, i) => top + ((bottom - top) * i) / (PLAN_POINTS - 1),
  )
  const left: Point[] = ys.map((y) => [coastLeft(y) + GAP, y])
  const right: Point[] = ys.map((y) => [W - coastRight(y) - GAP, y])
  const cx = (a: Point, b: Point) => (a[0] + b[0]) / 2
  return smoothClosed([
    [cx(left[0], right[0]), top - 30],
    ...right,
    [cx(left[PLAN_POINTS - 1], right[PLAN_POINTS - 1]), bottom + 30],
    ...[...left].reverse(),
  ])
})()

// Glide a number toward its target.
const useTween = (target: number, ms = 700) => {
  const [value, setValue] = useState(target)
  const current = useRef(target)
  useEffect(() => {
    const from = current.current
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ms)
      const eased = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
      current.current = from + (target - from) * eased
      setValue(current.current)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return value
}

export const WorldsDiagram = ({
  shapes = [0],
  labels,
  agreement = 0,
  from,
  plan = true,
  captions = true,
}: WorldsDiagramProps) => {
  const shapeStates: number[][] = Array.isArray(shapes[0])
    ? (shapes as number[][])
    : [shapes as number[]]
  const agreementStates = Array.isArray(agreement) ? agreement : [agreement]
  const step = useSlideStep(
    Math.max(shapeStates.length, agreementStates.length) - 1,
  )
  const pick = <T,>(states: T[]) => states[Math.min(step, states.length - 1)]
  const visible = new Set(pick(shapeStates))
  const arrived = useSlideArrived()
  const a = useTween(arrived ? pick(agreementStates) : (from ?? pick(agreementStates)))
  const filterId = "wobble" + useId().replace(/:/g, "")

  const perspectiveStyle = (i: number) => ({
    color: COLORS[i],
    opacity: visible.has(i) ? 1 : 0,
    transition: "opacity 0.35s ease",
  })

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Two worlds, the world as it is and the world as it is imagined, with a plan that fits between them"
      style={{ width: "100%", height: "auto", maxHeight: "100%", minHeight: 0 }}
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves={2}
            seed={5}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={5} />
        </filter>
      </defs>
      {/* The sketchy layer: only lines are wobbled. */}
      <g filter={`url(#${filterId})`}>
        {Array.from({ length: COUNT }, (_, i) => {
          const left = i === 0 ? LEFT[0] : toward(LEFT[i], LEFT[0], a)
          const right = i === 0 ? RIGHT[0] : toward(RIGHT[i], RIGHT[0], a)
          return (
            <g
              key={i}
              style={{
                ...perspectiveStyle(i),
                fill: "color-mix(in srgb, currentColor 6%, transparent)",
              }}
            >
              <path d={smoothClosed(left)} />
              <path d={smoothClosed(right)} />
            </g>
          )
        })}

        {plan && (
          <path
            d={PLAN_PATH}
            strokeDasharray="0.1 13"
            strokeWidth={6}
            style={{
              color: "var(--accent)",
              fill: "color-mix(in srgb, var(--accent) 14%, transparent)",
            }}
          />
        )}
      </g>

      {/* The text layer: ordinary, unwobbled type. */}
      <g fill="currentColor" stroke="none">
        {labels &&
          Array.from({ length: COUNT }, (_, i) => {
            if (!labels[i]) return null
            const box = LEFT_BOXES[i]
            const rbox = RIGHT_BOXES[i]
            return (
              <g key={i} style={perspectiveStyle(i)} fontSize={26}>
                <text x={box.outer + 45} y={box.top + 85}>
                  {labels[i]}
                </text>
                <text
                  x={W - rbox.outer - 45}
                  y={rbox.top + 85}
                  textAnchor="end"
                >
                  {labels[i]}
                </text>
              </g>
            )
          })}

        {plan && (
          <text
            x={W / 2}
            y={H / 2 - 8}
            textAnchor="middle"
            fontSize={34}
            fontWeight={600}
            style={{ color: "var(--accent)" }}
          >
            Plan
          </text>
        )}

        {captions && (
          <g fontSize={32} textAnchor="middle" style={{ color: "var(--text)" }}>
            <text x={225} y={H - 12}>
              The world as it is
            </text>
            <text x={W - 225} y={H - 12}>
              The world as it is imagined
            </text>
          </g>
        )}
      </g>
    </svg>
  )
}
