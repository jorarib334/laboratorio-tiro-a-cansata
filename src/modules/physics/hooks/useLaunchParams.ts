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
import { computeLaunchResults } from '../../../physics/results'
import type { LaunchParams } from '../../../physics/types'

type AdjustableParam = keyof typeof LAUNCH_LIMITS

function defaultParams(): LaunchParams {
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
 * Estado de los parámetros de lanzamiento, con validación (clamping a los
 * límites de `LAUNCH_LIMITS`), reinicio a los valores por defecto y los
 * resultados derivados recalculados en cada cambio.
 */
export function useLaunchParams() {
  const [params, setParams] = useState<LaunchParams>(defaultParams)

  function updateParam(key: AdjustableParam, value: number) {
    if (Number.isNaN(value)) return
    const { min, max } = LAUNCH_LIMITS[key]
    const clamped = Math.min(max, Math.max(min, value))
    setParams((prev) => ({ ...prev, [key]: clamped }))
  }

  function reset() {
    setParams(defaultParams())
  }

  const results = useMemo(() => computeLaunchResults(params), [params])

  return { params, updateParam, reset, results }
}
