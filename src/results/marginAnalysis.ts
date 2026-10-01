/**
 * Margen de error / tolerancia: cuánto se puede mover V0 o θ (en cada
 * dirección) antes de que la clasificación de validez cambie. No es una
 * fórmula nueva: es una búsqueda numérica (barrido grueso + bisección) que
 * solo llama a `assessValidity`, que a su vez solo compone funciones ya
 * existentes de Física y Geometría. El margen geométrico (`clearance`) no
 * se recalcula aquí: se reutiliza directamente el valor que ya da
 * `assessValidity`.
 */

import { LAUNCH_LIMITS } from '../physics/constants'
import type { LaunchParams } from '../physics/types'
import type { AxisRange, Grid } from './grid'
import { buildGrid } from './grid'
import { assessValidity } from './validity'

export interface ToleranceRange {
  /** Cuánto se puede reducir el parámetro antes de que cambie la validez (misma unidad que el parámetro). `Infinity` si no cambia dentro del rango permitido. */
  lower: number
  /** Cuánto se puede aumentar el parámetro antes de que cambie la validez. */
  upper: number
}

export interface ToleranceReport {
  base: LaunchParams
  baseValid: boolean
  speedTolerance: ToleranceRange
  angleTolerance: ToleranceRange
  /** Margen geométrico real en el punto base (m), tomado de `assessValidity`. */
  geometricClearance: number
}

type ToleranceKey = 'initialSpeed' | 'launchAngleDeg'

function isAcceptable(params: LaunchParams): boolean {
  return assessValidity(params).label !== 'invalid'
}

/** Distancia (offset positivo) hasta que la validez cambia, buscando en una sola dirección desde `base`. */
function findBoundaryOffset(base: LaunchParams, key: ToleranceKey, direction: 1 | -1, limitMin: number, limitMax: number): number {
  const baseline = isAcceptable(base)
  const maxOffset = direction === 1 ? limitMax - base[key] : base[key] - limitMin
  if (maxOffset <= 0) return 0

  const coarseSteps = 200
  const coarseStep = maxOffset / coarseSteps

  let lo = 0
  let hi = 0
  let flipped = false

  for (let i = 1; i <= coarseSteps; i += 1) {
    const offset = i * coarseStep
    const testParams = { ...base, [key]: base[key] + direction * offset }
    if (isAcceptable(testParams) !== baseline) {
      lo = offset - coarseStep
      hi = offset
      flipped = true
      break
    }
  }

  if (!flipped) return Infinity

  for (let i = 0; i < 30; i += 1) {
    const mid = (lo + hi) / 2
    const testParams = { ...base, [key]: base[key] + direction * mid }
    if (isAcceptable(testParams) === baseline) lo = mid
    else hi = mid
  }

  return (lo + hi) / 2
}

export function computeToleranceReport(base: LaunchParams): ToleranceReport {
  const assessment = assessValidity(base)
  const speedLimits = LAUNCH_LIMITS.initialSpeed
  const angleLimits = LAUNCH_LIMITS.launchAngleDeg

  return {
    base,
    baseValid: assessment.label !== 'invalid',
    speedTolerance: {
      lower: findBoundaryOffset(base, 'initialSpeed', -1, speedLimits.min, speedLimits.max),
      upper: findBoundaryOffset(base, 'initialSpeed', 1, speedLimits.min, speedLimits.max),
    },
    angleTolerance: {
      lower: findBoundaryOffset(base, 'launchAngleDeg', -1, angleLimits.min, angleLimits.max),
      upper: findBoundaryOffset(base, 'launchAngleDeg', 1, angleLimits.min, angleLimits.max),
    },
    geometricClearance: assessment.clearance,
  }
}

export interface ToleranceGridCell {
  initialSpeed: number
  launchAngleDeg: number
  tolerance: ToleranceReport
}

/** Mapa de tolerancia: `computeToleranceReport` (bisección) aplicado a cada (θ, V0) de la rejilla — mismo cálculo que el punto único, sin una fórmula distinta para el mapa. */
export function computeToleranceGrid(base: LaunchParams, angleAxis: AxisRange, speedAxis: AxisRange): Grid<ToleranceGridCell> {
  return buildGrid(angleAxis, speedAxis, (initialSpeed, launchAngleDeg) => {
    const params: LaunchParams = { ...base, initialSpeed, launchAngleDeg }
    return { initialSpeed, launchAngleDeg, tolerance: computeToleranceReport(params) }
  })
}
