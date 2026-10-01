import {
  DEFAULT_DISTANCE_TO_HOOP,
  DEFAULT_GRAVITY,
  DEFAULT_HOOP_HEIGHT,
  DEFAULT_INITIAL_SPEED,
  DEFAULT_LAUNCH_ANGLE_DEG,
  DEFAULT_RELEASE_HEIGHT,
} from '../physics/constants'
import { computeLaunchResults } from '../physics/results'
import { positionAt, sampleTrajectory } from '../physics/trajectory'
import type { LaunchParams } from '../physics/types'
import { BALL_RADIUS, HOOP_RADIUS } from '../geometry/constants'
import type { Scene3DData } from './types'

/**
 * Mismos valores por defecto que Física (ver `physics/constants.ts`). El
 * modelo físico es 2D (x horizontal, y altura); aquí se añade z=0 porque
 * el modelo no contempla desviación lateral — no es un dato inventado,
 * es la ausencia de esa dimensión en el modelo documentado.
 */
export const SCENE_PARAMS: LaunchParams = {
  initialSpeed: DEFAULT_INITIAL_SPEED,
  launchAngleDeg: DEFAULT_LAUNCH_ANGLE_DEG,
  releaseHeight: DEFAULT_RELEASE_HEIGHT,
  distanceToHoop: DEFAULT_DISTANCE_TO_HOOP,
  hoopHeight: DEFAULT_HOOP_HEIGHT,
  gravity: DEFAULT_GRAVITY,
}

/** Posición del balón a lo largo de la MISMA trayectoria de `SCENE_PARAMS` (para animarlo). */
export function ballPositionAtTime(t: number): { x: number; y: number; z: number } {
  const p = positionAt(SCENE_PARAMS, t)
  return { x: p.x, y: p.y, z: 0 }
}

/**
 * Construye los datos de la escena 3D reutilizando `src/physics/` (no
 * recalcula ninguna ecuación). El balón se sitúa en el punto de altura
 * máxima de la trayectoria, como posición representativa del lanzamiento.
 */
export function buildScene3DData(): Scene3DData {
  const results = computeLaunchResults(SCENE_PARAMS)
  const points2D = sampleTrajectory(SCENE_PARAMS, results.flightTime, 80)
  const trajectory = points2D.map((p) => ({ t: p.t, x: p.x, y: p.y, z: 0 }))

  const apex = positionAt(SCENE_PARAMS, results.timeToMaxHeight)

  return {
    trajectory,
    flightTime: results.flightTime,
    ballPosition: { x: apex.x, y: apex.y, z: 0 },
    hoopPosition: { x: SCENE_PARAMS.distanceToHoop, y: SCENE_PARAMS.hoopHeight, z: 0 },
    hoopRadius: HOOP_RADIUS,
    ballRadius: BALL_RADIUS,
    releaseHeight: SCENE_PARAMS.releaseHeight,
  }
}
