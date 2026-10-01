import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { createTechnicalMaterial } from './technicalMaterial'

interface Hoop3DProps {
  position: [number, number, number]
  radius: number
  technicalMode?: boolean
}

/**
 * Aro completo: aro (metal pintado), tablero (cristal templado, material
 * físico semitransparente), cuadro interior, soporte con brazo real y
 * poste, y red con caída curva y más hebras — reconocible como canasta
 * real, integrada en la estética del laboratorio. "Modo técnico" sustituye
 * todos los materiales por uno plano compartido (mismo modelo).
 */
export function Hoop3D({ position, radius, technicalMode }: Hoop3DProps) {
  const [x, y, z] = position
  const rimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e2571c', roughness: 0.3, metalness: 0.65 }), [])
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#dbe7ec',
        roughness: 0.08,
        metalness: 0.02,
        transparent: true,
        opacity: 0.3,
        transmission: 0.55,
        thickness: 0.06,
        clearcoat: 0.6,
      }),
    [],
  )
  const frameMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c7d3d8', roughness: 0.35, metalness: 0.4 }), [])
  const structureMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2f2a22', roughness: 0.6, metalness: 0.45 }), [])
  const technicalMaterial = useMemo(() => createTechnicalMaterial(), [])
  const mat = (realistic: THREE.Material) => (technicalMode ? technicalMaterial : realistic)

  const backboardX = x + radius * 1.5
  const backboardY = y + 0.35
  const poleX = x + radius * 2.5

  const netLines = useMemo(() => {
    const segments = 16
    const bottomY = y - radius * 1.65
    const lines: Array<Array<[number, number, number]>> = []
    for (let i = 0; i < segments; i += 1) {
      const angle = (i / segments) * Math.PI * 2
      const top: [number, number, number] = [x + Math.cos(angle) * radius, y, z + Math.sin(angle) * radius]
      const mid: [number, number, number] = [x + Math.cos(angle) * radius * 0.72, y - radius * 0.85, z + Math.sin(angle) * radius * 0.72]
      const bottom: [number, number, number] = [x + Math.cos(angle) * radius * 0.3, bottomY, z + Math.sin(angle) * radius * 0.3]
      lines.push([top, mid, bottom])
    }
    return lines
  }, [x, y, z, radius])

  const netRings = useMemo(() => {
    const rings: Array<Array<[number, number, number]>> = []
    ;[0.55, 0.85].forEach((depthFraction) => {
      const ringY = y - radius * 1.65 * depthFraction
      const ringRadius = radius * (1 - depthFraction * 0.62)
      const points: Array<[number, number, number]> = []
      for (let i = 0; i <= 24; i += 1) {
        const angle = (i / 24) * Math.PI * 2
        points.push([x + Math.cos(angle) * ringRadius, ringY, z + Math.sin(angle) * ringRadius])
      }
      rings.push(points)
    })
    return rings
  }, [x, y, z, radius])

  return (
    <group>
      {/* Poste */}
      <mesh position={[poleX, y * 0.5, z]} material={mat(structureMaterial)} castShadow>
        <cylinderGeometry args={[0.048, 0.055, y, 12]} />
      </mesh>

      {/* Brazo de soporte, del poste al tablero */}
      <mesh position={[(poleX + backboardX) / 2, backboardY + 0.05, z]} material={mat(structureMaterial)} castShadow>
        <boxGeometry args={[Math.abs(poleX - backboardX), 0.055, 0.055]} />
      </mesh>
      <mesh position={[(poleX + backboardX) / 2, backboardY - 0.18, z]} material={mat(structureMaterial)} castShadow>
        <boxGeometry args={[Math.abs(poleX - backboardX) * 0.85, 0.04, 0.04]} />
      </mesh>

      {/* Tablero: marco + cristal + cuadro interior */}
      <mesh position={[backboardX, backboardY, z]} material={mat(frameMaterial)} castShadow>
        <boxGeometry args={[0.04, 0.6, 0.9]} />
      </mesh>
      <mesh position={[backboardX - 0.022, backboardY, z]} material={mat(glassMaterial)}>
        <boxGeometry args={[0.02, 0.54, 0.82]} />
      </mesh>
      <mesh position={[backboardX - 0.033, y + 0.06, z]} material={mat(frameMaterial)}>
        <boxGeometry args={[0.008, 0.22, 0.3]} />
      </mesh>

      {/* Aro */}
      <mesh position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]} material={mat(rimMaterial)} castShadow>
        <torusGeometry args={[radius, radius * 0.05, 12, 36]} />
      </mesh>

      {/* Red: hebras verticales + un par de anillos horizontales de apoyo */}
      {netLines.map((segment, index) => (
        <Line key={`v-${index}`} points={segment} color="#e7e2d5" lineWidth={1} transparent opacity={0.5} />
      ))}
      {netRings.map((ring, index) => (
        <Line key={`h-${index}`} points={ring} color="#e7e2d5" lineWidth={0.75} transparent opacity={0.3} />
      ))}
    </group>
  )
}
