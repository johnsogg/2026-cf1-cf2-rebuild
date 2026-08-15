import { useEffect, useId, useState } from "react"
import {
  hexToRgb,
  hsbToRgb,
  hslToCss,
  hslToRgb,
  rgbToCss,
  rgbToHex,
  rgbToHsb,
  rgbToHsl,
} from "../utils/colorConversions"
import type { ColorHSB, ColorHSL, ColorRGB } from "../utils/colorConversions"
import { IconButton } from "./IconButton"
import { SvgIcon } from "./SvgIcon"
import s from "./CompFoundColorPicker.module.css"

/**
 * Usage (in a book `.mdx` section):
 *
 * ```mdx
 * import { CompFoundColorPicker } from "immerse/components/CompFoundColorPicker"
 *
 * <CompFoundColorPicker />
 * ```
 *
 * A hands-on color picker for teaching RGB/HSB/HSL representations. The
 * selected mode's triplet is the single source of truth: dragging one
 * slider only ever changes that slider's own field, so the other two stay
 * exactly where you left them — including through degenerate points like
 * pure black, where hue/saturation would otherwise be undefined. Switching
 * modes converts the current triplet once into the new mode's terms; the
 * swatch, history, and decimal/percentage/hex/CSS readouts are all derived
 * from that on every render, so they always agree with whichever triplet
 * is authoritative.
 */

type Mode = "rgb" | "hsb" | "hsl"

const MODES: { id: Mode; label: string }[] = [
  { id: "rgb", label: "RGB" },
  { id: "hsb", label: "HSB" },
  { id: "hsl", label: "HSL" },
]

const HISTORY_SIZE = 16
const HISTORY_DELAY_MS = 1000
const HISTORY_COPY_FEEDBACK_MS = 3000

const round = (n: number) => Math.round(n)

const HUE_GRADIENT = `linear-gradient(to right, ${[
  0, 60, 120, 180, 240, 300, 360,
]
  .map((h) => `hsl(${h}, 100%, 50%)`)
  .join(", ")})`

function gradient(colors: string[]) {
  return `linear-gradient(to right, ${colors.join(", ")})`
}

type SliderSpec = {
  key: string
  label: string
  value: number
  min: number
  max: number
  unit: string
  gradient: string
  onChange: (value: number) => void
}

type NativeColor =
  | { mode: "rgb"; value: ColorRGB }
  | { mode: "hsb"; value: ColorHSB }
  | { mode: "hsl"; value: ColorHSL }

function nativeToRgb(native: NativeColor): ColorRGB {
  if (native.mode === "rgb") return native.value
  if (native.mode === "hsb") return hsbToRgb(native.value)
  return hslToRgb(native.value)
}

function nativeFromRgb(mode: Mode, rgb: ColorRGB): NativeColor {
  if (mode === "rgb") return { mode, value: rgb }
  if (mode === "hsb") return { mode, value: rgbToHsb(rgb) }
  return { mode, value: rgbToHsl(rgb) }
}

function convertNative(native: NativeColor, mode: Mode): NativeColor {
  if (native.mode === mode) return native
  return nativeFromRgb(mode, nativeToRgb(native))
}

function slidersForMode(
  native: NativeColor,
  setNative: (native: NativeColor) => void,
): SliderSpec[] {
  if (native.mode === "rgb") {
    const { value: rgb } = native
    return [
      {
        key: "r",
        label: "Red",
        value: rgb.r,
        min: 0,
        max: 255,
        unit: "",
        gradient: gradient(["#000000", "#ff0000"]),
        onChange: (v) => setNative({ mode: "rgb", value: { ...rgb, r: v } }),
      },
      {
        key: "g",
        label: "Green",
        value: rgb.g,
        min: 0,
        max: 255,
        unit: "",
        gradient: gradient(["#000000", "#00ff00"]),
        onChange: (v) => setNative({ mode: "rgb", value: { ...rgb, g: v } }),
      },
      {
        key: "b",
        label: "Blue",
        value: rgb.b,
        min: 0,
        max: 255,
        unit: "",
        gradient: gradient(["#000000", "#0000ff"]),
        onChange: (v) => setNative({ mode: "rgb", value: { ...rgb, b: v } }),
      },
    ]
  }

  if (native.mode === "hsb") {
    const { value: hsb } = native
    return [
      {
        key: "h",
        label: "Hue",
        value: round(hsb.h),
        min: 0,
        max: 360,
        unit: "°",
        gradient: HUE_GRADIENT,
        onChange: (v) => setNative({ mode: "hsb", value: { ...hsb, h: v } }),
      },
      {
        key: "s",
        label: "Saturation",
        value: round(hsb.s),
        min: 0,
        max: 100,
        unit: "%",
        gradient: gradient([
          rgbToCss(hsbToRgb({ ...hsb, s: 0 })),
          rgbToCss(hsbToRgb({ ...hsb, s: 100 })),
        ]),
        onChange: (v) => setNative({ mode: "hsb", value: { ...hsb, s: v } }),
      },
      {
        key: "b",
        label: "Brightness",
        value: round(hsb.b),
        min: 0,
        max: 100,
        unit: "%",
        gradient: gradient(["#000000", rgbToCss(hsbToRgb({ ...hsb, b: 100 }))]),
        onChange: (v) => setNative({ mode: "hsb", value: { ...hsb, b: v } }),
      },
    ]
  }

  const { value: hsl } = native
  return [
    {
      key: "h",
      label: "Hue",
      value: round(hsl.h),
      min: 0,
      max: 360,
      unit: "°",
      gradient: HUE_GRADIENT,
      onChange: (v) => setNative({ mode: "hsl", value: { ...hsl, h: v } }),
    },
    {
      key: "s",
      label: "Saturation",
      value: round(hsl.s),
      min: 0,
      max: 100,
      unit: "%",
      gradient: gradient([
        rgbToCss(hslToRgb({ ...hsl, s: 0 })),
        rgbToCss(hslToRgb({ ...hsl, s: 100 })),
      ]),
      onChange: (v) => setNative({ mode: "hsl", value: { ...hsl, s: v } }),
    },
    {
      key: "l",
      label: "Lightness",
      value: round(hsl.l),
      min: 0,
      max: 100,
      unit: "%",
      gradient: gradient([
        "#000000",
        rgbToCss(hslToRgb({ ...hsl, l: 50 })),
        "#ffffff",
      ]),
      onChange: (v) => setNative({ mode: "hsl", value: { ...hsl, l: v } }),
    },
  ]
}

