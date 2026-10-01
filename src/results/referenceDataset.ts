import { DEFAULT_GRAVITY, DEFAULT_HOOP_HEIGHT, LAUNCH_LIMITS } from '../physics/constants'
import type { LaunchParams } from '../physics/types'
import { runParameterSweep } from './parameterSweep'
import type { AxisSweepConfig, SweepResult } from './types'

const REFERENCE_SWEEP_AXES: AxisSweepConfig[] = [
  { key: 'initialSpeed', min: LAUNCH_LIMITS.initialSpeed.min, max: LAUNCH_LIMITS.initialSpeed.max, steps: 14 },
  { key: 'launchAngleDeg', min: LAUNCH_LIMITS.launchAngleDeg.min, max: LAUNCH_LIMITS.launchAngleDeg.max, steps: 14 },
  { key: 'releaseHeight', min: LAUNCH_LIMITS.releaseHeight.min, max: LAUNCH_LIMITS.releaseHeight.max, steps: 6 },
  { key: 'distanceToHoop', min: LAUNCH_LIMITS.distanceToHoop.min, max: LAUNCH_LIMITS.distanceToHoop.max, steps: 6 },
]

const REFERENCE_SWEEP_BASE: LaunchParams = {
  initialSpeed: LAUNCH_LIMITS.initialSpeed.min,
  launchAngleDeg: LAUNCH_LIMITS.launchAngleDeg.min,
  releaseHeight: LAUNCH_LIMITS.releaseHeight.min,
  distanceToHoop: LAUNCH_LIMITS.distanceToHoop.min,
  hoopHeight: DEFAULT_HOOP_HEIGHT,
  gravity: DEFAULT_GRAVITY,
}

/**
 * Barrido de referencia (V0, θ, y0, d) sobre todo el rango ajustable de cada
 * variable. Lo usan tanto "¿Qué nos dicen los datos?" y "Ejemplos de
 * trayectorias" (módulo Resultados) como el conjunto de entrenamiento del
 * módulo IA — una única definición reutilizada por ambos, para que "IA usa
 * los datos generados por ese análisis" (no un barrido distinto "por
 * casualidad" en cada módulo).
 */
export function buildReferenceDataset(): SweepResult {
  return runParameterSweep(REFERENCE_SWEEP_BASE, REFERENCE_SWEEP_AXES)
}
