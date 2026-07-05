import { useLayoutEffect, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import hljs from "highlight.js"
import { useTheme } from "../hooks/useTheme"
import { IconButton } from "./IconButton"
import { SvgIcon } from "./SvgIcon"
import s from "./CodeAnatomy.module.css"

/**
 * Usage (in a book `.mdx` section):
 *
 * ```mdx
 * import { CodeAnatomy } from "immerse/components/CodeAnatomy"
 *
 * <CodeAnatomy
 *   code={{ value: "foo = 'hello'", pos: { x: 218, y: 270 }, fontSize: 48 }}
 *   width={800}
 *   height={380}
 *   progressive
 *   labels={[
 *     {
 *       name: "Equals sign",
 *       text: "Special character indicating we are assigning a value into a variable.",
 *       pos: { x: 290, y: 10 },
 *       target: { x: 344, y: 270 },
 *       maxWidth: 230,
 *     },
 *   ]}
 * />
 * ```
 *
 * `code.pos`, `label.pos`, and `label.target` are all manual pixel
 * coordinates on the canvas (`width` x `height`) - there is no parsing of
 * `code.value` to find character positions. Estimate them, render, and
 * nudge based on what you see (a pasted screenshot of the rendered page is
 * the fastest way to iterate). A common layout: labels in a row above the
 * code line, each `target` pointing down into the token it describes.
 * `target` may also be an array of points (e.g. both parens of a pair, or
 * both curly braces) to fan out multiple arrows from one label.
 *
 * Order `labels` in the sequence they should be explained - with
 * `progressive` on, that's also the reveal order (plus a final "all
 * revealed" stage).
 */
export interface CodeAnatomyPoint {
  x: number
  y: number
}

export interface CodeAnatomyLabel {
  /** Bold title line, e.g. "keyword" */
  name: string
  /** Muted description below the name; wraps at maxWidth */
  text: string
  /** Corner of the label block that align hangs off of */
  pos: CodeAnatomyPoint
  /**
   * Point(s) on the canvas the arrow points to, e.g. a spot inside the code.
   * Pass an array (e.g. for a pair of parentheses or curly braces) to draw
   * one arrow per point, all from the same label box.
   */
  target: CodeAnatomyPoint | CodeAnatomyPoint[]
  /** Which side of `pos` the text block grows from. Default "left". */
  align?: "left" | "right"
  /** Max width in px before text wraps. Default 240. */
  maxWidth?: number
}

export interface CodeAnatomyProps {
  code: {
    value: string
    pos: CodeAnatomyPoint
    language?: string
    fontSize?: number
  }
  labels: CodeAnatomyLabel[]
  width: number
  height: number
  /**
   * Reveal labels one at a time with forward/back navigation instead of
   * showing them all at once. Off by default.
   */
  progressive?: boolean
}

type Rect = { x: number; y: number; width: number; height: number }

// Gap between a label's box and where its arrow line starts, so the line
// doesn't run through the label's own text.
const ARROW_GAP = 8
const ARROWHEAD_LENGTH = 10
const NAME_FONT_SIZE = 24
const TEXT_FONT_SIZE = 24
const LINE_HEIGHT = 30

// Backing-store multiplier so a right-click "Save Image As" produces a crisp
// PNG regardless of the viewer's screen pixel ratio.
const CANVAS_SCALE = 2

// Mirrors the .hljs-* -> --hljs-* color mapping in themes.css, so code tokens
// drawn on canvas match the same theme colors used in regular code blocks.
const TOKEN_COLOR_VAR: Record<string, string> = {
  "hljs-doctag": "--hljs-keyword",
  "hljs-keyword": "--hljs-keyword",
  "hljs-template-tag": "--hljs-keyword",
  "hljs-template-variable": "--hljs-keyword",
  "hljs-type": "--hljs-keyword",
  "hljs-title": "--hljs-title",
  "hljs-attr": "--hljs-constant",
  "hljs-attribute": "--hljs-constant",
  "hljs-literal": "--hljs-constant",
  "hljs-meta": "--hljs-constant",
  "hljs-number": "--hljs-constant",
  "hljs-operator": "--hljs-constant",
  "hljs-selector-attr": "--hljs-constant",
  "hljs-selector-class": "--hljs-constant",
  "hljs-selector-id": "--hljs-constant",
  "hljs-variable": "--hljs-constant",
  "hljs-regexp": "--hljs-string",
  "hljs-string": "--hljs-string",
  "hljs-built_in": "--hljs-builtin",
  "hljs-symbol": "--hljs-builtin",
  "hljs-code": "--hljs-comment",
  "hljs-comment": "--hljs-comment",
  "hljs-formula": "--hljs-comment",
  "hljs-name": "--hljs-tag",
  "hljs-quote": "--hljs-tag",
  "hljs-selector-pseudo": "--hljs-tag",
  "hljs-selector-tag": "--hljs-tag",
  "hljs-subst": "--hljs-subst",
}

type CodeRun = { text: string; className: string | null }

/** Flattens highlight.js's nested <span class="hljs-..."> output into text runs. */
function tokenizeHighlighted(html: string): CodeRun[] {
  const container = document.createElement("div")
  container.innerHTML = html
  const runs: CodeRun[] = []

  const walk = (node: ChildNode, currentClass: string | null) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? ""
      if (text) runs.push({ text, className: currentClass })
      return
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      const match = Array.from(el.classList).find((c) => c in TOKEN_COLOR_VAR)
      const cls = match ?? currentClass
      el.childNodes.forEach((child) => walk(child, cls))
    }
  }
  container.childNodes.forEach((n) => walk(n, null))
  return runs
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Point on the rect's perimeter facing `target`, offset outward by `gap`. */
function anchorTowards(
  rect: Rect,
  target: CodeAnatomyPoint,
  gap: number,
): CodeAnatomyPoint {
  const cx = rect.x + rect.width / 2
  const cy = rect.y + rect.height / 2
  const dx = target.x - cx
  const dy = target.y - cy

  const halfW = rect.width / 2
  const halfH = rect.height / 2
  const scaleX = halfW === 0 ? Infinity : Math.abs(dx) / halfW
  const scaleY = halfH === 0 ? Infinity : Math.abs(dy) / halfH

  if (scaleY >= scaleX) {
    const y = dy >= 0 ? rect.y + rect.height + gap : rect.y - gap
    const x = clamp(target.x, rect.x, rect.x + rect.width)
    return { x, y }
  }
  const x = dx >= 0 ? rect.x + rect.width + gap : rect.x - gap
  const y = clamp(target.y, rect.y, rect.y + rect.height)
  return { x, y }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word
    if (current && ctx.measureText(attempt).width > maxWidth) {
      lines.push(current)
      current = word
    } else {
      current = attempt
    }
  }
  if (current) lines.push(current)
  return lines
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: CodeAnatomyPoint,
  to: CodeAnatomyPoint,
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x)
  const lineEndX = to.x - ARROWHEAD_LENGTH * 0.6 * Math.cos(angle)
  const lineEndY = to.y - ARROWHEAD_LENGTH * 0.6 * Math.sin(angle)

  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(lineEndX, lineEndY)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(to.x, to.y)
  ctx.lineTo(
    to.x - ARROWHEAD_LENGTH * Math.cos(angle - Math.PI / 6),
    to.y - ARROWHEAD_LENGTH * Math.sin(angle - Math.PI / 6),
  )
  ctx.lineTo(
    to.x - ARROWHEAD_LENGTH * Math.cos(angle + Math.PI / 6),
    to.y - ARROWHEAD_LENGTH * Math.sin(angle + Math.PI / 6),
  )
  ctx.closePath()
  ctx.fill()
}

