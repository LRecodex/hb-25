import type { Vector3Tuple } from 'three'

/** Values are based on the inspected GLB's 0.327 × 0.288 × 0.327 m bounds. */
export const CAKE_CONFIG = {
  position: [0, -1.38, 0] as Vector3Tuple,
  rotation: [0, 0, 0] as Vector3Tuple,
  scale: 9.25,
  sourceBounds: {
    min: [-0.1635, 0, -0.1635] as Vector3Tuple,
    max: [0.1635, 0.288, 0.1635] as Vector3Tuple,
  },
  camera: {
    fov: 36,
    desktopDistance: 8.6,
    mobileDistance: 10.8,
    tabletDistance: 9.6,
    targetY: 0.05,
    /** Reveal starts looking almost straight down at the message piped on top of the cake. */
    overheadPolar: 0.2,
    /** Front-top three-quarter view used for the wish and blowing. */
    frontPolar: 1.12,
    /** World-space width (cake board plus breathing room) that must stay in frame on narrow screens. */
    fitWidth: 4.4,
  },
  nodeMatchers: {
    wick: /candle_[25]_wick/i,
    existingFlame: /candle_[25]_flame/i,
  },
} as const

/** Fallbacks derived from the actual wick hierarchy, then transformed by CAKE_CONFIG. */
export const FLAME_POSITIONS = [
  [-0.033, 0.272, -0.036],
  [0.03225, 0.272, -0.036],
] as const satisfies readonly (readonly [number, number, number])[]

export const FLAME_CONFIG = {
  haloScale: [0.04, 0.06, 1] as Vector3Tuple,
  bodyScale: [0.0047, 0.015, 0.0047] as Vector3Tuple,
  coreScale: [0.0025, 0.0085, 0.0025] as Vector3Tuple,
  glowDistance: 3.2,
  glowIntensity: 2.6,
} as const

export const PERFORMANCE = {
  dpr: [1, 1.65] as [number, number],
  ambientParticles: 90,
  magicParticles: 150,
  reducedMotionParticles: 38,
} as const
