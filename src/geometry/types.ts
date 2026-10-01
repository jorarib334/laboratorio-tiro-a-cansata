/**
 * Modelo geométrico: relación entre las circunferencias del balón y del
 * aro, tal como las nombra `.claude/skills/laboratorio-tiro-canasta/SKILL.md`
 * §6-7 (centros, radios, circunferencias, línea de centros, tangencia).
 *
 * Esta capa no depende de React; la reutilizan el módulo de Geometría y,
 * más adelante, el Simulador.
 */

export interface Point {
  x: number
  y: number
}

/** Circunferencia definida por su centro y su radio (metros). */
export interface Circle {
  cx: number
  cy: number
  r: number
}

/**
 * Clasificación de la posición relativa de dos circunferencias, según la
 * comparación estándar entre la distancia de centros y la suma/diferencia
 * de radios (Dibujo Técnico). No es una fórmula específica del proyecto:
 * es geometría euclídea estándar, la misma que nombra el §6 de la skill.
 */
export type CircleRelation =
  | 'exterior' // separadas, sin puntos en común
  | 'tangent-exterior' // un único punto de tangencia, circunferencias fuera una de otra
  | 'secant' // dos puntos de intersección
  | 'tangent-interior' // un único punto de tangencia, una circunferencia dentro de la otra
  | 'interior' // una circunferencia contenida en la otra, sin puntos en común
  | 'concentric' // mismo centro

export interface CircleRelationResult {
  relation: CircleRelation
  /** Distancia entre los centros (m). */
  distance: number
  /** r1 + r2 (m): umbral de tangencia exterior. */
  sumRadii: number
  /** |r1 - r2| (m): umbral de tangencia interior. */
  diffRadii: number
  /** Punto de tangencia, solo cuando `relation` es una de las dos tangencias. */
  tangencyPoint: Point | null
  /** Puntos de intersección, solo cuando `relation` es 'secant'. */
  intersectionPoints: [Point, Point] | null
}

/**
 * Datos que, en el futuro, puede aportar el módulo Física a la escena
 * geométrica (posición y velocidad de llegada al aro). Por ahora Geometría
 * usa valores de ejemplo propios calculados con las mismas funciones de
 * `src/physics/`, no un modelo geométrico distinto ni duplicado (ver
 * `physicsBridge.ts`).
 */
export interface ApproachContext {
  distanceToHoop: number
  hoopHeight: number
  releaseHeight: number
  entryAngleDeg: number
  entrySpeed: number
}

/**
 * Estructura preparada para la futura "ventana geométrica de enceste"
 * (SKILL.md §7: "región de posiciones en la que el balón puede atravesar
 * el aro de acuerdo con las simplificaciones adoptadas"). El proyecto NO
 * define todavía qué margen o desviación cuenta como válido, así que este
 * tipo solo recoge las entradas que se necesitarán — no calcula ningún
 * criterio de enceste. Ver `entryWindow.ts`.
 */
export interface EntryWindowInputs {
  ballPosition: Point
  ballRadius: number
  hoopPosition: Point
  hoopRadius: number
  /** Contexto de la aproximación (de Física, vía `physicsBridge.ts`). */
  approach: ApproachContext
  /**
   * Desviación respecto a la posición geométrica ideal (cm). Siempre
   * `null` por ahora: el proyecto no define todavía qué cuenta como
   * "posición ideal" ni el margen de enceste (SKILL.md §6-7), así que no
   * se calcula ningún número — inventarlo violaría esa misma sección.
   * Cuando exista ese criterio, `entryWindow.ts` lo calculará aquí.
   */
  deviation: number | null
}
