import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { createCourtTexture } from './canvasTextures'
import { createTechnicalMaterial } from './technicalMaterial'

interface Court3DProps {
  /** Distancia del punto de lanzamiento al aro (m): dimensiona la pista visible. */
  span: number
  technicalMode?: boolean
}

/**
 * Fragmento de pista (no la cancha completa): superficie de parqué
 * (textura generada por código, ver `canvasTextures.ts`) + líneas de
 * referencia (línea de tiro y un semicírculo bajo el aro), suficiente para
 * dar contexto espacial a las vistas alzado/planta/perfil sin añadir peso
 * a la escena.
 */
export function Court3D({ span, technicalMode }: Court3DProps) {
  const width = Math.max(span * 1.6, 4)
  const depth = Math.max(span * 1.6, 4)
  const centerX = span * 0.5

  const woodTexture = useMemo(() => {
    const texture = createCourtTexture()
    texture.repeat.set(width / 3, depth / 3)
    return texture
  }, [width, depth])

  const realisticMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({ map: woodTexture, roughness: 0.42, metalness: 0.04, clearcoat: 0.25, clearcoatRoughness: 0.6 }),
    [woodTexture],
  )
  const technicalMaterial = useMemo(() => {
    const material = createTechnicalMaterial()
    material.opacity = 0.12
    return material
  }, [])

  const shootingLine = useMemo<Array<[number, number, number]>>(
    () => [
      [0, 0.005, -width * 0.22],
      [0, 0.005, width * 0.22],
    ],
    [width],
  )

  const arcPoints = useMemo<Array<[number, number, number]>>(() => {
    const points: Array<[number, number, number]> = []
    const arcRadius = Math.min(span * 0.55, 2.2)
    for (let i = 0; i <= 32; i += 1) {
      const angle = (i / 32) * Math.PI - Math.PI / 2
      points.push([span + Math.cos(angle) * arcRadius, 0.005, Math.sin(angle) * arcRadius])
    }
    return points
  }, [span])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, 0, 0]} material={technicalMode ? technicalMaterial : realisticMaterial} receiveShadow>
        <planeGeometry args={[width, depth]} />
      </mesh>
      <Line points={shootingLine} color="#c9c2b4" lineWidth={1.5} transparent opacity={0.5} />
      <Line points={arcPoints} color="#c9c2b4" lineWidth={1.5} transparent opacity={0.5} />
    </group>
  )
}
