import katex from "katex"
import type { ReactNode } from "react"
import s from "./GeometryPlayground.module.css"

/**
 * Small controls and readout pieces shared by the geometry playgrounds
 * (`PointPlayground`, `PointLinePlayground`, `LinePlayground`,
 * `CurvePlayground`), so their controls look and behave the same.
 */

export const fmt = (v: number, places = 2) => {
  if (!Number.isFinite(v)) return v > 0 ? "∞" : "−∞"
  // `+ 0` turns -0 into 0
  return String(Math.round(v * 10 ** places) / 10 ** places + 0).replace(
    "-",
    "−",
  )
}

export const fmtPoint = (p: { x: number; y: number }, places = 2) =>
  `(${fmt(p.x, places)}, ${fmt(p.y, places)})`

interface ToggleProps<T extends string> {
  label?: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}

export const Toggle = <T extends string>({
  label,
  value,
  options,
  onChange,
}: ToggleProps<T>) => (
  <span className={s.controlGroup}>
    {label && <span className={s.controlLabel}>{label}</span>}
    <span className={s.toggle} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          className={value === o.value ? s.active : undefined}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </span>
  </span>
)

export const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) => (
  <label className={s.checkbox}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    {label}
  </label>
)

export const Slider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: ReactNode
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) => (
  <label className={s.slider}>
    <span className={s.controlLabel}>{label}</span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
    <span className={s.sliderValue}>{fmt(value)}</span>
  </label>
)

export const Swatch = ({ color }: { color: string }) => (
  <span className={s.swatch} style={{ background: color }} />
)

/** A KaTeX-rendered equation (display style). */
export const Equation = ({ tex }: { tex: string }) => (
  <div
    className={s.equation}
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(tex, {
        displayMode: true,
        throwOnError: false,
      }),
    }}
  />
)

// numbers for KaTeX keep an ASCII minus
const texNum = (v: number) => fmt(v).replace("−", "-")

// squared term with parentheses around negatives, e.g. (-3)^2
const sq = (v: number) => (v < 0 ? `(${texNum(v)})^2` : `${texNum(v)}^2`)

/** The Pythagorean theorem with the live numbers filled in. */
export const Pythagoras = ({ dx, dy }: { dx: number; dy: number }) => {
  const sum = dx * dx + dy * dy
  return (
    <Equation
      tex={
        `d = \\sqrt{\\Delta x^2 + \\Delta y^2}` +
        ` = \\sqrt{${sq(dx)} + ${sq(dy)}}` +
        ` = \\sqrt{${texNum(sum)}}` +
        ` \\approx ${texNum(Math.sqrt(sum))}`
      }
    />
  )
}

/** Canvas plus side panel, laid out the same way in every playground. */
export const PlaygroundLayout = ({
  width,
  height,
  controls,
  canvas,
  side,
}: {
  width: number
  height: number
  controls?: ReactNode
  canvas: ReactNode
  side: ReactNode
}) => (
  <div className={s.wrapper}>
    {controls && <div className={s.controls}>{controls}</div>}
    <div className={s.main}>
      <div
        className={s.canvasWrapper}
        style={
          {
            "--gp-aspect-ratio": `${width} / ${height}`,
            "--gp-width": `${width}px`,
          } as React.CSSProperties
        }
      >
        {canvas}
      </div>
      <div className={s.side}>{side}</div>
    </div>
  </div>
)

export { s as styles }
