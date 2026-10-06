import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PERFORMANCE } from '../../config/cake'
import { getGlowTexture } from './glowTexture'

export function AmbientParticles() {
  const points = useRef<THREE.Points>(null)
  const { positions, colors } = useMemo(() => {
    const palette = ['#f6dcae', '#f4b6c2', '#d9c6ff'].map((c) => new THREE.Color(c))
    const positions = new Float32Array(PERFORMANCE.ambientParticles * 3)
    const colors = new Float32Array(PERFORMANCE.ambientParticles * 3)
    for (let i = 0; i < PERFORMANCE.ambientParticles; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = -4 + Math.random() * 5
      palette[i % palette.length].toArray(colors, i * 3)
    }
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (!points.current) return
    const t = state.clock.elapsedTime
    points.current.rotation.y = t * 0.015
    points.current.position.y = Math.sin(t * 0.18) * 0.1
    ;(points.current.material as THREE.PointsMaterial).opacity = 0.5 + Math.sin(t * 0.9) * 0.12
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.09} map={getGlowTexture()} vertexColors transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}
