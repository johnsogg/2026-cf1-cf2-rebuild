export function closestPointOnSegment(p, a, b) {
  const rx = b.x - a.x
  const ry = b.y - a.y
  let t = ((p.x - a.x) * rx + (p.y - a.y) * ry) / (rx * rx + ry * ry)
  t = Math.min(1, Math.max(0, t))
  return { x: a.x + t * rx, y: a.y + t * ry }
}
