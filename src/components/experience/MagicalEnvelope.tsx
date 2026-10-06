import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useExperienceStore } from '../../store/experienceStore'

const WIDTH = 2.2
const HEIGHT = 1.4
const HALF_W = WIDTH / 2
const HALF_H = HEIGHT / 2

function shape(points: [number, number][]) {
  const s = new THREE.Shape()
  points.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)))
  s.closePath()
  return new THREE.ShapeGeometry(s)
}

export function MagicalEnvelope() {
  const stage = useExperienceStore((state) => state.stage)
  const opening = useExperienceStore((state) => state.envelopeOpening)
  const group = useRef<THREE.Group>(null)
  const flap = useRef<THREE.Group>(null)
  const letter = useRef<THREE.Mesh>(null)

  const { pocket, flapGeometry } = useMemo(() => ({
    // Front pocket: the classic "V" of folded side and bottom panels.
    pocket: shape([[-HALF_W, -HALF_H], [HALF_W, -HALF_H], [HALF_W, HALF_H - 0.08], [0, -0.12], [-HALF_W, HALF_H - 0.08]]),
    flapGeometry: shape([[-HALF_W, 0], [HALF_W, 0], [0, -HEIGHT * 0.62]]),
  }), [])

  useFrame((state, delta) => {
    if (!group.current || stage !== 'envelope') return
    const t = state.clock.elapsedTime
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, opening ? 1.15 : 0.88, 3, delta))
    group.current.position.y = 0.82 + Math.sin(t * 1.2) * (opening ? 0.02 : 0.07)
    group.current.rotation.y = Math.sin(t * 0.65) * (opening ? 0.02 : 0.12)
    group.current.rotation.x = Math.sin(t * 0.8) * 0.04
    if (flap.current) flap.current.rotation.x = THREE.MathUtils.damp(flap.current.rotation.x, opening ? -Math.PI * 0.94 : 0, 4, delta)
    if (letter.current) letter.current.position.y = THREE.MathUtils.damp(letter.current.position.y, opening ? 0.75 : -0.05, opening ? 2.2 : 6, delta)
  })

  if (stage !== 'envelope') return null
  return (
    <group ref={group} scale={0.88} position={[0, 0.82, 2.4]}>
      <pointLight color="#ffd9c0" intensity={6} distance={6} position={[0.4, 0.6, 1.6]} />
      <pointLight color="#f0a3b4" intensity={3} distance={5} position={[-1.6, -0.4, 1]} />

      {/* back panel */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[WIDTH, HEIGHT, 0.03]} />
        <meshStandardMaterial color="#efdcc6" roughness={0.75} />
      </mesh>

      {/* letter that slides out */}
      <mesh ref={letter} position={[0, -0.05, 0.005]}>
        <planeGeometry args={[WIDTH * 0.86, HEIGHT * 0.86]} />
        <meshStandardMaterial color="#fffaf2" roughness={0.9} />
      </mesh>

      <mesh geometry={pocket} position={[0, 0, 0.02]}>
        <meshStandardMaterial color="#f7e8d6" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      <group ref={flap} position={[0, HALF_H, 0.025]}>
        <mesh geometry={flapGeometry}>
          <meshStandardMaterial color="#fbefe0" roughness={0.65} side={THREE.DoubleSide} />
        </mesh>
        {/* wax seal rides on the flap tip */}
        <mesh position={[0, -HEIGHT * 0.56, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.18, 0.05, 40]} />
          <meshStandardMaterial color="#a8324f" roughness={0.32} metalness={0.15} emissive="#5a1028" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0, -HEIGHT * 0.56, 0.058]}>
          <torusGeometry args={[0.11, 0.012, 12, 40]} />
          <meshStandardMaterial color="#d9b36f" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
    </group>
  )
}
