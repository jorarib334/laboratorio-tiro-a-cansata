import { useMemo, useState } from 'react'
import {
  DEFAULT_DISTANCE_TO_HOOP,
  DEFAULT_GRAVITY,
  DEFAULT_HOOP_HEIGHT,
  DEFAULT_INITIAL_SPEED,
  DEFAULT_LAUNCH_ANGLE_DEG,
  DEFAULT_RELEASE_HEIGHT,
  LAUNCH_LIMITS,
} from '../../../physics/constants'
import type { LaunchParams } from '../../../physics/types'
import { computeEfficacyIndex } from '../../../results/efficacyIndex'
import { findNearbyConfigurations } from '../../../results/explore'
import { computeToleranceReport } from '../../../results/marginAnalysis'
import { runSimulation } from '../../../results/runSimulation'

export type AiQueryKey = 'initialSpeed' | 'launchAngleDeg' | 'releaseHeight' | 'distanceToHoop'

function defaultQuery(): LaunchParams {
  return {
    initialSpeed: DEFAULT_INITIAL_SPEED,
    launchAngleDeg: DEFAULT_LAUNCH_ANGLE_DEG,
    releaseHeight: DEFAULT_RELEASE_HEIGHT,
    distanceToHoop: DEFAULT_DISTANCE_TO_HOOP,
    hoopHeight: DEFAULT_HOOP_HEIGHT,
    gravity: DEFAULT_GRAVITY,
  }
}

/**
 * Configuración de entrada compartida por "Análisis inteligente del
 * lanzamiento" y "Explorar configuraciones": un único panel de V0/θ/y0/d
 * alimenta ambas herramientas, reutilizando `runSimulation`,
 * `computeEfficacyIndex`, `computeToleranceReport` y `findNearbyConfigurations`
 * (todas ya existentes en `src/results/`).
 */
export function useAiQuery() {
  const [params, setParams] = useState<LaunchParams>(defaultQuery)

  function updateParam(key: AiQueryKey, value: number) {
    if (Number.isNaN(value)) return
    const { min, max } = LAUNCH_LIMITS[key]
    setParams((prev) => ({ ...prev, [key]: Math.min(max, Math.max(min, value)) }))
  }

  function reset() {
    setParams(defaultQuery())
  }

  const simulation = useMemo(() => runSimulation(params), [params])
  const efficacy = useMemo(() => computeEfficacyIndex(params), [params])
  const tolerance = useMemo(() => computeToleranceReport(params), [params])
  const nearby = useMemo(() => findNearbyConfigurations(params), [params])

  return { params, updateParam, reset, simulation, efficacy, tolerance, nearby }
}
