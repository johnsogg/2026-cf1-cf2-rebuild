import { useId } from "react"
import { useSlideStep } from "./Slide"

type Part = 1 | 2 | 3
type Emphasis = Part | "all"

export interface YouAreHereProps {
  /**
   * Which part to emphasize (the rest are grayed out). 1 = current reality
   * (the pin), 2 = desired reality (the X), 3 = the path between. Give an
   * array to step through states, one per key press.
   */
  emphasize?: Emphasis | Emphasis[]
  /** An arrow pointing up at one part. */
  pointer?: Part
  /** Place the ten wicked-problem criteria on the map. */
  numbers?: boolean
  /** The "you are here" label. */
  label?: boolean
}

// Where each wicked-problem criterion sits on the map.
const NUMBERS: { n: number; part: Part; x: number; y: number }[] = [
  { n: 1, part: 1, x: 50, y: 262 },
  { n: 2, part: 2, x: 600, y: 112 },
  { n: 3, part: 2, x: 660, y: 78 },
  { n: 4, part: 2, x: 730, y: 78 },
  { n: 5, part: 2, x: 790, y: 118 },
  { n: 6, part: 2, x: 775, y: 245 },
  { n: 7, part: 3, x: 330, y: 150 },
  { n: 8, part: 3, x: 395, y: 135 },
  { n: 9, part: 3, x: 370, y: 288 },
  { n: 10, part: 3, x: 440, y: 295 },
]

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
  const step = useSlideStep(states.length - 1)
  const current = states[Math.min(step, states.length - 1)]
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
          NUMBERS.map(({ n, part, x, y }) => (
            <g key={n} style={partStyle(part)}>
              <circle cx={x} cy={y} r={23} strokeWidth={3} />
            </g>
          ))}

        {pointer && (
          <g style={{ color: "var(--accent)" }}>
            <path
              d={`M${POINTERS[pointer].x} ${POINTERS[pointer].base} L${POINTERS[pointer].x} ${POINTERS[pointer].tip}`}
            />
            <path
              d={`M${POINTERS[pointer].x - 14} ${POINTERS[pointer].tip + 20} L${POINTERS[pointer].x} ${POINTERS[pointer].tip} L${POINTERS[pointer].x + 14} ${POINTERS[pointer].tip + 20}`}
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
          NUMBERS.map(({ n, part, x, y }) => (
            <text
              key={n}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={n === 10 ? 22 : 26}
              style={partStyle(part)}
            >
              {n}
            </text>
          ))}
      </g>
    </svg>
  )
}
