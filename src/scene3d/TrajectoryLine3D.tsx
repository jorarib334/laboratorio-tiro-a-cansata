import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import type { TrajectoryPoint3D } from './types'

interface TrajectoryLine3DProps {
  points: TrajectoryPoint3D[]
}

/** Trayectoria calculada por Física, representada tal cual (sin decorarla). */
export function TrajectoryLine3D({ points }: TrajectoryLine3DProps) {
  const linePoints = useMemo<Array<[number, number, number]>>(
    () => points.map((p) => [p.x, p.y, p.z]),
    [points],
  )

  return <Line points={linePoints} color="#3fa9ff" lineWidth={2.5} />
}
