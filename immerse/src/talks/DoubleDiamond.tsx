import { useId } from "react"
import { useSlideStep } from "./Slide"

type Part = 1 | 2
type Emphasis = Part | "all"

export interface DoubleDiamondProps {
  /**
   * Which diamond to emphasize (the other is grayed out). 1 = the right design
   * (discover, define), 2 = the design right (develop, deliver). Give an array
   * to step through states, one per key press.
   */
  emphasize?: Emphasis | Emphasis[]
  /** Discover / Define / Develop / Deliver inside the diamonds. */
  phases?: boolean
  /** "the right design" / "the design right" under each diamond. */
  captions?: boolean
}

const PHASES = [
  { text: "Discover", x: 150, part: 1 },
  { text: "Define", x: 380, part: 1 },
  { text: "Develop", x: 620, part: 2 },
  { text: "Deliver", x: 850, part: 2 },
] as const

// Two diamonds sharing a vertex: wide, then narrow, twice.
const DIAMOND_1 = "M30 175 L265 35 L500 175 L265 315 Z"
const DIAMOND_2 = "M500 175 L735 35 L970 175 L735 315 Z"

export const DoubleDiamond = ({
  emphasize = "all",
  phases = true,
  captions = true,
}: DoubleDiamondProps) => {
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
      viewBox="0 0 1000 410"
      role="img"
      aria-label="The double diamond: discover and define, then develop and deliver"
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
            seed={8}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={5} />
        </filter>
      </defs>
      {/* The sketchy layer: only lines are wobbled. */}
      <g filter={`url(#${filterId})`}>
        {([1, 2] as const).map((part) => (
          <path
            key={part}
            d={part === 1 ? DIAMOND_1 : DIAMOND_2}
            style={{
              ...partStyle(part),
              fill: "color-mix(in srgb, currentColor 8%, transparent)",
            }}
          />
        ))}
      </g>

      {/* The text layer: ordinary, unwobbled type. */}
      <g fill="currentColor" stroke="none" textAnchor="middle">
        {phases &&
          PHASES.map(({ text, x, part }) => (
            <text
              key={text}
              x={x}
              y={185}
              fontSize={30}
              style={{ ...partStyle(part), color: "var(--text)" }}
            >
              {text}
            </text>
          ))}
        {captions &&
          ([1, 2] as const).map((part) => (
            <text
              key={part}
              x={part === 1 ? 265 : 735}
              y={382}
              fontSize={36}
              fontWeight={600}
              style={partStyle(part)}
            >
              {part === 1 ? "the right design" : "the design right"}
            </text>
          ))}
      </g>
    </svg>
  )
}
