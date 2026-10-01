import type { LaunchParams, LaunchResults } from '../physics/types'
import type { ApproachContext } from './types'

/**
 * Convierte los resultados YA CALCULADOS por `src/physics/` (no se repite
 * ningún cálculo aquí) al formato que usa Geometría para describir la
 * aproximación del balón al aro. Es el punto de conexión preparado entre
 * los dos módulos: cuando Física y Geometría compartan estado (todavía no
 * ocurre — cada página mantiene el suyo local), esta misma función podrá
 * recibir los `params`/`results` reales del usuario en vez de valores de
 * ejemplo.
 */
export function deriveApproachContext(params: LaunchParams, results: LaunchResults): ApproachContext {
  return {
    distanceToHoop: params.distanceToHoop,
    hoopHeight: params.hoopHeight,
    releaseHeight: params.releaseHeight,
    entryAngleDeg: results.hoopArrival.angleDeg,
    entrySpeed: results.hoopArrival.speed,
  }
}
