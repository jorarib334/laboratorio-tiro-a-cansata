/**
 * "Índice de eficacia": el modelo físico es determinista, así que no existe
 * ninguna "probabilidad de encestar" que calcular — cada configuración da un
 * resultado único. Lo que sí se puede medir es la ROBUSTEZ de una
 * configuración frente a pequeñas variaciones inevitables de V0 y θ (pulso,
 * técnica): se simulan varias configuraciones vecinas (una rejilla pequeña
 * alrededor de la configuración central, reutilizando `assessValidity`, sin
 * ninguna fórmula nueva) y se mide qué fracción sigue cumpliendo la condición
 * de enceste. Un índice alto significa "sigue entrando aunque el lanzamiento
 * real se desvíe un poco de estos valores exactos", no una probabilidad.
 */

import type { LaunchParams } from '../physics/types'
import type { AxisRange, Grid } from './grid'
import { buildGrid } from './grid'
import { runSimulation } from './runSimulation'
import type { SimulationResult } from './types'
import { assessValidity } from './validity'

export interface EfficacyIndexOptions {
  /** Semirrango de V0 perturbado (m/s). */
  speedDelta: number
  /** Semirrango de θ perturbado (grados). */
  angleDelta: number
  /** Muestras por eje (impar, para incluir la configuración exacta como centro). */
  samplesPerAxis: number
}

export const DEFAULT_EFFICACY_OPTIONS: EfficacyIndexOptions = {
  speedDelta: 0.4,
  angleDelta: 3,
  samplesPerAxis: 5,
}

export interface EfficacyIndexResult {
  /** Fracción (0-1) de las configuraciones vecinas simuladas que cumplen la condición de enceste. */
  index: number
  sampleCount: number
  speedDelta: number
  angleDelta: number
}

export function computeEfficacyIndex(base: LaunchParams, options: EfficacyIndexOptions = DEFAULT_EFFICACY_OPTIONS): EfficacyIndexResult {
  const { speedDelta, angleDelta, samplesPerAxis } = options

  const grid = buildGrid(
    { min: base.launchAngleDeg - angleDelta, max: base.launchAngleDeg + angleDelta, steps: samplesPerAxis },
    { min: base.initialSpeed - speedDelta, max: base.initialSpeed + speedDelta, steps: samplesPerAxis },
    (initialSpeed, launchAngleDeg) => assessValidity({ ...base, initialSpeed, launchAngleDeg }),
  )

  const acceptable = grid.cells.filter((assessment) => assessment.label !== 'invalid').length

  return {
    index: grid.cells.length > 0 ? acceptable / grid.cells.length : 0,
    sampleCount: grid.cells.length,
    speedDelta,
    angleDelta,
  }
}

export type RobustnessLevel = 'fragile' | 'moderate' | 'robust'

/**
 * "Válido" (assessValidity) y "robusto" (este índice) responden preguntas
 * distintas: un lanzamiento puede ser válido en su punto exacto y aun así
 * frágil (cualquier pequeño error real de lanzamiento lo haría fallar). Estos
 * umbrales son solo para elegir qué frase mostrar en la interfaz — no
 * cambian el índice en sí, que ya viene calculado de `computeEfficacyIndex`.
 */
export function describeRobustness(index: number): RobustnessLevel {
  if (index >= 0.7) return 'robust'
  if (index >= 0.3) return 'moderate'
  return 'fragile'
}

export const ROBUSTNESS_LABELS: Record<RobustnessLevel, string> = {
  fragile: 'frágil: casi cualquier pequeña variación real de V₀/θ haría fallar el tiro',
  moderate: 'con margen moderado: parte de las pequeñas variaciones de V₀/θ fallarían',
  robust: 'robusto: la mayoría de las pequeñas variaciones de V₀/θ también entrarían',
}

export interface EfficacyGridCell {
  initialSpeed: number
  launchAngleDeg: number
  efficacy: EfficacyIndexResult
  simulation: SimulationResult
}

/** Mapa de eficacia: para cada (θ, V0) de la rejilla, el índice de eficacia de esa configuración exacta (ver `computeEfficacyIndex`). */
export function computeEfficacyGrid(
  base: LaunchParams,
  angleAxis: AxisRange,
  speedAxis: AxisRange,
  options: EfficacyIndexOptions = DEFAULT_EFFICACY_OPTIONS,
): Grid<EfficacyGridCell> {
  return buildGrid(angleAxis, speedAxis, (initialSpeed, launchAngleDeg) => {
    const params: LaunchParams = { ...base, initialSpeed, launchAngleDeg }
    return {
      initialSpeed,
      launchAngleDeg,
      efficacy: computeEfficacyIndex(params, options),
      simulation: runSimulation(params),
    }
  })
}