const ComponentSlider = ({
  spec,
  groupId,
}: {
  spec: SliderSpec
  groupId: string
}) => {
  return (
    <div className={s.sliderRow}>
      <label className={s.sliderLabel} htmlFor={`${groupId}-${spec.key}`}>
        {spec.label}
      </label>
      <input
        id={`${groupId}-${spec.key}`}
        className={s.slider}
        style={{ background: spec.gradient }}
        type="range"
        min={spec.min}
        max={spec.max}
        value={spec.value}
        onChange={(e) => spec.onChange(Number(e.target.value))}
      />
      <EditableValue
        value={spec.value}
        unit={spec.unit}
        min={spec.min}
        max={spec.max}
        onChange={spec.onChange}
      />
    </div>
  )
}

const EditableValue = ({
  value,
  unit,
  min,
  max,
  onChange,
}: {
  value: number
  unit: string
  min: number
  max: number
  onChange: (value: number) => void
}) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))

  const startEditing = () => {
    setDraft(String(value))
    setEditing(true)
  }

  const commit = () => {
    const parsed = Number(draft)
    if (Number.isFinite(parsed)) {
      onChange(Math.min(max, Math.max(min, Math.round(parsed))))
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        className={s.sliderValueInput}
        type="number"
        min={min}
        max={max}
        value={draft}
        autoFocus
        onFocus={(e) => e.target.select()}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit()
          if (e.key === "Escape") setEditing(false)
        }}
      />
    )
  }

  return (
    <button type="button" className={s.sliderValue} onClick={startEditing}>
      {value}
      {unit}
    </button>
  )
}

const NumberRow = ({
  label,
  children,
  copyText,
  rowId,
  copiedRow,
  onCopy,
}: {
  label: string
  children: React.ReactNode
  copyText: string
  rowId: string
  copiedRow: string | null
  onCopy: (rowId: string, text: string) => void
}) => {
  const copied = copiedRow === rowId
  return (
    <div className={s.numberRow}>
      <IconButton
        onClick={() => onCopy(rowId, copyText)}
        aria-label={`Copy ${label.toLowerCase()} color value`}
        title={copyText}
      >
        <SvgIcon
          name={copied ? "check" : "copy"}
          size={16}
          intent={copied ? "success" : "muted"}
        />
      </IconButton>
      <span className={s.numberLabel}>{label}</span>
      <span className={s.numberValue}>{children}</span>
    </div>
  )
}

function normalizeHex(input: string): string | null {
  const cleaned = input.trim().replace(/^#/, "")
  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return `#${cleaned
      .split("")
      .map((c) => c + c)
      .join("")}`.toLowerCase()
  }
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return `#${cleaned}`.toLowerCase()
  }
  return null
}

const EditableHex = ({
  value,
  onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const startEditing = () => {
    setDraft(value)
    setEditing(true)
  }

  const commit = () => {
    const normalized = normalizeHex(draft)
    if (normalized) onChange(normalized)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        className={s.hexInput}
        type="text"
        value={draft}
        autoFocus
        onFocus={(e) => e.target.select()}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit()
          if (e.key === "Escape") setEditing(false)
        }}
      />
    )
  }

  return (
    <button type="button" className={s.hexValue} onClick={startEditing}>
      #<span className={s.channelR}>{value.slice(1, 3)}</span>
      <span className={s.channelG}>{value.slice(3, 5)}</span>
      <span className={s.channelB}>{value.slice(5, 7)}</span>
    </button>
  )
}

export interface CompFoundColorPickerProps {
  value?: string
}

