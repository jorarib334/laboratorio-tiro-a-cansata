/**
 * Modelo físico del tiro parabólico (sin resistencia del aire), tal como está
 * definido en `.claude/skills/laboratorio-tiro-canasta/SKILL.md` §4-5.
 *
 * Esta capa no depende de React ni de ningún componente visual: la reutilizan
 * el módulo de Física y, más adelante, Geometría, Simulador, Resultados e IA.
 */

/** Parámetros de entrada del lanzamiento (unidades SI: metros, segundos, grados). */
export interface LaunchParams {
  /** Velocidad inicial V0 (m/s). */
  initialSpeed: number
  /** Ángulo de lanzamiento θ, en grados sobre la horizontal. */
  launchAngleDeg: number
  /** Altura de liberación y0 (m), medida desde el suelo. */
  releaseHeight: number
  /** Distancia horizontal al aro d (m). */
  distanceToHoop: number
  /** Altura del aro (m), medida desde el suelo. */
  hoopHeight: number
  /** Aceleración de la gravedad (m/s²), constante. */
  gravity: number
}

/** Posición y velocidad del balón en un instante t. */
export interface TrajectoryPoint {
  t: number
  x: number
  y: number
  vx: number
  vy: number
}

/** Estado del balón en el instante en que su posición horizontal alcanza el aro. */
export interface HoopArrival {
  /** Instante t (s) en el que x(t) = distanceToHoop. */
  time: number
  x: number
  y: number
  vx: number
  vy: number
  /** Rapidez |v| en ese instante (m/s). */
  speed: number
  /** Ángulo de la velocidad respecto a la horizontal, en grados (negativo = descendiendo). */
  angleDeg: number
  /**
   * Si el balón sigue en vuelo (por encima del suelo) cuando alcanza la
   * distancia horizontal del aro. Si es `false`, con estos parámetros el
   * balón toca el suelo antes de llegar al aro.
   */
  reachesHoop: boolean
}

/** Resultados derivados del modelo, calculados a partir de x(t)/y(t) (§5). */
export interface LaunchResults {
  /** Tiempo de vuelo total hasta tocar el suelo (y = 0), en segundos. */
  flightTime: number
  /** Alcance: distancia horizontal recorrida hasta tocar el suelo, en metros. */
  range: number
  /** Altura máxima alcanzada, en metros. */
  maxHeight: number
  /** Instante en el que se alcanza la altura máxima, en segundos. */
  timeToMaxHeight: number
  /** Estado del balón al llegar a la distancia horizontal del aro. */
  hoopArrival: HoopArrival
}
