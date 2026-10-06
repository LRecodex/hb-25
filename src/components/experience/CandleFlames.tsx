import * as THREE from 'three'
import { Flame } from './Flame'
import { SmokeEffect } from './SmokeEffect'
import { useExperienceStore } from '../../store/experienceStore'

export function CandleFlames({ positions }: { positions: THREE.Vector3[] }) {
  const health = useExperienceStore((state) => state.flameHealth)
  return (
    <>
      {positions.map((position, index) => (
        <group key={index}>
          <Flame index={index} position={position} health={health[index] ?? 1} />
          {(health[index] ?? 1) <= 0 && <SmokeEffect position={position} seed={index} />}
        </group>
      ))}
    </>
  )
}
