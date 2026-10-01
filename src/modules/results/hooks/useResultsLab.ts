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
import { computeToleranceReport } from '../../../results/marginAnalysis'
import { runSimulation } from '../../../results/runSimulation'

export type ExplorerParamKey = 'initialSpeed' | 'launchAngleDeg' | 'releaseHeight' | 'distanceToHoop'

function defaultExplorerParams(): LaunchParams {
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
 * Estado del "Explorador de lanzamientos" — y, desde esta iteración, ÚNICA
 * fuente de verdad para "el lanzamiento actual" de toda la página de
 * Resultados (mapas incluidos, ver `ResultsPage.tsx`): los mismos
 * parámetros y el mismo motor (`runSimulation`, que a su vez usa
 * `computeLaunchResults` de Física) que el resto del laboratorio — la
 * altura del aro y la gravedad se dejan fijas a sus valores reglamentarios,
 * ya que la validez y el modelo de IA solo varían V0/θ/y0/d, tal como pide
 * el propio módulo.
 */
export function useResultsLab() {
  const [params, setParams] = useState<LaunchParams>(defaultExplorerParams)

  function updateParam(key: ExplorerParamKey, value: number) {
    if (Number.isNaN(value)) return
    const { min, max } = LAUNCH_LIMITS[key]
    const clamped = Math.min(max, Math.max(min, value))
    setParams((prev) => ({ ...prev, [key]: clamped }))
  }

  function selectPoint(point: Pick<LaunchParams, 'initialSpeed' | 'launchAngleDeg'>) {
    setParams((prev) => ({ ...prev, ...point }))
  }

  function reset() {
    setParams(defaultExplorerParams())
  }

  const simulation = useMemo(() => runSimulation(params), [params])
  const efficacy = useMemo(() => computeEfficacyIndex(params), [params])
  const tolerance = useMemo(() => computeToleranceReport(params), [params])

  return { params, updateParam, selectPoint, reset, simulation, efficacy, tolerance }
}