export const CodeAnatomy: React.FC<CodeAnatomyProps> = ({
  code,
  labels,
  width,
  height,
  progressive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [theme] = useTheme()
  const [step, setStep] = useState(0)

  // Steps are 0..labels.length-1 (revealing one label at a time), plus one
  // extra final "All" stage (index === labels.length) that shows everything
  // in full color with no dimming. Clamp defensively rather than resetting
  // on every `labels` identity change, since inline array/object literals in
  // JSX are a new reference on every parent render.
  const lastStep = labels.length
  const clampedStep = progressive ? clamp(step, 0, lastStep) : lastStep
  const isAllStage = clampedStep === lastStep
  const visibleLabels =
    progressive && !isAllStage ? labels.slice(0, clampedStep + 1) : labels

  // Forward/back cycle: stepping past the last ("All") stage wraps to the
  // first, and back at the first wraps to the last.
  const totalSteps = lastStep + 1
  const goBack = () => setStep((s) => (s - 1 + totalSteps) % totalSteps)
  const goForward = () => setStep((s) => (s + 1) % totalSteps)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault()
      goForward()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      goBack()
    }
  }

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width * CANVAS_SCALE
    canvas.height = height * CANVAS_SCALE
    ctx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0)
    ctx.clearRect(0, 0, width, height)

    // Resolve CSS custom properties to literal colors so the canvas (and any
    // PNG saved from it) doesn't depend on this page's stylesheet.
    const rootStyle = getComputedStyle(document.documentElement)
    const cssVar = (name: string) => rootStyle.getPropertyValue(name).trim()
    const bg = cssVar("--bg")
    const hljsFg = cssVar("--hljs-fg")
    const accent = cssVar("--accent")
    const textMuted = cssVar("--text-muted")

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    // ── code ──────────────────────────────────────────────────────────────
    const language = code.language ?? "javascript"
    const fontSize = code.fontSize ?? 44
    ctx.font = `${fontSize}px "Fira Mono", ui-monospace, Menlo, monospace`
    ctx.textAlign = "left"
    ctx.textBaseline = "alphabetic"
    const ascent =
      ctx.measureText("M").actualBoundingBoxAscent || fontSize * 0.8
    const baselineY = code.pos.y + ascent

    let cursorX = code.pos.x
    for (const run of tokenizeHighlighted(
      hljs.highlight(code.value, { language }).value,
    )) {
      const varName = run.className ? TOKEN_COLOR_VAR[run.className] : null
      ctx.fillStyle = varName ? cssVar(varName) : hljsFg
      ctx.fillText(run.text, cursorX, baselineY)
      cursorX += ctx.measureText(run.text).width
    }

    // ── labels ────────────────────────────────────────────────────────────
    const labelBoxes: Rect[] = visibleLabels.map((label) => {
      const align = label.align ?? "left"
      const maxWidth = label.maxWidth ?? 240

      ctx.font = `600 ${NAME_FONT_SIZE}px "Public Sans", system-ui, sans-serif`
      const nameWidth = ctx.measureText(label.name).width

      ctx.font = `400 ${TEXT_FONT_SIZE}px "Public Sans", system-ui, sans-serif`
      const lines = wrapText(ctx, label.text, maxWidth)
      const lineWidths = lines.map((line) => ctx.measureText(line).width)

      const blockWidth = Math.max(nameWidth, ...lineWidths, 0)
      const blockHeight = LINE_HEIGHT * (1 + lines.length)
      const x = align === "right" ? label.pos.x - blockWidth : label.pos.x

      return { x, y: label.pos.y, width: blockWidth, height: blockHeight }
    })

    // The most recently revealed label is highlighted; earlier ones are
    // dimmed and recolored neutral so the eye is drawn to what's new while
    // keeping prior context legible.
    const isCurrent = (i: number) =>
      !progressive || isAllStage || i === clampedStep
    const PAST_OPACITY = 0.5

    visibleLabels.forEach((label, i) => {
      const align = label.align ?? "left"
      const box = labelBoxes[i]
      const current = isCurrent(i)
      const textX = align === "right" ? label.pos.x : label.pos.x
      ctx.textAlign = align === "right" ? "right" : "left"
      ctx.globalAlpha = current ? 1 : PAST_OPACITY

      ctx.font = `600 ${NAME_FONT_SIZE}px "Public Sans", system-ui, sans-serif`
      ctx.fillStyle = current ? accent : textMuted
      ctx.fillText(label.name, textX, box.y + NAME_FONT_SIZE)

      ctx.font = `400 ${TEXT_FONT_SIZE}px "Public Sans", system-ui, sans-serif`
      ctx.fillStyle = textMuted
      const lines = wrapText(ctx, label.text, label.maxWidth ?? 240)
      lines.forEach((line, lineIndex) => {
        ctx.fillText(line, textX, box.y + LINE_HEIGHT * (lineIndex + 2))
      })
    })
    ctx.globalAlpha = 1
    ctx.textAlign = "left"

    // ── arrows ────────────────────────────────────────────────────────────
    ctx.lineWidth = 2
    visibleLabels.forEach((label, i) => {
      const current = isCurrent(i)
      const arrowColor = current ? accent : textMuted
      ctx.strokeStyle = arrowColor
      ctx.fillStyle = arrowColor
      ctx.globalAlpha = current ? 1 : PAST_OPACITY
      const targets = Array.isArray(label.target)
        ? label.target
        : [label.target]
      for (const target of targets) {
        const anchor = anchorTowards(labelBoxes[i], target, ARROW_GAP)
        drawArrow(ctx, anchor, target)
      }
    })
    ctx.globalAlpha = 1
  }, [
    code,
    visibleLabels,
    clampedStep,
    isAllStage,
    progressive,
    width,
    height,
    theme,
  ])

  return (
    <div
      className={s.wrapper}
      style={{ maxWidth: width }}
      onKeyDown={progressive ? handleKeyDown : undefined}
    >
      <canvas
        ref={canvasRef}
        className={s.canvas}
        style={{ aspectRatio: `${width} / ${height}` }}
        tabIndex={progressive ? 0 : undefined}
      />
      {progressive && (
        <div className={s.nav}>
          <IconButton
            aria-label="Previous label"
            title="Previous (keyboard left/right also navigates)"
            onClick={goBack}
          >
            <SvgIcon name="prev" />
          </IconButton>
          <IconButton
            aria-label="Next label"
            title="Next (keyboard left/right also navigates)"
            onClick={goForward}
          >
            <SvgIcon name="next" />
          </IconButton>
        </div>
      )}
    </div>
  )
}
