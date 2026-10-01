/**
 * "Explorar configuraciones": a partir de una configuración, simula un
 * conjunto fijo de configuraciones cercanas (variando V0 y θ en pasos
 * discretos) y calcula su índice de eficacia y tolerancia — reutiliza
 * `computeEfficacyIndex` y `computeToleranceReport`, no define ningún
 * criterio nuevo. Es una herramienta de exploración directa sobre el modelo
 * físico (independiente del modelo de IA, que usa su propio conjunto de
 * entrenamiento para la comparación de vecinos).
 */

import { LAUNCH_LIMITS } from '../physics/constants'
import type { LaunchParams } from '../physics/types'
import type { EfficacyIndexOptions } from './efficacyIndex'
import { DEFAULT_EFFICACY_OPTIONS, computeEfficacyIndex } from './efficacyIndex'
import { computeToleranceReport } from './marginAnalysis'
import type { ValidityLabel } from './types'
import { assessValidity } from './validity'

export interface NearbyConfiguration {
  initialSpeed: number
  launchAngleDeg: number
  deltaSpeed: number
  deltaAngle: number
  efficacyIndex: number
  /** El menor de los dos márgenes angulares (más conservador que promediarlos). */
  angleTolerance: number
  label: ValidityLabel
}

const SPEED_STEPS = [-1, -0.5, 0, 0.5, 1]
const ANGLE_STEPS = [-6, -3, 0, 3, 6]

export function findNearbyConfigurations(
  base: LaunchParams,
  options: EfficacyIndexOptions = DEFAULT_EFFICACY_OPTIONS,
): NearbyConfiguration[] {
  const results: NearbyConfiguration[] = []

  for (const deltaAngle of ANGLE_STEPS) {
    for (const deltaSpeed of SPEED_STEPS) {
      if (deltaSpeed === 0 && deltaAngle === 0) continue

      const initialSpeed = base.initialSpeed + deltaSpeed
      const launchAngleDeg = base.launchAngleDeg + deltaAngle
      if (initialSpeed < LAUNCH_LIMITS.initialSpeed.min || initialSpeed > LAUNCH_LIMITS.initialSpeed.max) continue
      if (launchAngleDeg < LAUNCH_LIMITS.launchAngleDeg.min || launchAngleDeg > LAUNCH_LIMITS.launchAngleDeg.max) continue

      const params: LaunchParams = { ...base, initialSpeed, launchAngleDeg }
      const efficacy = computeEfficacyIndex(params, options)
      const tolerance = computeToleranceReport(params)
      const validity = assessValidity(params)

      results.push({
        initialSpeed,
        launchAngleDeg,
        deltaSpeed,
        deltaAngle,
        efficacyIndex: efficacy.index,
        angleTolerance: Math.min(tolerance.angleTolerance.lower, tolerance.angleTolerance.upper),
        label: validity.label,
      })
    }
  }

  return results
}
