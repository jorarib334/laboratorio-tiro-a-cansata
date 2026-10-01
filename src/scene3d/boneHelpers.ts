import * as THREE from 'three'

export interface Bone {
  position: [number, number, number]
  quaternion: [number, number, number, number]
  length: number
}

const UP = new THREE.Vector3(0, 1, 0)

/**
 * Calcula posición/rotación/longitud de una cápsula que une dos puntos
 * exactamente (articulación real, no un ángulo ajustado a ojo). Se usa
 * para las extremidades de `Player3D`.
 */
export function boneBetween(a: [number, number, number], b: [number, number, number]): Bone {
  const start = new THREE.Vector3(...a)
  const end = new THREE.Vector3(...b)
  const mid = start.clone().add(end).multiplyScalar(0.5)
  const length = start.distanceTo(end)
  const direction = end.clone().sub(start).normalize()
  const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, direction)

  return {
    position: [mid.x, mid.y, mid.z],
    quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
    length,
  }
}
