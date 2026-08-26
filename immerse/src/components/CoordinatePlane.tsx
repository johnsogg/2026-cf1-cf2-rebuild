import { useLayoutEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import { useTheme } from "../hooks/useTheme"
import s from "./CoordinatePlane.module.css"

/**
 * Usage (in a book `.mdx` section):
 *
 * ```mdx
 * import { CoordinatePlane } from "immerse/components/CoordinatePlane"
 *
 * <CoordinatePlane />
 * <CoordinatePlane variant="screen" />
 * ```
 *
 * Draws to a canvas using the same theme-color approach as `CodeAnatomy`
 * (resolve `--bg`/`--text`/etc. from computed style rather than hardcoding
 * colors), and repaints only when hover state or theme actually changes -
 * no draw loop.
 *
 * Two variants sharing the same axis-drawing code:
 * - `"math"` (default): origin centered, y grows upward - the graphing-class
 *   convention. Hovering a quadrant names its signs and highlights it.
 * - `"screen"`: origin at the top-left, y grows downward - the pixel/canvas
 *   convention p5.js (and most graphics APIs) actually use. Hovering shows
 *   a live `(x, y)` readout with dashed guide lines back to each axis,
 *   since there's only one quadrant to name.
 */
export interface CoordinatePlaneProps {
  width?: number
  height?: number
  variant?: "math" | "screen"
}

type Quadrant = 1 | 2 | 3 | 4
const QUADRANTS: Quadrant[] = [1, 2, 3, 4]

const QUADRANT_LABELS: Record<Quadrant, [string, string]> = {
  1: ["positive X,", "positive Y"],
  2: ["negative X,", "positive Y"],
  3: ["negative X,", "negative Y"],
  4: ["positive X,", "negative Y"],
}

// Backing-store multiplier so the canvas is crisp regardless of screen pixel ratio.
const CANVAS_SCALE = 2
const AXIS_MARGIN = 24
const AXIS_LABEL_FONT = 22
const QUADRANT_LABEL_FONT = 19
const QUADRANT_LINE_HEIGHT = 24
const READOUT_FONT = 18
const ARROWHEAD_LENGTH = 10

function quadrantAt(x: number, y: number, cx: number, cy: number): Quadrant {
  if (x >= cx) return y <= cy ? 1 : 4
  return y <= cy ? 2 : 3
}

function drawAxisArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
) {
  const angle = Math.atan2(toY - fromY, toX - fromX)
  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(toX, toY)
  ctx.lineTo(
    toX - ARROWHEAD_LENGTH * Math.cos(angle - Math.PI / 6),
    toY - ARROWHEAD_LENGTH * Math.sin(angle - Math.PI / 6),
  )
  ctx.lineTo(
    toX - ARROWHEAD_LENGTH * Math.cos(angle + Math.PI / 6),
    toY - ARROWHEAD_LENGTH * Math.sin(angle + Math.PI / 6),
  )
  ctx.closePath()
  ctx.fill()
}

