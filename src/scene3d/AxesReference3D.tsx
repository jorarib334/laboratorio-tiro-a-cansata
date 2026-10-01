import { Line } from '@react-three/drei'

interface AxesReference3DProps {
  length?: number
}

/** Ejes de referencia del sistema de coordenadas, solo visibles en "modo técnico". */
export function AxesReference3D({ length = 1.2 }: AxesReference3DProps) {
  return (
    <group>
      <Line points={[[0, 0, 0], [length, 0, 0]]} color="#b9ae9c" lineWidth={1.25} transparent opacity={0.6} />
      <Line points={[[0, 0, 0], [0, length, 0]]} color="#3fa9ff" lineWidth={1.25} transparent opacity={0.6} />
      <Line points={[[0, 0, 0], [0, 0, length]]} color="#b9ae9c" lineWidth={1.25} transparent opacity={0.4} dashed dashSize={0.06} gapSize={0.05} />
    </group>
  )
}
