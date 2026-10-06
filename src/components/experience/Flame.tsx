import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { FLAME_CONFIG } from '../../config/cake'
import { useExperienceStore } from '../../store/experienceStore'
import { getGlowTexture } from './glowTexture'
import { gustStrength } from './wind'

type Props = { index: number; position: THREE.Vector3; health: number }

const [haloX, haloY, haloZ] = FLAME_CONFIG.haloScale
const cameraLocal = new THREE.Vector3()

export function Flame({ index, position, health }: Props) {
  const pivot = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Sprite>(null)
  const light = useRef<THREE.PointLight>(null)
  const { camera } = useThree()
  const wind = useExperienceStore((state) => state.wind)

  useFrame((state, delta) => {
    if (!pivot.current || !body.current) return
    const time = state.clock.elapsedTime + index * 1.7
    // Each flame feels the gust a beat apart, so the wind visibly travels across the cake.
    const gust = wind ? gustStrength(Date.now() - wind.startedAt - index * 140) : 0
    const flicker = gust * (Math.sin(time * 38) * 0.5 + Math.sin(time * 23) * 0.5)

    // Billboard around the vertical axis only: the flame stays upright even when viewed from above.
    if (pivot.current.parent) {
      pivot.current.parent.worldToLocal(cameraLocal.copy(camera.position))
      pivot.current.rotation.y = Math.atan2(cameraLocal.x - position.x, cameraLocal.z - position.z)
    }

    const alive = health > 0 ? 1 : 0
    const bend = (wind?.direction ?? 1) * (gust * 1.05 + flicker * 0.18)
    body.current.rotation.z = THREE.MathUtils.damp(body.current.rotation.z, -bend, 14, delta)
    const stretch = 1 + Math.sin(time * 17) * 0.09 - gust * 0.25
    const squeeze = 1 + Math.sin(time * 13) * 0.06 - gust * 0.3
    body.current.scale.y = THREE.MathUtils.damp(body.current.scale.y, alive * stretch, health > 0 ? 11 : 22, delta)
    body.current.scale.x = THREE.MathUtils.damp(body.current.scale.x, alive * squeeze, health > 0 ? 11 : 22, delta)
    body.current.scale.z = body.current.scale.x
    if (core.current) core.current.position.x = Math.sin(time * 11) * 0.0008
    if (halo.current) {
      const pulse = (1 + Math.sin(time * 7) * 0.07) * (1 - gust * 0.35)
      halo.current.scale.set(haloX * pulse, haloY * pulse, haloZ)
    }
    if (light.current) light.current.intensity = FLAME_CONFIG.glowIntensity * (1 + Math.sin(time * 14) * 0.12 + flicker * 0.4) * body.current.scale.y
  })

  return (
    <group ref={pivot} position={position}>
      {/* Pivot sits at the wick so the flame leans from its base. */}
      <group ref={body}>
        <sprite ref={halo} position={[0, 0.012, 0]} scale={FLAME_CONFIG.haloScale}>
          <spriteMaterial map={getGlowTexture()} color="#ffb060" toneMapped={false} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
        <mesh position={[0, 0.012, 0]} scale={FLAME_CONFIG.bodyScale}>
          <sphereGeometry args={[1, 16, 20]} />
          <meshBasicMaterial color="#ffb347" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh ref={core} position={[0, 0.008, 0.001]} scale={FLAME_CONFIG.coreScale}>
          <sphereGeometry args={[1, 12, 16]} />
          <meshBasicMaterial color="#fff6d6" toneMapped={false} />
        </mesh>
        <pointLight ref={light} color="#ffa04d" intensity={FLAME_CONFIG.glowIntensity} distance={FLAME_CONFIG.glowDistance} decay={2} position={[0, 0.02, 0.02]} />
      </group>
    </group>
  )
}
