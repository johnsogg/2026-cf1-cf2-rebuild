import { useId } from "react"
import { useSlideStep } from "./Slide"

// The straw-man job search (resume, interview, job) as the bottom of a layer
// cake. Each key press slides in one more layer above it: the unseen social
// work that comes first. Read top to bottom, it's the real order of events.
const LAYERS = [
  { text: "Many people know your great work", hidden: true },
  { text: "Build a portfolio worth opening", hidden: true },
  { text: "Find who's hiring, get the intro", hidden: true },
  { text: "Send your resume", hidden: false },
  { text: "Get an interview", hidden: false },
  { text: "Get the job", hidden: false },
] as const

const LAYER_W = 960
const LAYER_H = 70
const PITCH = 82
const X0 = 20
const Y0 = 10
const HIDDEN_COUNT = 3
const TOTAL_ROWS = 6

export interface JobPathProps {
  /**
   * Show only the straw man (resume, interview, job), one layer per key press,
   * in the same spots they occupy at the start of the full build.
   */
  strawMan?: boolean
}

export const JobPath = ({ strawMan = false }: JobPathProps) => {
  const press = useSlideStep(HIDDEN_COUNT)
  // Layout follows the full build's first state when only the straw man shows.
  const step = strawMan ? 0 : press
  const filterId = "wobble" + useId().replace(/:/g, "")

  // Hidden layers arrive top-first, one per step; straw-man layers are always
  // there. Before the first step, a dashed placeholder holds the top row.
  const visible = (i: number) =>
    strawMan
      ? i >= HIDDEN_COUNT && i - HIDDEN_COUNT < press
      : i >= HIDDEN_COUNT || i < step
  const rows = Math.max(step, 1) + HIDDEN_COUNT
  // Each layer's row in the current stack, centered vertically.
  const layerY = (i: number) => {
    const row = i < HIDDEN_COUNT ? i : Math.max(step, 1) + (i - HIDDEN_COUNT)
    return Y0 + (row + (TOTAL_ROWS - rows) / 2) * PITCH
  }
  const slide = (i: number) => ({
    transform: `translateY(${layerY(i)}px)`,
    transition: "transform 0.5s ease, opacity 0.4s ease",
    opacity: visible(i) ? 1 : 0,
  })

  return (
    <svg
      viewBox="0 0 1000 500"
      role="img"
      aria-label="The real path to a job, top to bottom: many people know your great work, build a portfolio worth opening, find who is hiring and get the intro, send your resume, get an interview, get the job"
      style={{ width: "100%", height: "auto" }}
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
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={4} />
        </filter>
      </defs>
      <g>
        {/* The sketchy layer: only lines are wobbled. */}
        <g filter={`url(#${filterId})`}>
          {/* A dashed placeholder where the first new layer will land. */}
          <rect
            x={X0}
            y={0}
            width={LAYER_W}
            height={LAYER_H}
            rx={16}
            strokeDasharray="4 14"
            style={{
              color: "var(--text-muted)",
              transform: `translateY(${layerY(0)}px)`,
              opacity: !strawMan && step === 0 ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
          {LAYERS.map((l, i) => (
            <rect
              key={i}
              x={X0}
              y={0}
              width={LAYER_W}
              height={LAYER_H}
              rx={16}
              style={{
                ...slide(i),
                color: l.hidden ? "var(--accent)" : "var(--text)",
                fill: "color-mix(in srgb, currentColor 10%, transparent)",
              }}
            />
          ))}
        </g>

        {/* The text layer: ordinary, unwobbled type. */}
        <g
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
          fontSize={34}
          style={{ color: "var(--text)" }}
        >
          {LAYERS.map((l, i) => (
            <text
              key={i}
              x={X0 + LAYER_W / 2}
              y={LAYER_H / 2 + 12}
              style={slide(i)}
            >
              {l.text}
            </text>
          ))}
        </g>
      </g>
    </svg>
  )
}
