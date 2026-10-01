import { useMemo } from 'react'
import * as THREE from 'three'
import { boneBetween } from './boneHelpers'
import { createTechnicalMaterial } from './technicalMaterial'

interface Player3DProps {
  /** Posición de los pies del jugador (mundo, metros). */
  position: [number, number, number]
  technicalMode?: boolean
}

/**
 * Puntos de la pose (metros, pies en el origen local, Y hacia arriba):
 * postura de lanzamiento equilibrada — rodillas ligeramente flexionadas
 * (impulso), torso inclinado hacia delante, brazo de lanzamiento extendido
 * en "follow-through", brazo contrario recogido para el equilibrio. Son
 * articulaciones reales (no ángulos ajustados a ojo): cada extremidad es
 * una cápsula calculada entre dos puntos con `boneBetween`.
 */
const JOINTS = {
  leftHip: [-0.09, 0.92, 0] as [number, number, number],
  leftKnee: [-0.11, 0.48, 0.06] as [number, number, number],
  leftAnkle: [-0.09, 0.07, 0.02] as [number, number, number],

  rightHip: [0.09, 0.92, 0] as [number, number, number],
  rightKnee: [0.1, 0.46, -0.07] as [number, number, number],
  rightAnkle: [0.08, 0.07, -0.1] as [number, number, number],

  pelvis: [0, 0.92, 0] as [number, number, number],
  chest: [0.03, 1.36, 0.05] as [number, number, number],
  neckBase: [0.03, 1.58, 0.04] as [number, number, number],
  head: [0.02, 1.73, 0.05] as [number, number, number],

  rightShoulder: [0.15, 1.42, 0.04] as [number, number, number],
  rightElbow: [0.24, 1.72, 0.12] as [number, number, number],
  rightWrist: [0.15, 2.03, 0.06] as [number, number, number],
  rightHand: [0.11, 2.16, 0.02] as [number, number, number],

  leftShoulder: [-0.15, 1.4, 0.04] as [number, number, number],
  leftElbow: [-0.27, 1.17, -0.04] as [number, number, number],
  leftHand: [-0.17, 1.03, -0.16] as [number, number, number],
}

const LIMBS: Array<{ a: [number, number, number]; b: [number, number, number]; radius: number; part: 'leg' | 'arm' }> = [
  { a: JOINTS.leftHip, b: JOINTS.leftKnee, radius: 0.078, part: 'leg' },
  { a: JOINTS.leftKnee, b: JOINTS.leftAnkle, radius: 0.062, part: 'leg' },
  { a: JOINTS.rightHip, b: JOINTS.rightKnee, radius: 0.078, part: 'leg' },
  { a: JOINTS.rightKnee, b: JOINTS.rightAnkle, radius: 0.062, part: 'leg' },
  { a: JOINTS.rightShoulder, b: JOINTS.rightElbow, radius: 0.052, part: 'arm' },
  { a: JOINTS.rightElbow, b: JOINTS.rightWrist, radius: 0.044, part: 'arm' },
  { a: JOINTS.leftShoulder, b: JOINTS.leftElbow, radius: 0.052, part: 'arm' },
]

/**
 * Jugador de complejidad media-alta: geometría nativa (cápsulas + esferas)
 * unida por articulaciones reales, con hombros/cintura marcados,
 * calzado con suela propia y materiales distintos para camiseta/pantalón/
 * piel — silueta deportiva reconocible, sin pretender realismo
 * fotográfico ni requerir un modelo externo. "Modo técnico" sustituye
 * todos los materiales por uno plano compartido (mismo modelo).
 */