export const CoordinatePlane: React.FC<CoordinatePlaneProps> = ({
  width = 480,
  height = 340,
  variant = "math",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [theme] = useTheme()
  const [hoveredQuadrant, setHoveredQuadrant] = useState<Quadrant | null>(
    null,
  )
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width * CANVAS_SCALE
    canvas.height = height * CANVAS_SCALE
    ctx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const rootStyle = getComputedStyle(document.documentElement)
    const cssVar = (name: string) => rootStyle.getPropertyValue(name).trim()
    const bg = cssVar("--bg")
    const text = cssVar("--text")
    const textMuted = cssVar("--text-muted")
    const accent = cssVar("--accent")
    const accentSubtle = cssVar("--accent-subtle")

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    if (variant === "math") {
      const cx = width / 2
      const cy = height / 2

      if (hoveredQuadrant) {
        ctx.fillStyle = accentSubtle
        const rectX = hoveredQuadrant === 2 || hoveredQuadrant === 3 ? 0 : cx
        const rectY = hoveredQuadrant === 1 || hoveredQuadrant === 2 ? 0 : cy
        ctx.fillRect(rectX, rectY, cx, cy)
      }

      ctx.strokeStyle = text
      ctx.fillStyle = text
      ctx.lineWidth = 2
      drawAxisArrow(ctx, AXIS_MARGIN, cy, width - AXIS_MARGIN, cy)
      drawAxisArrow(ctx, cx, height - AXIS_MARGIN, cx, AXIS_MARGIN)

      ctx.font = `600 ${AXIS_LABEL_FONT}px "Public Sans", system-ui, sans-serif`
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText("x", width - AXIS_MARGIN + 8, cy)
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"
      ctx.fillText("y", cx, AXIS_MARGIN - 8)

      ctx.font = `400 ${QUADRANT_LABEL_FONT}px "Public Sans", system-ui, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      QUADRANTS.forEach((q) => {
        ctx.fillStyle = hoveredQuadrant === q ? accent : textMuted
        const lx = q === 2 || q === 3 ? cx / 2 : cx + cx / 2
        const ly = q === 1 || q === 2 ? cy / 2 : cy + cy / 2
        const [line1, line2] = QUADRANT_LABELS[q]
        ctx.fillText(line1, lx, ly - QUADRANT_LINE_HEIGHT / 2)
        ctx.fillText(line2, lx, ly + QUADRANT_LINE_HEIGHT / 2)
      })
    } else {
      const ox = AXIS_MARGIN
      const oy = AXIS_MARGIN

      if (cursor) {
        ctx.setLineDash([4, 4])
        ctx.strokeStyle = accentSubtle
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(ox, cursor.y)
        ctx.lineTo(cursor.x, cursor.y)
        ctx.moveTo(cursor.x, oy)
        ctx.lineTo(cursor.x, cursor.y)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = accent
        ctx.beginPath()
        ctx.arc(cursor.x, cursor.y, 4, 0, Math.PI * 2)
        ctx.fill()

        const nearRightEdge = cursor.x > width - 110
        const nearTopEdge = cursor.y < AXIS_MARGIN + 20
        ctx.font = `600 ${READOUT_FONT}px "Public Sans", system-ui, sans-serif`
        ctx.textAlign = nearRightEdge ? "right" : "left"
        ctx.textBaseline = nearTopEdge ? "top" : "bottom"
        ctx.fillText(
          `(${Math.round(cursor.x - ox)}, ${Math.round(cursor.y - oy)})`,
          cursor.x + (nearRightEdge ? -10 : 10),
          cursor.y + (nearTopEdge ? 10 : -10),
        )
      }

      ctx.strokeStyle = text
      ctx.fillStyle = text
      ctx.lineWidth = 2
      drawAxisArrow(ctx, ox, oy, width - AXIS_MARGIN, oy)
      drawAxisArrow(ctx, ox, oy, ox, height - AXIS_MARGIN)

      ctx.beginPath()
      ctx.arc(ox, oy, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.font = `600 ${AXIS_LABEL_FONT}px "Public Sans", system-ui, sans-serif`
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText("x", width - AXIS_MARGIN + 8, oy)
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText("y", ox + 8, height - AXIS_MARGIN)

      ctx.font = `400 ${QUADRANT_LABEL_FONT}px "Public Sans", system-ui, sans-serif`
      ctx.fillStyle = textMuted
      ctx.textAlign = "left"
      ctx.textBaseline = "top"
      ctx.fillText("(0, 0)", ox + 10, oy + 10)
    }
  }, [width, height, variant, hoveredQuadrant, cursor, theme])

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * width
    const y = ((e.clientY - rect.top) / rect.height) * height
    if (variant === "math") {
      const next = quadrantAt(x, y, width / 2, height / 2)
      setHoveredQuadrant((prev) => (prev === next ? prev : next))
    } else {
      setCursor((prev) =>
        prev && prev.x === x && prev.y === y ? prev : { x, y },
      )
    }
  }

  const handleMouseLeave = () => {
    setHoveredQuadrant(null)
    setCursor(null)
  }

  return (
    <div className={s.wrapper} style={{ maxWidth: width }}>
      <canvas
        ref={canvasRef}
        className={s.canvas}
        style={{ aspectRatio: `${width} / ${height}` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  )
}
