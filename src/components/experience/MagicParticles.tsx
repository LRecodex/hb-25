import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PERFORMANCE } from '../../config/cake'
import { useExperienceStore } from '../../store/experienceStore'
import { getGlowTexture } from './glowTexture'

export function MagicParticles() {
  const stage = useExperienceStore((state) => state.stage)
  const points = useRef<THREE.Points>(null)
  const seeds = useMemo(() => Array.from({ length: PERFORMANCE.magicParticles }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 0.18 + Math.random() * 1.25,
    speed: 0.35 + Math.random() * 0.55,
    offset: Math.random() * 4.5,
  })), [])
  const positions = useMemo(() => new Float32Array(PERFORMANCE.magicParticles * 3), [])

  useFrame((state) => {
    if (!points.current || !['magic', 'envelope', 'final'].includes(stage)) return
    const t = state.clock.elapsedTime
    seeds.forEach((seed, index) => {
      const rise = (t * seed.speed + seed.offset) % 4.3
      const gather = Math.max(0.1, 1 - rise / 5)
      const angle = seed.angle + t * (0.65 + seed.speed)
      positions[index * 3] = Math.cos(angle) * seed.radius * gather
      positions[index * 3 + 1] = -0.75 + rise
      positions[index * 3 + 2] = Math.sin(angle) * seed.radius * gather * 0.52
    })
    const attribute = points.current.geometry.getAttribute('position')
    attribute.needsUpdate = true
    points.current.rotation.y = t * 0.08
  })

  if (!['magic', 'envelope', 'final'].includes(stage)) return null
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.11} map={getGlowTexture()} color="#ffd9a0" transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}
