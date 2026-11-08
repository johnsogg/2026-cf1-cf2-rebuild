import { useId } from "react"
import { useSlideStep } from "./Slide"
import { CRITERIA } from "./WickedCriteria"

type Part = 1 | 2 | 3
type Emphasis = Part | "all"

export interface YouAreHereProps {
  /**
   * Which part to emphasize (the rest are grayed out). 1 = current reality
   * (the pin), 2 = desired reality (the X), 3 = the path between. Give an
   * array to step through states, one per key press.
   */
  emphasize?: Emphasis | Emphasis[]
  /**
   * An arrow pointing up at one part. Give an array to step through states
   * alongside `emphasize`, one per key press (`null` = no arrow).
   */
  pointer?: Part | (Part | null)[]
  /** Place the ten wicked-problem criteria (short labels) on the map. */
  numbers?: boolean
  /** The "you are here" label. */
  label?: boolean
}

// Where each wicked-problem criterion's bubble is centered on the map. The
// bubbles carry the short labels, colored as on the criteria slide.
const BUBBLES: Record<number, { part: Part; x: number; y: number }> = {
  1: { part: 1, x: 125, y: 300 },
  2: { part: 2, x: 780, y: 75 },
  3: { part: 2, x: 765, y: 30 },
  4: { part: 2, x: 620, y: 30 },
  5: { part: 2, x: 610, y: 78 },
  6: { part: 2, x: 715, y: 255 },
  7: { part: 3, x: 240, y: 150 },
  8: { part: 3, x: 400, y: 160 },
  9: { part: 3, x: 400, y: 110 },
  10: { part: 3, x: 480, y: 300 },
}
const BUBBLE_FONT = 15
const BUBBLE_H = 26
const bubbleWidth = (text: string) => text.length * 8.2 + 22
const bubbles = CRITERIA.map((c) => ({
  ...c,
  ...BUBBLES[c.n],
  w: bubbleWidth(c.text),
}))

const POINTERS: Record<Part, { x: number; tip: number; base: number }> = {
  1: { x: 110, tip: 240, base: 300 },
  2: { x: 690, tip: 215, base: 275 },
  3: { x: 470, tip: 252, base: 312 },
}

export const YouAreHere = ({
  emphasize = "all",
  pointer,
  numbers = false,
  label = true,
}: YouAreHereProps) => {
  const states = Array.isArray(emphasize) ? emphasize : [emphasize]
  const pointerStates = Array.isArray(pointer) ? pointer : [pointer ?? null]
  const step = useSlideStep(Math.max(states.length, pointerStates.length) - 1)
  const current = states[Math.min(step, states.length - 1)]
  const pointing = pointerStates[Math.min(step, pointerStates.length - 1)]
  const filterId = "wobble" + useId().replace(/:/g, "")

  const partStyle = (part: Part) => ({
    color: current === part ? "var(--accent)" : "var(--text)",
    opacity: current === "all" || current === part ? 1 : 0.18,
    transition: "opacity 0.35s ease, color 0.35s ease",
  })

  return (
    <svg
      viewBox="0 0 840 330"
      role="img"
      aria-label="A map with a you-are-here pin, a dotted path, and an X"
      style={{ width: "100%", height: "auto" }}
      fill="none"
      stroke="currentColor"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves={2}
            seed={3}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={5} />
        </filter>
      </defs>
      {/* The sketchy layer: only lines are wobbled. */}
      <g filter={`url(#${filterId})`}>
        {/* 1: the pin */}
        <g style={partStyle(1)}>
          <path d="M110 224 C80 192 72 162 90 146 C106 132 132 136 139 156 C146 176 130 200 110 224 Z" />
          <circle cx={110} cy={160} r={8} fill="currentColor" />
        </g>

        {/* 3: the path */}
        <g style={partStyle(3)}>
          <path
            d="M138 234 C230 284 320 180 430 216 S590 252 650 192"
            strokeWidth={8}
            strokeDasharray="0.1 18"
          />
        </g>

        {/* 2: the X */}
        <g style={partStyle(2)}>
          <path d="M660 140 L722 198" />
          <path d="M668 134 L730 192" />
          <path d="M724 136 L664 196" />
          <path d="M730 142 L670 202" />
        </g>

        {numbers &&
          bubbles.map(({ n, part, x, y, w, color }) => (
            <g key={n} style={{ ...partStyle(part), color }}>
              <rect
                x={x - w / 2}
                y={y - BUBBLE_H / 2}
                width={w}
                height={BUBBLE_H}
                rx={BUBBLE_H / 2}
                strokeWidth={2.5}
                style={{
                  fill: "color-mix(in srgb, currentColor 12%, transparent)",
                }}
              />
            </g>
          ))}

        {pointing && (
          <g style={{ color: "var(--accent)" }}>
            <path
              d={`M${POINTERS[pointing].x} ${POINTERS[pointing].base} L${POINTERS[pointing].x} ${POINTERS[pointing].tip}`}
            />
            <path
              d={`M${POINTERS[pointing].x - 14} ${POINTERS[pointing].tip + 20} L${POINTERS[pointing].x} ${POINTERS[pointing].tip} L${POINTERS[pointing].x + 14} ${POINTERS[pointing].tip + 20}`}
            />
          </g>
        )}
      </g>

      {/* The text layer: ordinary, unwobbled type. */}
      <g fill="currentColor" stroke="none">
        {label && (
          <text
            x={52}
            y={132}
            transform="rotate(-28 52 132)"
            fontSize={26}
            style={partStyle(1)}
          >
            you are here
          </text>
        )}
        {numbers &&
          bubbles.map(({ n, part, x, y, text }) => (
            <text
              key={n}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={BUBBLE_FONT}
              style={{ ...partStyle(part), color: "var(--text)" }}
            >
              {text}
            </text>
          ))}
      </g>
    </svg>
  )
}
