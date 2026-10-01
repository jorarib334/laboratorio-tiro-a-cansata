import { useMemo } from 'react'
import * as THREE from 'three'
import { createBasketballTexture } from './canvasTextures'
import { createTechnicalMaterial } from './technicalMaterial'

interface Ball3DProps {
  position: [number, number, number]
  radius: number
  technicalMode?: boolean
}

/**
 * Balón de baloncesto reconocible: una única esfera con una textura
 * generada por código (grano de cuero + costuras curvas, ver
 * `canvasTextures.ts`) en vez de anillos-costura por separado — más
 * realista y más barato (1 malla en vez de 4).
 */
export function Ball3D({ position, radius, technicalMode }: Ball3DProps) {
  const texture = useMemo(() => createBasketballTexture(), [])
  const realisticMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ map: texture, roughness: 0.75, metalness: 0.02 }),
    [texture],
  )
  const technicalMaterial = useMemo(() => createTechnicalMaterial(), [])

  return (
    <group position={position}>
      <mesh material={technicalMode ? technicalMaterial : realisticMaterial} castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 24]} />
      </mesh>
    </group>
  )
}
