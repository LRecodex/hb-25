import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { CAKE_CONFIG } from '../../config/cake'
import { type ExperienceStage, useExperienceStore } from '../../store/experienceStore'

type OrbitControlsImpl = React.ComponentRef<typeof OrbitControls>

type View = {
  /** Angle down from straight overhead, in radians (0 = top view, π/2 = eye level). */
  polar: number
  /** Extra distance on top of the fitted distance. */
  pullBack?: number
  target: readonly [number, number, number]
  /** Damping rate; lower is a slower, more cinematic move. */
  speed: number
}

const CAKE_TOP: View['target'] = [0, CAKE_CONFIG.camera.targetY, 0]
// Aiming a little below the top keeps the elevated front view centred on the whole cake, not just its top.
const CAKE_BODY: View['target'] = [0, CAKE_CONFIG.camera.targetY - 0.4, 0]
const { overheadPolar, frontPolar } = CAKE_CONFIG.camera

/** Where the camera eases to when a stage begins. Stages not listed keep whatever angle she chose. */
const VIEWS: Partial<Record<ExperienceStage, View>> = {
  loading: { polar: overheadPolar, pullBack: 3, target: CAKE_TOP, speed: 99 },
  intro: { polar: overheadPolar, pullBack: 3, target: CAKE_TOP, speed: 99 },
  cakeReveal: { polar: overheadPolar, pullBack: 0.4, target: CAKE_TOP, speed: 0.9 },
  wish: { polar: frontPolar, target: CAKE_BODY, speed: 1.1 },
  envelope: { polar: Math.PI / 2, target: [0, 0.65, 0], speed: 2 },
  final: { polar: frontPolar, target: CAKE_BODY, speed: 1.5 },
}

const INTERACTIVE: ExperienceStage[] = ['cakeReveal', 'wish', 'blowing', 'candlesOut', 'magic']

const offset = new THREE.Vector3()
const spherical = new THREE.Spherical()
const target = new THREE.Vector3()

function dampAngle(from: number, to: number, lambda: number, delta: number) {
  const diff = Math.atan2(Math.sin(to - from), Math.cos(to - from))
  return from + diff * (1 - Math.exp(-lambda * delta))
}

export function CameraRig() {
  const { camera, size } = useThree()
  const stage = useExperienceStore((state) => state.stage)
  const controls = useRef<OrbitControlsImpl>(null)
  const autopilot = useRef<View | null>(VIEWS.loading!)

  useEffect(() => {
    const view = VIEWS[stage]
    if (view) autopilot.current = view
  }, [stage])

  useFrame((_, delta) => {
    const orbit = controls.current
    if (!orbit) return
    const aspect = size.width / Math.max(1, size.height)
    const mobile = aspect < 0.72
    const tablet = aspect >= 0.72 && aspect < 1.15
    const preset = mobile ? CAKE_CONFIG.camera.mobileDistance : tablet ? CAKE_CONFIG.camera.tabletDistance : CAKE_CONFIG.camera.desktopDistance
    // On narrow screens the horizontal field of view is what clips, so back off until the subject fits the width.
    const halfHeightPerUnit = Math.tan(THREE.MathUtils.degToRad(CAKE_CONFIG.camera.fov / 2))
    const distanceToFit = (width: number) => width / (2 * halfHeightPerUnit * aspect)
    const base = Math.max(preset, distanceToFit(CAKE_CONFIG.camera.fitWidth))
    orbit.minDistance = base * 0.6
    orbit.maxDistance = base * 1.5

    const view = autopilot.current
    if (!view) return
    const radius = stage === 'envelope'
      ? Math.max(7.2, base * 0.84, 2.4 + distanceToFit(2.5))
      : base + (view.pullBack ?? 0)
    const lambda = view.speed

    target.set(...view.target)
    orbit.target.lerp(target, 1 - Math.exp(-lambda * 1.4 * delta))
    offset.copy(camera.position).sub(orbit.target)
    spherical.setFromVector3(offset)
    spherical.phi = THREE.MathUtils.damp(spherical.phi, view.polar, lambda, delta)
    spherical.theta = dampAngle(spherical.theta, 0, lambda, delta)
    spherical.radius = THREE.MathUtils.damp(spherical.radius, radius, lambda, delta)
    camera.position.copy(orbit.target).add(offset.setFromSpherical(spherical))
    camera.lookAt(orbit.target)
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={INTERACTIVE.includes(stage)}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.6}
      minPolarAngle={0.02}
      maxPolarAngle={Math.PI / 2 - 0.04}
      // The moment she grabs the cake, stop steering and let her look around.
      onStart={() => { autopilot.current = null }}
    />
  )
}
