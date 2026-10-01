import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useState } from 'react'
import * as THREE from 'three'

interface ProjectionLines3DProps {
  point: { x: number; y: number; z: number }
  /** Se muestran (con una revelación progresiva) cuando la vista no es la libre orbital. */
  active: boolean
}

const REVEAL_DURATION = 0.5

function lerpVec3(a: THREE.Vector3, b: THREE.Vector3, t: number): [number, number, number] {
  const v = new THREE.Vector3().lerpVectors(a, b, t)
  return [v.x, v.y, v.z]
}

/**
 * Líneas de proyección auxiliares del balón hacia los planos de
 * referencia: una vertical hasta el suelo (visible en alzado y perfil) y
 * una horizontal desde el origen hasta el punto en el suelo bajo el balón
 * (visible en alzado y planta). Cada una aparece progresivamente al activar
 * una vista de proyección, en vez de aparecer de golpe.
 */
export function ProjectionLines3D({ point, active }: ProjectionLines3DProps) {
  const [progress, setProgress] = useState(0)
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  useFrame((_, delta) => {
    const target = active ? 1 : 0
    if (prefersReducedMotion) {
      if (progress !== target) setProgress(target)
      return
    }
    setProgress((prev) => {
      const step = delta / REVEAL_DURATION
      if (Math.abs(target - prev) < 0.01) return target
      return prev + Math.sign(target - prev) * step
    })
  })

  const ball = new THREE.Vector3(point.x, point.y, point.z)
  const floorBelowBall = new THREE.Vector3(point.x, 0, point.z)
  const origin = new THREE.Vector3(0, 0, 0)

  if (progress <= 0.001) return null

  return (
    <group>
      <Line points={[ball.toArray(), lerpVec3(ball, floorBelowBall, progress)]} color="#3fa9ff" lineWidth={1} dashed dashSize={0.08} gapSize={0.06} transparent opacity={0.75} />
      <Line points={[origin.toArray(), lerpVec3(origin, floorBelowBall, progress)]} color="#3fa9ff" lineWidth={1} dashed dashSize={0.08} gapSize={0.06} transparent opacity={0.75} />
    </group>
  )
}
