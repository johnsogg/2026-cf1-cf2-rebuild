import s from "./Swatch.module.css"

export type SwatchSize = "small" | "medium" | "large"

const sizeClass: Record<SwatchSize, string> = {
  small: s.small,
  medium: s.medium,
  large: s.large,
}

/**
 * Renders a small colored square for a hex/named color value, e.g.
 * `<Swatch value="#000000" />`. `size` matches the p5 exercise codefence's
 * size values ("small" | "medium" | "large"), default "medium". Globally
 * available in book `.mdx` sections, no import needed.
 */
export interface SwatchProps {
  value: string
  size?: SwatchSize
}

export function Swatch({ value, size = "medium" }: SwatchProps) {
  return (
    <span
      className={`${s.swatch} ${sizeClass[size]}`}
      style={{ background: value }}
    />
  )
}
