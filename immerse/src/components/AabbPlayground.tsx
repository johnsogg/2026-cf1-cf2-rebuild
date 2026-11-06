import s from "./AabbPlayground.module.css"

/**
 * A weird polygon with a hole. Hover (or tap/focus) the shape to reveal its
 * axis-aligned bounding box. Import as
 * `import { AabbPlayground } from "immerse/components/AabbPlayground"`.
 */

type Pt = [number, number]

// Vertices in source-image pixels (1130 x 1097), clockwise.
const OUTER: Pt[] = [
  [80, 35], [570, 2], [515, 205], [795, 227], [1094, 63], [1127, 396],
  [1005, 643], [795, 591], [707, 462], [600, 502], [548, 644], [743, 894],
  [707, 1020], [515, 1094], [493, 971], [426, 971], [327, 1020], [212, 1005],
  [275, 894], [212, 864], [80, 864], [2, 624], [116, 559], [194, 736],
  [301, 540], [24, 303],
]
const HOLE: Pt[] = [
  [142, 118], [394, 63], [394, 257], [617, 350], [414, 540], [116, 268],
]

const xs = OUTER.map(([x]) => x)
const ys = OUTER.map(([, y]) => y)
const minX = Math.min(...xs)
const minY = Math.min(...ys)
const width = Math.max(...xs) - minX
const height = Math.max(...ys) - minY

const pct = ([x, y]: Pt) =>
  `${(((x - minX) / width) * 100).toFixed(2)}% ${(((y - minY) / height) * 100).toFixed(2)}%`

// One contour: outer ring, then a zero-width bridge into the hole ring and
// back. The even-odd fill rule makes the hole transparent.
const CLIP_PATH = `polygon(evenodd, ${[
  OUTER[0], ...HOLE, HOLE[0], ...OUTER,
]
  .map(pct)
  .join(", ")})`

export const AabbPlayground = () => (
  <div className={s.box} style={{ aspectRatio: `${width} / ${height}` }}>
    <div className={s.shape} style={{ clipPath: CLIP_PATH }} tabIndex={0} />
  </div>
)
