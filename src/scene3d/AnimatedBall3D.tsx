import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Ball3D } from './Ball3D'
import { ballPositionAtTime } from './trajectoryAdapter'

interface AnimatedBall3DProps {
  flightTime: number
  radius: number
  fallbackPosition: { x: number; y: number; z: number }
  technicalMode?: boolean
}

const HOLD_AT_END = 0.6

/**
 * El balón recorre la MISMA trayectoria calculada por Física (reutiliza
 * `ballPositionAtTime`, sin inventar ni recalcular el movimiento), en un
 * bucle continuo con una pequeña pausa al final antes de reiniciar. Con
 * `prefers-reduced-motion` se muestra estático en su posición representativa.
 */
export function AnimatedBall3D({ flightTime, radius, fallbackPosition, technicalMode }: AnimatedBall3DProps) {
  const groupRef = useRef<import('three').Group>(null)
  const elapsedRef = useRef(0)
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const cycleDuration = flightTime + HOLD_AT_END

  useFrame((_, delta) => {
    if (prefersReducedMotion || !groupRef.current) return
    elapsedRef.current = (elapsedRef.current + delta) % cycleDuration
    const t = Math.min(elapsedRef.current, flightTime)
    const p = ballPositionAtTime(t)
    groupRef.current.position.set(p.x, p.y, p.z)
  })

  const initial = prefersReducedMotion ? fallbackPosition : ballPositionAtTime(0)

  return (
    <group ref={groupRef} position={[initial.x, initial.y, initial.z]}>
      <Ball3D position={[0, 0, 0]} radius={radius} technicalMode={technicalMode} />
    </group>
  )
}
