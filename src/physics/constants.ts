/**
 * Constantes y valores por defecto del modelo físico.
 *
 * No hay valores iniciales documentados en el proyecto para V0, θ, y0 o d
 * (`.claude/skills/laboratorio-tiro-canasta/SKILL.md` §4 solo define las
 * variables, no cifras concretas). Como son parámetros ajustables por el
 * usuario (sliders), se parte de:
 * - gravity: constante física estándar.
 * - hoopHeight y distanceToHoop: medidas reglamentarias reales (altura del
 *   aro y distancia de tiro libre FIBA al centro del aro).
 * - releaseHeight: valor ilustrativo (altura de liberación típica de un
 *   lanzador), no un dato del proyecto.
 * - initialSpeed y launchAngleDeg: obtenidos despejando V0 en la propia
 *   ecuación y(t) = y0 + V0·sen(θ)·t − ½gt² para que, con θ = 48°, la
 *   trayectoria llegue exactamente a hoopHeight en distanceToHoop. No son un
 *   dato inventado suelto: son la ecuación documentada resuelta hacia atrás
 *   para dar una demo inicial coherente.
 */

export const DEFAULT_GRAVITY = 9.81
export const DEFAULT_HOOP_HEIGHT = 3.05
export const DEFAULT_DISTANCE_TO_HOOP = 4.225
export const DEFAULT_RELEASE_HEIGHT = 2.2
export const DEFAULT_LAUNCH_ANGLE_DEG = 48
export const DEFAULT_INITIAL_SPEED = 7.1

export const LAUNCH_LIMITS = {
  initialSpeed: { min: 1, max: 20, step: 0.1 },
  launchAngleDeg: { min: 5, max: 85, step: 1 },
  releaseHeight: { min: 0, max: 3, step: 0.05 },
  distanceToHoop: { min: 1, max: 12, step: 0.025 },
  hoopHeight: { min: 2, max: 4, step: 0.05 },
} as const
