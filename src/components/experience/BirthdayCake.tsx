import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { ASSETS } from '../../config/assets'
import { CAKE_CONFIG, FLAME_POSITIONS } from '../../config/cake'

type Props = { onAnchors: (positions: THREE.Vector3[]) => void }

export function BirthdayCake({ onAnchors }: Props) {
  const { scene } = useGLTF(ASSETS.birthdayCake)
  const model = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    const anchors: THREE.Vector3[] = []
    model.updateMatrixWorld(true)
    model.traverse((child) => {
      if (CAKE_CONFIG.nodeMatchers.existingFlame.test(child.name)) child.visible = false
      if (CAKE_CONFIG.nodeMatchers.wick.test(child.name)) {
        const anchor = new THREE.Vector3()
        // Flames are siblings of the model, so anchors must live in the model's own space.
        model.worldToLocal(child.getWorldPosition(anchor))
        anchor.y += 0.004
        anchors.push(anchor)
      }
      if (child instanceof THREE.Mesh) {
        child.castShadow = false
        child.receiveShadow = false
      }
    })
    anchors.sort((a, b) => a.x - b.x)
    onAnchors(anchors.length ? anchors : FLAME_POSITIONS.map((p) => new THREE.Vector3(...p)))
  }, [model, onAnchors])

  return <primitive object={model} />
}

useGLTF.preload(ASSETS.birthdayCake)
