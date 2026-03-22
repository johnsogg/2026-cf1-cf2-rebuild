import type { Color } from "p5"

export const colorWithAlpha = (c: Color, a: number) => {
  return color(red(c), green(c), blue(c), a)
}

// support interpolating along a multi-color gradient
export const multiLerpColors = (colors: Array<Color>, p: number) => {
  const segments = colors.length - 1
  const scaled = p * segments
  const i = constrain(floor(scaled), 0, segments - 1)
  const t = scaled - i
  return lerpColor(colors[i], colors[i + 1], t)
}
