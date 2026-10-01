import { decomposeVelocity, positionAt, radToDeg, velocityAt } from './trajectory'
import type { HoopArrival, LaunchParams, LaunchResults } from './types'

/**
 * Resultados derivados (tiempo de vuelo, alcance, altura máxima, llegada al
 * aro) no tienen una fórmula cerrada en la documentación del proyecto
 * (SKILL.md §5 los nombra pero no las define). Se derivan aquí directamente
 * de x(t) e y(t), sin añadir física nueva:
 *
 * - Tiempo de vuelo: menor t > 0 tal que y(t) = 0 (el balón toca el suelo).
 *   Despejando de y(t) = y0 + Vy·t − ½gt² = 0 con la fórmula general de la
 *   ecuación de segundo grado.
 * - Alcance: x(t) evaluado en ese tiempo de vuelo.
 * - Altura máxima: y(t) en el instante en que Vy(t) = 0, es decir t = Vy/g.
 * - Llegada al aro: posición y velocidad en el instante en que x(t) coincide
 *   con la distancia horizontal al aro.
 */

/** Tiempo de vuelo hasta que el balón toca el suelo (y = 0). */
export function computeFlightTime(params: LaunchParams): number {
  const { vy } = decomposeVelocity(params)
  const { gravity, releaseHeight } = params
  const discriminant = vy * vy + 2 * gravity * releaseHeight
  return (vy + Math.sqrt(discriminant)) / gravity
}

/** Alcance: distancia horizontal recorrida hasta tocar el suelo. */
export function computeRange(params: LaunchParams): number {
  const flightTime = computeFlightTime(params)
  return positionAt(params, flightTime).x
}

/** Altura máxima y el instante en que se alcanza. */
export function computeMaxHeight(params: LaunchParams): { maxHeight: number; timeToMaxHeight: number } {
  const { vy } = decomposeVelocity(params)
  const timeToMaxHeight = Math.max(vy / params.gravity, 0)
  return { maxHeight: positionAt(params, timeToMaxHeight).y, timeToMaxHeight }
}

/** Estado del balón al llegar a la distancia horizontal del aro. */
export function computeHoopArrival(params: LaunchParams): HoopArrival {
  const { vx } = decomposeVelocity(params)
  const flightTime = computeFlightTime(params)
  const timeAtHoopDistance = params.distanceToHoop / vx
  const reachesHoop = timeAtHoopDistance <= flightTime

  const time = reachesHoop ? timeAtHoopDistance : flightTime
  const position = positionAt(params, time)
  const velocity = velocityAt(params, time)
  const speed = Math.hypot(velocity.vx, velocity.vy)
  const angleDeg = radToDeg(Math.atan2(velocity.vy, velocity.vx))

  return { time, x: position.x, y: position.y, vx: velocity.vx, vy: velocity.vy, speed, angleDeg, reachesHoop }
}

/** Agrupa todos los resultados derivados del lanzamiento. */
export function computeLaunchResults(params: LaunchParams): LaunchResults {
  const flightTime = computeFlightTime(params)
  const range = computeRange(params)
  const { maxHeight, timeToMaxHeight } = computeMaxHeight(params)
  const hoopArrival = computeHoopArrival(params)
  return { flightTime, range, maxHeight, timeToMaxHeight, hoopArrival }
}
