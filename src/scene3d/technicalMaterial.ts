import * as THREE from 'three'

/**
 * Material único de "modo técnico": un tono plano y translúcido que
 * sustituye a los materiales realistas de todas las piezas (jugador, aro,
 * balón, pista), para que el volumen se lea como una construcción técnica
 * en vez de una superficie realista. Mismo modelo, un solo material
 * compartido — no se generan piezas nuevas.
 */
export function createTechnicalMaterial(): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: '#6fc3d1',
    transparent: true,
    opacity: 0.5,
    depthWrite: true,
  })
}