export function Player3D({ position, technicalMode }: Player3DProps) {
  const jerseyMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#d9541f', roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
    [],
  )
  const shortsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#201b16', roughness: 0.8 }), [])
  const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#a9795c', roughness: 0.75 }), [])
  const shoeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#efe9dd', roughness: 0.55 }), [])
  const soleMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3a3229', roughness: 0.85 }), [])
  const trimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f4efe6', roughness: 0.5 }), [])
  const technicalMaterial = useMemo(() => createTechnicalMaterial(), [])

  const mat = (realistic: THREE.Material) => (technicalMode ? technicalMaterial : realistic)

  const torsoBone = useMemo(() => boneBetween(JOINTS.pelvis, JOINTS.chest), [])
  const neckBone = useMemo(() => boneBetween(JOINTS.neckBase, JOINTS.head), [])
  const limbBones = useMemo(() => LIMBS.map((limb) => ({ ...boneBetween(limb.a, limb.b), radius: limb.radius, part: limb.part })), [])

  return (
    <group position={position}>
      {limbBones.map((bone, index) => (
        <mesh key={index} position={bone.position} quaternion={bone.quaternion} material={mat(bone.part === 'leg' ? shortsMaterial : jerseyMaterial)} castShadow>
          <capsuleGeometry args={[bone.radius, Math.max(bone.length - bone.radius * 2, 0.02), 4, 12]} />
        </mesh>
      ))}

      {/* Hombros: transición suave entre torso y brazos */}
      <mesh position={JOINTS.rightShoulder} material={mat(jerseyMaterial)} castShadow>
        <sphereGeometry args={[0.06, 14, 14]} />
      </mesh>
      <mesh position={JOINTS.leftShoulder} material={mat(jerseyMaterial)} castShadow>
        <sphereGeometry args={[0.06, 14, 14]} />
      </mesh>

      {/* Cintura: cadera + banda del pantalón */}
      <mesh position={JOINTS.pelvis} material={mat(shortsMaterial)} castShadow>
        <sphereGeometry args={[0.115, 14, 14]} />
      </mesh>
      <mesh position={[JOINTS.pelvis[0], JOINTS.pelvis[1] + 0.12, JOINTS.pelvis[2]]} rotation={[Math.PI / 2, 0, 0]} material={mat(trimMaterial)}>
        <torusGeometry args={[0.145, 0.012, 6, 20]} />
      </mesh>

      {/* Zapatillas: cuerpo + suela */}
      {[JOINTS.leftAnkle, JOINTS.rightAnkle].map((ankle, index) => (
        <group key={index} position={[ankle[0], 0, ankle[2] + 0.04]}>
          <mesh position={[0, 0.05, 0]} material={mat(shoeMaterial)} castShadow>
            <boxGeometry args={[0.09, 0.065, 0.19]} />
          </mesh>
          <mesh position={[0, 0.015, 0]} material={mat(soleMaterial)} castShadow>
            <boxGeometry args={[0.095, 0.03, 0.2]} />
          </mesh>
        </group>
      ))}

      {/* Torso */}
      <mesh position={torsoBone.position} quaternion={torsoBone.quaternion} material={mat(jerseyMaterial)} castShadow>
        <capsuleGeometry args={[0.155, Math.max(torsoBone.length - 0.31, 0.05), 4, 12]} />
      </mesh>

      {/* Cuello */}
      <mesh position={neckBone.position} quaternion={neckBone.quaternion} material={mat(skinMaterial)}>
        <capsuleGeometry args={[0.05, Math.max(neckBone.length - 0.1, 0.01), 4, 8]} />
      </mesh>

      {/* Cabeza */}
      <mesh position={JOINTS.head} material={mat(skinMaterial)} castShadow>
        <sphereGeometry args={[0.115, 20, 16]} />
      </mesh>

      {/* Codos, muñeca y mano de lanzamiento */}
      <mesh position={JOINTS.rightElbow} material={mat(skinMaterial)}>
        <sphereGeometry args={[0.046, 12, 12]} />
      </mesh>
      <mesh position={JOINTS.leftElbow} material={mat(skinMaterial)}>
        <sphereGeometry args={[0.046, 12, 12]} />
      </mesh>
      <mesh position={JOINTS.rightHand} material={mat(skinMaterial)} castShadow scale={[1, 0.85, 1.3]}>
        <sphereGeometry args={[0.052, 12, 12]} />
      </mesh>
      <mesh position={JOINTS.leftHand} material={mat(skinMaterial)} scale={[1, 0.85, 1.2]}>
        <sphereGeometry args={[0.05, 12, 12]} />
      </mesh>
    </group>
  )
}
