import type { SimulationResult } from './types'

export interface TrajectoryExampleSet {
  /** El lanzamiento con más margen (`clearance`) dentro de los ya simulados. */
  favorable: SimulationResult | null
  /** Un lanzamiento justo en el límite geométrico, o el válido con menos margen si no hay ninguno exactamente en el límite. */
  nearLimit: SimulationResult | null
  /** Un lanzamiento no válido que sí llega al plano del aro (un "casi", más ilustrativo que uno que ni siquiera llega). */
  invalid: SimulationResult | null
}

/**
 * Selecciona, de un conjunto de lanzamientos YA simulados (p. ej. el barrido
 * de la IA), un ejemplo representativo de cada categoría. Nunca construye un
 * ejemplo nuevo ni escribe valores a mano: solo recorre `cells` y se queda
 * con los mejores candidatos según `validity`, que ya viene calculado.
 */
export function pickTrajectoryExamples(cells: SimulationResult[]): TrajectoryExampleSet {
  let favorable: SimulationResult | null = null
  let favorableScore = -Infinity

  let boundary: SimulationResult | null = null

  let closeValid: SimulationResult | null = null
  let closeValidScore = Infinity

  let invalidNearMiss: SimulationResult | null = null
  let invalidNearMissScore = Infinity
  let anyInvalid: SimulationResult | null = null

  for (const cell of cells) {
    const { validity } = cell
    if (validity.label === 'valid') {
      if (validity.clearance > favorableScore) {
        favorableScore = validity.clearance
        favorable = cell
      }
      if (validity.clearance < closeValidScore) {
        closeValidScore = validity.clearance
        closeValid = cell
      }
    } else if (validity.label === 'boundary') {
      boundary = cell
    } else {
      anyInvalid = cell
      if (cell.results.hoopArrival.reachesHoop && validity.centersDistance < invalidNearMissScore) {
        invalidNearMissScore = validity.centersDistance
        invalidNearMiss = cell
      }
    }
  }

  return {
    favorable,
    nearLimit: boundary ?? closeValid,
    invalid: invalidNearMiss ?? anyInvalid,
  }
}
