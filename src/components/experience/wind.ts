import * as THREE from 'three'

/** Timeline of one "Blow the candles" gust, in milliseconds from the button press. */
export const GUST = {
  extinguishAt: [850, 1120],
  duration: 1900,
} as const

/** 0 → 1 → 0 envelope of the gust's strength at `ageMs`. */
export function gustStrength(ageMs: number) {
  const t = ageMs / 1000
  return THREE.MathUtils.smoothstep(t, 0, 0.32) * (1 - THREE.MathUtils.smoothstep(t, 1.15, GUST.duration / 1000))
}
