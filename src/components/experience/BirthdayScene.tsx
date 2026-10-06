import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useCallback, useRef, useState } from 'react'
import * as THREE from 'three'
import { CAKE_CONFIG, FLAME_POSITIONS, PERFORMANCE } from '../../config/cake'
import { useExperienceStore } from '../../store/experienceStore'
import { AmbientParticles } from './AmbientParticles'
import { BirthdayCake } from './BirthdayCake'
import { CameraRig } from './CameraRig'
import { CandleFlames } from './CandleFlames'
import { MagicParticles } from './MagicParticles'
import { MagicalEnvelope } from './MagicalEnvelope'

function CakePresentation({ onReady }: { onReady: () => void }) {
  const stage = useExperienceStore((state) => state.stage)
  const [anchors, setAnchors] = useState<THREE.Vector3[]>(() => FLAME_POSITIONS.map((p) => new THREE.Vector3(...p)))
  const group = useRef<THREE.Group>(null)
  const ambient = useRef<THREE.HemisphereLight>(null)
  const key = useRef<THREE.SpotLight>(null)
  const rim = useRef<THREE.PointLight>(null)
  const readyOnce = useRef(false)
  const visible = !['loading', 'intro', 'letter'].includes(stage)
  const handleAnchors = useCallback((next: THREE.Vector3[]) => {
    setAnchors(next)
    if (!readyOnce.current) {
      readyOnce.current = true
      onReady()
    }
  }, [onReady])

  useFrame((state, delta) => {
    if (!group.current || !ambient.current || !key.current || !rim.current) return
    const revealed = !['loading', 'intro'].includes(stage)
    const dark = ['candlesOut', 'magic', 'envelope'].includes(stage)
    const targetScale = revealed ? 1 : 0.86
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, targetScale, 1.15, delta))
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.06
    ambient.current.intensity = THREE.MathUtils.damp(ambient.current.intensity, dark ? 0.12 : revealed ? 0.55 : 0, 1.8, delta)
    key.current.intensity = THREE.MathUtils.damp(key.current.intensity, dark ? 18 : revealed ? 85 : 0, 1.35, delta)
    rim.current.intensity = THREE.MathUtils.damp(rim.current.intensity, dark ? 4 : revealed ? 14 : 0, 1.5, delta)
    state.scene.environmentIntensity = THREE.MathUtils.damp(state.scene.environmentIntensity, dark ? 0.12 : revealed ? 0.55 : 0, 1.6, delta)
  })

  return (
    <>
      <hemisphereLight ref={ambient} color="#ffe6d6" groundColor="#2a1430" intensity={0} />
      <spotLight ref={key} color="#ffe2bd" intensity={0} position={[2.6, 6.2, 5.4]} angle={0.42} penumbra={1} decay={1.6} distance={20} />
      <pointLight ref={rim} color="#ff8fb0" intensity={0} position={[-3.4, 1.6, -2.6]} distance={10} decay={1.4} />
      <pointLight color="#b48cff" intensity={3} position={[3.2, 0.4, -2.8]} distance={9} decay={1.6} />
      <group visible={visible} position={CAKE_CONFIG.position} rotation={CAKE_CONFIG.rotation} scale={CAKE_CONFIG.scale}>
        <group ref={group}>
          <BirthdayCake onAnchors={handleAnchors} />
          <CandleFlames positions={anchors} />
        </group>
      </group>
      {visible && (
        <ContactShadows position={[0, CAKE_CONFIG.position[1] + 0.005, 0]} scale={7} blur={2.6} far={2.5} opacity={0.65} color="#12060f" />
      )}
    </>
  )
}

function StudioLighting() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2.4} color="#fff1e0" position={[0, 5, 2]} scale={[6, 3, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="rect" intensity={1.6} color="#ffc2d1" position={[-5, 1.5, 1]} scale={[3, 5, 1]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={1.2} color="#d8c2ff" position={[5, 1, -1]} scale={[3, 5, 1]} rotation-y={-Math.PI / 2} />
      <Lightformer form="ring" intensity={1.4} color="#ffe2b0" position={[0, 2, 6]} scale={2.2} />
    </Environment>
  )
}

export function BirthdayScene({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      className="birthday-canvas"
      dpr={PERFORMANCE.dpr}
      camera={{ fov: CAKE_CONFIG.camera.fov, near: 0.1, far: 60, position: [0, 0.2, 10.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0)
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
        scene.environmentIntensity = 0
      }}
    >
      <Suspense fallback={null}>
        <StudioLighting />
        <CakePresentation onReady={onReady} />
      </Suspense>
      <AmbientParticles />
      <MagicParticles />
      <MagicalEnvelope />
      <CameraRig />
    </Canvas>
  )
}
