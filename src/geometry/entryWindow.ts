import type { ApproachContext, Circle, EntryWindowInputs } from './types'

/**
 * Reúne los datos de entrada que necesitará la futura "ventana geométrica
 * de enceste" (SKILL.md §7). Es solo una función de forma de datos: no
 * calcula ningún criterio de validez ni margen, porque el proyecto todavía
 * no lo define (§6: "según las simplificaciones adoptadas", sin
 * concretar). Cuando exista ese criterio, se implementará como una función
 * aparte que consuma esta misma estructura, sin duplicar la geometría de
 * `circleRelations.ts`.
 */
export function buildEntryWindowInputs(ballCircle: Circle, hoopCircle: Circle, approach: ApproachContext): EntryWindowInputs {
  return {
    ballPosition: { x: ballCircle.cx, y: ballCircle.cy },
    ballRadius: ballCircle.r,
    hoopPosition: { x: hoopCircle.cx, y: hoopCircle.cy },
    hoopRadius: hoopCircle.r,
    approach,
    deviation: null,
  }
}
