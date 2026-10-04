/**
 * 2D geometry shared by the geometry playgrounds (`PointPlayground`,
 * `PointLinePlayground`, `LinePlayground`, `CurvePlayground`), so they all
 * compute distances, intersections, and curves the same way the book's prose
 * describes them.
 *
 * Lines, rays, and segments all use the parametric form
 * `P(t) = a + t * (b - a)`; they differ only in which values of `t` are
 * allowed (see `T_RANGE`).
 */

export interface Point {
  x: number
  y: number
}

export const add = (a: Point, b: Point): Point => ({
  x: a.x + b.x,
  y: a.y + b.y,
})
export const sub = (a: Point, b: Point): Point => ({
  x: a.x - b.x,
  y: a.y - b.y,
})
export const scale = (v: Point, k: number): Point => ({
  x: v.x * k,
  y: v.y * k,
})
export const dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y
// z-component of the 3D cross product (a.x, a.y, 0) x (b.x, b.y, 0)
export const cross = (a: Point, b: Point) => a.x * b.y - a.y * b.x
export const length = (v: Point) => Math.sqrt(dot(v, v))
export const distance = (a: Point, b: Point) => length(sub(b, a))
export const lerp = (a: Point, b: Point, t: number): Point =>
  add(a, scale(sub(b, a), t))

export type LineKind = "segment" | "ray" | "line"

// which values of t put P(t) on the object
export const T_RANGE: Record<LineKind, [number, number]> = {
  segment: [0, 1],
  ray: [0, Infinity],
  line: [-Infinity, Infinity],
}

const EPSILON = 1e-9

export const inRange = (t: number, kind: LineKind) => {
  const [lo, hi] = T_RANGE[kind]
  return t >= lo - EPSILON && t <= hi + EPSILON
}

const clampT = (t: number, kind: LineKind) => {
  const [lo, hi] = T_RANGE[kind]
  return Math.min(hi, Math.max(lo, t))
}

export interface Linear {
  a: Point
  b: Point
  kind: LineKind
}

export interface Closest {
  /** closest point on the object */
  point: Point
  /** t of `point` */
  t: number
  /** t of the foot of the perpendicular on the infinite line, before clamping */
  rawT: number
}

/** Closest point to `p` on a segment, ray, or line. */
export function closestPoint(p: Point, { a, b, kind }: Linear): Closest {
  const r = sub(b, a)
  const rr = dot(r, r)
  const rawT = rr === 0 ? 0 : dot(sub(p, a), r) / rr
  const t = clampT(rawT, kind)
  return { point: lerp(a, b, t), t, rawT }
}

export type Intersection =
  | {
      kind: "crossing"
      /** where the infinite lines cross */
      point: Point
      t: number
      u: number
      /** whether that point is actually on each object */
      onFirst: boolean
      onSecond: boolean
    }
  | { kind: "parallel" }
  | { kind: "collinear"; overlapping: boolean }

/**
 * Solves `a + t * (b - a) = c + u * (d - c)`. The infinite lines always cross
 * unless they're parallel; `onFirst`/`onSecond` say whether the crossing is
 * on each object given its kind.
 */
export function intersect(first: Linear, second: Linear): Intersection {
  const r = sub(first.b, first.a)
  const s = sub(second.b, second.a)
  const ca = sub(second.a, first.a)
  const denom = cross(r, s)

  if (Math.abs(denom) <= EPSILON * length(r) * length(s)) {
    if (Math.abs(cross(ca, r)) > EPSILON * length(r) * length(ca)) {
      return { kind: "parallel" }
    }
    return { kind: "collinear", overlapping: collinearOverlap(first, second) }
  }

  const t = cross(ca, s) / denom
  const u = cross(ca, r) / denom
  return {
    kind: "crossing",
    point: lerp(first.a, first.b, t),
    t,
    u,
    onFirst: inRange(t, first.kind),
    onSecond: inRange(u, second.kind),
  }
}