export const CompFoundColorPicker = ({
  value,
}: CompFoundColorPickerProps = {}) => {
  const groupId = useId()
  const [native, setNative] = useState<NativeColor>(() => ({
    mode: "rgb",
    value: value ? hexToRgb(value) : { r: 59, g: 130, b: 246 },
  }))
  const [history, setHistory] = useState<string[]>([])
  const [copiedRow, setCopiedRow] = useState<string | null>(null)
  const [copiedHistoryIndex, setCopiedHistoryIndex] = useState<number | null>(
    null,
  )

  const rgb = nativeToRgb(native)
  const hex = rgbToHex(rgb)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHistory((prev) =>
        prev.includes(hex) ? prev : [hex, ...prev].slice(0, HISTORY_SIZE),
      )
    }, HISTORY_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [hex])

  const handleCopy = (rowId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedRow(rowId)
    window.setTimeout(
      () => setCopiedRow((prev) => (prev === rowId ? null : prev)),
      1200,
    )
  }

  const setAbsoluteRgb = (nextRgb: ColorRGB) => {
    setNative(nativeFromRgb(native.mode, nextRgb))
  }

  const handleHistoryClick = (i: number, color: string) => {
    setAbsoluteRgb(hexToRgb(color))
    navigator.clipboard.writeText(color)
    setCopiedHistoryIndex(i)
    window.setTimeout(
      () => setCopiedHistoryIndex((prev) => (prev === i ? null : prev)),
      HISTORY_COPY_FEEDBACK_MS,
    )
  }

  const sliders = slidersForMode(native, setNative)
  const percent = {
    r: round((rgb.r / 255) * 100),
    g: round((rgb.g / 255) * 100),
    b: round((rgb.b / 255) * 100),
  }
  const cssValue =
    native.mode === "rgb" ? rgbToCss(rgb) : hslToCss(rgbToHsl(rgb))
  const historySlots = Array.from(
    { length: HISTORY_SIZE },
    (_, i) => history[i] ?? null,
  )

  return (
    <div className={s.picker}>
      <div className={s.modeRow}>
        <span className={s.modeLabel}>Color Mode:</span>
        {MODES.map((m) => (
          <label key={m.id} className={s.modeOption}>
            <input
              type="radio"
              name={`${groupId}-mode`}
              checked={native.mode === m.id}
              onChange={() => setNative(convertNative(native, m.id))}
            />
            {m.label}
          </label>
        ))}
      </div>

      <div className={s.mainRow}>
        <div className={s.sliders}>
          {sliders.map((spec) => (
            <ComponentSlider key={spec.key} spec={spec} groupId={groupId} />
          ))}
        </div>

        <div className={s.swatchCol}>
          <div className={s.swatch} style={{ background: hex }} />
          <span className={s.colTitle}>color</span>
        </div>

        <div className={s.historyCol}>
          <div className={s.historyGrid}>
            {historySlots.map((color, i) => (
              <button
                key={i}
                type="button"
                className={
                  color
                    ? s.historyCell
                    : `${s.historyCell} ${s.historyCellEmpty}`
                }
                style={color ? { background: color } : undefined}
                onClick={color ? () => handleHistoryClick(i, color) : undefined}
                disabled={!color}
                aria-label={
                  color ? `Use and copy color ${color}` : "Empty history slot"
                }
              >
                {copiedHistoryIndex === i && (
                  <span className={s.historyCheckBadge}>
                    <SvgIcon name="check" size={12} intent="success" />
                  </span>
                )}
              </button>
            ))}
          </div>
          <span className={s.colTitle}>
            {copiedHistoryIndex !== null ? "copied hex" : "history"}
          </span>
        </div>
      </div>

      <div className={s.numbers}>
        <NumberRow
          label="Decimal"
          rowId="decimal"
          copiedRow={copiedRow}
          onCopy={handleCopy}
          copyText={`colorMode(RGB, 255)\ncolor(${rgb.r}, ${rgb.g}, ${rgb.b})`}
        >
          (<span className={s.channelR}>{rgb.r}</span>,{" "}
          <span className={s.channelG}>{rgb.g}</span>,{" "}
          <span className={s.channelB}>{rgb.b}</span>)
        </NumberRow>

        <NumberRow
          label="Percentage"
          rowId="percentage"
          copiedRow={copiedRow}
          onCopy={handleCopy}
          copyText={`colorMode(RGB, 100)\ncolor(${percent.r}, ${percent.g}, ${percent.b})`}
        >
          (<span className={s.channelR}>{percent.r}%</span>,{" "}
          <span className={s.channelG}>{percent.g}%</span>,{" "}
          <span className={s.channelB}>{percent.b}%</span>)
        </NumberRow>

        <NumberRow
          label="Hexadecimal"
          rowId="hex"
          copiedRow={copiedRow}
          onCopy={handleCopy}
          copyText={`color("${hex}")`}
        >
          <EditableHex
            value={hex}
            onChange={(newHex) => setAbsoluteRgb(hexToRgb(newHex))}
          />
        </NumberRow>

        <NumberRow
          label="CSS"
          rowId="css"
          copiedRow={copiedRow}
          onCopy={handleCopy}
          copyText={cssValue}
        >
          {cssValue}
        </NumberRow>
      </div>
    </div>
  )
}
