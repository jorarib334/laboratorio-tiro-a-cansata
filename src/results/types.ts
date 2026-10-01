/**
 * Capa de análisis de resultados: no añade física ni geometría nueva, solo
 * compone y reutiliza `src/physics/` y `src/geometry/` (ver `validity.ts`).
 * Esta capa no depende de React; la reutilizan el módulo de Resultados y su
 * sección de Inteligencia Artificial.
 */

import type { CircleRelation } from '../geometry/types'
import type { LaunchParams, LaunchResults } from '../physics/types'

/**
 * Clasificación de un lanzamiento en tres niveles científicos (ver
 * `validity.ts` para cómo se deriva, sin fórmula nueva). `EfficacyCategory`
 * añade un cuarto nivel puramente visual para el mapa de eficacia.
 */
export type ValidityLabel = 'invalid' | 'boundary' | 'valid'
export type EfficacyCategory = 'invalid' | 'boundary' | 'valid' | 'high-margin'

export interface ValidityAssessment {
  label: ValidityLabel
  /** Relación geométrica real entre balón y aro en el instante de llegada. */
  relation: CircleRelation
  /** Distancia entre "centros" usada en la composición (m, ver `validity.ts`). */
  centersDistance: number
  /** Hueco libre real dentro del aro: r_aro − r_balón − distancia (m). Negativo si no cabe. */
  clearance: number
}

export interface SimulationResult {
  params: LaunchParams
  results: LaunchResults
  validity: ValidityAssessment
}

/** Un eje a barrer dentro de un parámetro de `LaunchParams`. */
export interface AxisSweepConfig {
  key: keyof LaunchParams
  min: number
  max: number
  steps: number
}

export interface SweepResult {
  /** Valores de partida para los parámetros no barridos. */
  base: LaunchParams
  axes: AxisSweepConfig[]
  /** Valores muestreados por eje, en el mismo orden que `axes`. */
  values: number[][]
  /** Producto cartesiano de todos los ejes, ya simulado. */
  cells: SimulationResult[]
}
