import { useState } from "react"
import type { PointerEvent } from "react"
import type { Point } from "../utils/geometry"
import { AXIS_MARGIN } from "../utils/playgroundCanvas"

// how close (in CSS px) the pointer has to be to grab a handle
const GRAB_RADIUS = 14

/**
 * Pointer handling shared by the geometry playgrounds. `handles` are the
 * draggable points in p5 coordinates (origin inside the axis margin). Press
 * within `GRAB_RADIUS` of a handle to grab the nearest one; it follows the
 * pointer (reported through `onDrag`, also in p5 coordinates) until release.
 * Pointer capture keeps the drag going if the pointer leaves the canvas, and
 * pointer events cover mouse, pen, and touch alike.
 *
 * `hover` is the handle under the pointer (or being dragged), so a playground
 * can highlight it; `cursor` is the matching CSS cursor.
 */
export function useDragHandles(
  handles: Point[],
  width: number,
  height: number,
  onDrag: (index: number, p: Point) => void,
) {
  const [dragging, setDragging] = useState<number | null>(null)
  const [hover, setHover] = useState<number | null>(null)

  const toPlot = (e: PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * width - AXIS_MARGIN,
      y: ((e.clientY - rect.top) / rect.height) * height - AXIS_MARGIN,
    }
  }

  const nearest = (p: Point, e: PointerEvent<HTMLCanvasElement>) => {
    // the canvas may be drawn smaller than its nominal width
    const rect = e.currentTarget.getBoundingClientRect()
    const radius = (GRAB_RADIUS * width) / rect.width
    let best: number | null = null
    let bestDist = radius
    handles.forEach((h, i) => {
      const d = Math.hypot(h.x - p.x, h.y - p.y)
      if (d <= bestDist) {
        best = i
        bestDist = d
      }
    })
    return best
  }

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const p = toPlot(e)
    const i = nearest(p, e)
    if (i === null) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(i)
    setHover(i)
  }

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const p = toPlot(e)
    if (dragging !== null) {
      onDrag(dragging, p)
    } else {
      setHover(nearest(p, e))
    }
  }

  const onPointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    setDragging(null)
  }

  const onPointerLeave = () => {
    if (dragging === null) setHover(null)
  }

  return {
    hover: dragging ?? hover,
    dragging,
    cursor:
      dragging !== null ? "grabbing" : hover !== null ? "grab" : "default",
    canvasProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerLeave,
    },
  }
}
