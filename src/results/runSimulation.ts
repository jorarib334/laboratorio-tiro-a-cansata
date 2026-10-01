import { computeLaunchResults } from '../physics/results'
import type { LaunchParams } from '../physics/types'
import type { SimulationResult } from './types'
import { assessValidity } from './validity'

/** Un lanzamiento completo: resultados físicos + evaluación de validez, ambos reutilizando `src/physics/` y `src/geometry/`. */
export function runSimulation(params: LaunchParams): SimulationResult {
  return {
    params,
    results: computeLaunchResults(params),
    validity: assessValidity(params),
  }
}