// Both objects are on the same line: measure the second one in the first's t
// units and see if the two t intervals overlap.
function collinearOverlap(first: Linear, second: Linear): boolean {
  const r = sub(first.b, first.a)
  const rr = dot(r, r)
  if (rr === 0) return false
  const t0 = dot(sub(second.a, first.a), r) / rr
  const t1 = dot(sub(second.b, first.a), r) / rr
  let lo: number
  let hi: number
  if (second.kind === "segment") {
    lo = Math.min(t0, t1)
    hi = Math.max(t0, t1)
  } else if (second.kind === "ray") {
    ;[lo, hi] = t1 >= t0 ? [t0, Infinity] : [-Infinity, t0]
  } else {
    ;[lo, hi] = [-Infinity, Infinity]
  }
  const [flo, fhi] = T_RANGE[first.kind]
  return Math.max(lo, flo) <= Math.min(hi, fhi) + EPSILON
}

export interface Separation {
  distance: number
  /** closest point on the first object */
  from: Point
  /** closest point on the second object */
  to: Point
}

// the endpoints an object actually has: 2 for a segment, 1 for a ray
function endpoints({ a, b, kind }: Linear): Point[] {
  return kind === "segment" ? [a, b] : kind === "ray" ? [a] : []
}

/**
 * Shortest distance between two segments/rays/lines. If they touch it's 0.
 * Otherwise the closest pair always includes an endpoint of one of them, so
 * it's enough to check each endpoint against the other object. Two infinite
 * lines that don't touch must be parallel, so any point on one will do.
 */
export function separation(first: Linear, second: Linear): Separation {
  const hit = intersect(first, second)
  if (hit.kind === "crossing" && hit.onFirst && hit.onSecond) {
    return { distance: 0, from: hit.point, to: hit.point }
  }

  const candidates: Separation[] = []
  for (const p of endpoints(first)) {
    const q = closestPoint(p, second).point
    candidates.push({ distance: distance(p, q), from: p, to: q })
  }
  for (const q of endpoints(second)) {
    const p = closestPoint(q, first).point
    candidates.push({ distance: distance(p, q), from: p, to: q })
  }
  if (candidates.length === 0) {
    const q = closestPoint(first.a, second).point
    candidates.push({ distance: distance(first.a, q), from: first.a, to: q })
  }

  const best = candidates.reduce((m, c) => (c.distance < m.distance ? c : m))
  if (hit.kind === "collinear" && hit.overlapping) {
    return { distance: 0, from: best.from, to: best.from }
  }
  return best
}

/**
 * De Casteljau's construction for a cubic Bézier: three rounds of lerp at the
 * same t. Returns every level, so the playground can draw the construction;
 * the last level's single point is on the curve.
 */
export function deCasteljau(points: Point[], t: number): Point[][] {
  const levels = [points]
  while (levels[levels.length - 1].length > 1) {
    const prev = levels[levels.length - 1]
    levels.push(prev.slice(1).map((p, i) => lerp(prev[i], p, t)))
  }
  return levels
}

export type SplineEnds = "include" | "exclude"

/**
 * A cardinal spline as a chain of cubic Béziers, the same way p5 v2 draws
 * `splineVertex()`. Each piece from b to c uses its neighbors a and d to set
 * the handles: `b + (1 - tightness) / 6 * (c - a)` and
 * `c + (1 - tightness) / 6 * (b - d)`. With "include" ends, the first and last
 * points are doubled so the curve reaches them.
 */
export function cardinalToBezier(
  points: Point[],
  tightness: number,
  ends: SplineEnds,
): [Point, Point, Point, Point][] {
  const pts =
    ends === "include"
      ? [points[0], ...points, points[points.length - 1]]
      : points
  const k = (1 - tightness) / 6
  const pieces: [Point, Point, Point, Point][] = []
  for (let i = 0; i + 3 < pts.length; i++) {
    const [a, b, c, d] = pts.slice(i, i + 4)
    pieces.push([
      b,
      add(b, scale(sub(c, a), k)),
      add(c, scale(sub(b, d), k)),
      c,
    ])
  }
  return pieces
}
