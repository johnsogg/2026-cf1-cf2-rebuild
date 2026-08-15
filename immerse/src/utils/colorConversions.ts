/**
 * RGB <-> HSB (aka HSV) <-> HSL conversions used by CompFoundColorPicker.
 * All hue values are in degrees (0..360); saturation/brightness/lightness
 * and RGB channels are in 0..100 / 0..255 respectively — never 0..1 or
 * radians.
 */

export type ColorRGB = { r: number; g: number; b: number }
export type ColorHSB = { h: number; s: number; b: number }
export type ColorHSL = { h: number; s: number; l: number }

const round = (n: number) => Math.round(n)

function hueSegment(r: number, g: number, b: number, max: number, delta: number) {
  if (delta === 0) return 0
  let h: number
  if (max === r) h = 60 * (((g - b) / delta) % 6)
  else if (max === g) h = 60 * ((b - r) / delta + 2)
  else h = 60 * ((r - g) / delta + 4)
  return h < 0 ? h + 360 : h
}

export function rgbToHsb({ r, g, b }: ColorRGB): ColorHSB {
  const R = r / 255,
    G = g / 255,
    B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const delta = max - min
  return {
    h: hueSegment(R, G, B, max, delta),
    s: max === 0 ? 0 : (delta / max) * 100,
    b: max * 100,
  }
}

export function hsbToRgb({ h, s, b }: ColorHSB): ColorRGB {
  const S = s / 100
  const V = b / 100
  const C = V * S
  const hh = ((h % 360) + 360) % 360
  const X = C * (1 - Math.abs(((hh / 60) % 2) - 1))
  const m = V - C
  let r1 = 0,
    g1 = 0,
    b1 = 0
  if (hh < 60) [r1, g1, b1] = [C, X, 0]
  else if (hh < 120) [r1, g1, b1] = [X, C, 0]
  else if (hh < 180) [r1, g1, b1] = [0, C, X]
  else if (hh < 240) [r1, g1, b1] = [0, X, C]
  else if (hh < 300) [r1, g1, b1] = [X, 0, C]
  else [r1, g1, b1] = [C, 0, X]
  return { r: round((r1 + m) * 255), g: round((g1 + m) * 255), b: round((b1 + m) * 255) }
}

export function rgbToHsl({ r, g, b }: ColorRGB): ColorHSL {
  const R = r / 255,
    G = g / 255,
    B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const delta = max - min
  const l = (max + min) / 2
  return {
    h: hueSegment(R, G, B, max, delta),
    s: delta === 0 ? 0 : (delta / (1 - Math.abs(2 * l - 1))) * 100,
    l: l * 100,
  }
}

export function hslToRgb({ h, s, l }: ColorHSL): ColorRGB {
  const S = s / 100
  const L = l / 100
  const C = (1 - Math.abs(2 * L - 1)) * S
  const hh = ((h % 360) + 360) % 360
  const X = C * (1 - Math.abs(((hh / 60) % 2) - 1))
  const m = L - C / 2
  let r1 = 0,
    g1 = 0,
    b1 = 0
  if (hh < 60) [r1, g1, b1] = [C, X, 0]
  else if (hh < 120) [r1, g1, b1] = [X, C, 0]
  else if (hh < 180) [r1, g1, b1] = [0, C, X]
  else if (hh < 240) [r1, g1, b1] = [0, X, C]
  else if (hh < 300) [r1, g1, b1] = [X, 0, C]
  else [r1, g1, b1] = [C, 0, X]
  return { r: round((r1 + m) * 255), g: round((g1 + m) * 255), b: round((b1 + m) * 255) }
}

function hex2(n: number) {
  return n.toString(16).padStart(2, "0")
}

export function rgbToHex({ r, g, b }: ColorRGB): string {
  return `#${hex2(r)}${hex2(g)}${hex2(b)}`
}

export function hexToRgb(hex: string): ColorRGB {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

export function rgbToCss({ r, g, b }: ColorRGB): string {
  return `rgb(${round(r)} ${round(g)} ${round(b)})`
}

export function hslToCss({ h, s, l }: ColorHSL): string {
  return `hsl(${round(h)}deg ${round(s)}% ${round(l)}%)`
}
