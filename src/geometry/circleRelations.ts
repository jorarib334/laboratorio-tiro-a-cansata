import type { Circle, CircleRelation, CircleRelationResult, Point } from './types'

/**
 * Tolerancia para considerar dos circunferencias tangentes (en vez de
 * exigir una igualdad exacta de coma flotante). Un valor pequeño pero
 * geométricamente razonable (3 mm) para que arrastrar el balón o mover un
 * slider pueda alcanzar de verdad una tangencia, sin que una imprecisión
 * mínima de posición lo impida.
 */
export const RELATION_TOLERANCE = 0.003

export function distanceBetweenCenters(a: Circle, b: Circle): number {
  return Math.hypot(b.cx - a.cx, b.cy - a.cy)
}

/**
 * Punto de tangencia entre dos circunferencias tangentes (exterior o
 * interiormente). Se apoya en que, en ambos casos, el punto de tangencia
 * está alineado con los dos centros: a distancia r1 de `a` en dirección a
 * `b` para tangencia exterior, y a distancia r1 de `a` en esa misma
 * dirección para tangencia interior (cuando b es la circunferencia menor
 * contenida, la distancia r1 = d + r2 cae exactamente sobre b).
 */
function tangencyPointAlongCenters(a: Circle, b: Circle, distance: number): Point | null {
  if (distance < 1e-9) return null
  const ux = (b.cx - a.cx) / distance
  const uy = (b.cy - a.cy) / distance
  return { x: a.cx + a.r * ux, y: a.cy + a.r * uy }
}

/**
 * Puntos de intersección de dos circunferencias secantes (fórmula estándar
 * de geometría euclídea: intersección de dos circunferencias a partir de
 * sus centros y radios). Devuelve `null` si no hay dos puntos reales.
 */
export function circleIntersectionPoints(a: Circle, b: Circle): [Point, Point] | null {
  const d = distanceBetweenCenters(a, b)
  if (d < 1e-9) return null

  const aDist = (d * d + a.r * a.r - b.r * b.r) / (2 * d)
  const hSquared = a.r * a.r - aDist * aDist
  if (hSquared < 0) return null
  const h = Math.sqrt(hSquared)

  const ux = (b.cx - a.cx) / d
  const uy = (b.cy - a.cy) / d
  const midX = a.cx + aDist * ux
  const midY = a.cy + aDist * uy
  const perpX = -uy
  const perpY = ux

  return [
    { x: midX + h * perpX, y: midY + h * perpY },
    { x: midX - h * perpX, y: midY - h * perpY },
  ]
}

/**
 * Clasifica la posición relativa de dos circunferencias comparando la
 * distancia entre centros con la suma y la diferencia de radios — la
 * construcción estándar de Dibujo Técnico para posiciones relativas de
 * circunferencias (SKILL.md §6). No es una interpretación de "enceste":
 * es la relación geométrica entre las dos circunferencias, sin más.
 */
export function classifyCircleRelation(a: Circle, b: Circle, tolerance = RELATION_TOLERANCE): CircleRelationResult {
  const distance = distanceBetweenCenters(a, b)
  const sumRadii = a.r + b.r
  const diffRadii = Math.abs(a.r - b.r)

  let relation: CircleRelation
  let tangencyPoint: Point | null = null
  let intersectionPoints: [Point, Point] | null = null

  if (distance <= tolerance) {
    relation = 'concentric'
  } else if (Math.abs(distance - sumRadii) <= tolerance) {
    relation = 'tangent-exterior'
    tangencyPoint = tangencyPointAlongCenters(a, b, distance)
  } else if (distance > sumRadii) {
    relation = 'exterior'
  } else if (Math.abs(distance - diffRadii) <= tolerance) {
    relation = 'tangent-interior'
    // El punto de tangencia interior se alcanza recorriendo el radio de la
    // circunferencia MAYOR hacia la menor (al revés, con la menor, el
    // punto calculado no cae sobre ninguna de las dos circunferencias).
    tangencyPoint = a.r >= b.r ? tangencyPointAlongCenters(a, b, distance) : tangencyPointAlongCenters(b, a, distance)
  } else if (distance < diffRadii) {
    relation = 'interior'
  } else {
    relation = 'secant'
    intersectionPoints = circleIntersectionPoints(a, b)
  }

  return { relation, distance, sumRadii, diffRadii, tangencyPoint, intersectionPoints }
}

export const CIRCLE_RELATION_LABELS: Record<CircleRelation, string> = {
  exterior: 'Exteriores (separadas)',
  'tangent-exterior': 'Tangentes exteriormente',
  secant: 'Secantes (se cortan en dos puntos)',
  'tangent-interior': 'Tangentes interiormente',
  interior: 'Interior (una contenida en la otra)',
  concentric: 'Concéntricas',
}

export const CIRCLE_RELATION_CONDITIONS: Record<CircleRelation, string> = {
  exterior: 'd > r_aro + r_balón',
  'tangent-exterior': 'd = r_aro + r_balón',
  secant: '|r_aro − r_balón| < d < r_aro + r_balón',
  'tangent-interior': 'd = |r_aro − r_balón|',
  interior: 'd < |r_aro − r_balón|',
  concentric: 'd = 0',
}

