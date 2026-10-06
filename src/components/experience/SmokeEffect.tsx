import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { getGlowTexture } from './glowTexture'

export function SmokeEffect({ position, seed }: { position: THREE.Vector3; seed: number }) {
  const group = useRef<THREE.Group>(null)
  const born = useRef<number | null>(null)
  const { camera } = useThree()

  useFrame((state) => {
    if (!group.current) return
    born.current ??= state.clock.elapsedTime
    const age = state.clock.elapsedTime - born.current
    group.current.children.forEach((child, index) => {
      const phase = Math.max(0, age - index * 0.11)
      const mesh = child as THREE.Mesh
      mesh.visible = phase > 0 && phase < 2.3
      mesh.position.set(
        Math.sin(phase * 2.3 + seed + index) * (0.002 + phase * 0.006),
        phase * (0.035 + index * 0.002),
        Math.cos(phase * 1.8 + index) * 0.004,
      )
      const scale = 0.004 + phase * 0.009
      mesh.scale.setScalar(scale)
      mesh.lookAt(camera.position)
      const material = mesh.material as THREE.MeshBasicMaterial
      material.opacity = Math.max(0, 0.16 * (1 - phase / 2.3))
    })
  })

  return (
    <group ref={group} position={position}>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial map={getGlowTexture()} color="#d8ccc8" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}
