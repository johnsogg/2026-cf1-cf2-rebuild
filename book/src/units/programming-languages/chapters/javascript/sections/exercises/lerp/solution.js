export function lerp(v, source_low, source_high, target_low, target_high) {
  const scale = (v - source_low) / (source_high - source_low)
  return target_low + scale * (target_high - target_low)
}
