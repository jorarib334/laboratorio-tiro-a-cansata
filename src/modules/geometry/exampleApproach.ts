import {
  DEFAULT_DISTANCE_TO_HOOP,
  DEFAULT_GRAVITY,
  DEFAULT_HOOP_HEIGHT,
  DEFAULT_INITIAL_SPEED,
  DEFAULT_LAUNCH_ANGLE_DEG,
  DEFAULT_RELEASE_HEIGHT,
} from '../../physics/constants'
import { computeLaunchResults } from '../../physics/results'
import type { LaunchParams } from '../../physics/types'
import { deriveApproachContext } from '../../geometry/physicsBridge'

/**
 * Valores de ejemplo (los mismos por defecto del módulo Física) usados
 * mientras Física y Geometría no comparten estado real entre páginas. Se
 * centralizan aquí para que la vista de contexto y la ventana geométrica
 * usen exactamente los mismos, sin duplicar el objeto.
 */
export const EXAMPLE_PHYSICS_PARAMS: LaunchParams = {
  initialSpeed: DEFAULT_INITIAL_SPEED,
  launchAngleDeg: DEFAULT_LAUNCH_ANGLE_DEG,
  releaseHeight: DEFAULT_RELEASE_HEIGHT,
  distanceToHoop: DEFAULT_DISTANCE_TO_HOOP,
  hoopHeight: DEFAULT_HOOP_HEIGHT,
  gravity: DEFAULT_GRAVITY,
}

export const EXAMPLE_LAUNCH_RESULTS = computeLaunchResults(EXAMPLE_PHYSICS_PARAMS)

export const EXAMPLE_APPROACH_CONTEXT = deriveApproachContext(EXAMPLE_PHYSICS_PARAMS, EXAMPLE_LAUNCH_RESULTS)
