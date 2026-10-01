/**
 * "Válido / no válido" no tiene una fórmula numérica en el proyecto:
 * `.claude/skills/laboratorio-tiro-canasta/SKILL.md` §6 nombra 4 etapas
 * conceptuales (trayectoria llega al aro, altura compatible, posición
 * geométricamente compatible, resultado final) pero no define las etapas
 * 2-3 con una fórmula. Para no inventar una "condición de enceste" nueva,
 * este archivo SOLO compone dos funciones que ya existen y ya están
 * validadas en el proyecto:
 *
 * 1. `computeHoopArrival` (Física): da la altura real del balón cuando su
 *    posición horizontal x(t) coincide con la distancia al aro.
 * 2. `classifyCircleRelation` (Geometría): da la relación geométrica real
 *    (exterior/tangente/secante/interior) entre dos circunferencias.
 *
 * La composición: se trata el desfase vertical entre la altura de llegada
 * del balón y la altura del aro como la "distancia entre centros" de dos
 * circunferencias con los radios reglamentarios ya usados en Geometría
 * (BALL_RADIUS, HOOP_RADIUS). El modelo físico es 2D (sin componente
 * lateral), así que ese desfase vertical es la única dimensión en la que
 * balón y aro pueden estar desalineados — no se ignora ningún eje.
 *
 * El único punto realmente interpretativo (y se deja así de explícito) es
 * qué relación geométrica cuenta como "válida": una circunferencia interior
 * o concéntrica a la otra (el balón cabe dentro del aro) se considera
 * válida; tangente interior es el límite; el resto, no válido.
 */

import { classifyCircleRelation } from '../geometry/circleRelations'
import { BALL_RADIUS, HOOP_RADIUS } from '../geometry/constants'
import { computeHoopArrival } from '../physics/results'
import type { LaunchParams } from '../physics/types'
import type { EfficacyCategory, ValidityAssessment, ValidityLabel } from './types'

export function assessValidity(params: LaunchParams): ValidityAssessment {
  const arrival = computeHoopArrival(params)
  const centersDistance = Math.abs(arrival.y - params.hoopHeight)

  const relationResult = classifyCircleRelation(
    { cx: 0, cy: 0, r: HOOP_RADIUS },
    { cx: 0, cy: centersDistance, r: BALL_RADIUS },
  )
  const clearance = HOOP_RADIUS - BALL_RADIUS - centersDistance

  let label: ValidityLabel
  if (!arrival.reachesHoop) {
    // El balón toca el suelo antes de llegar a la distancia horizontal del
    // aro: no hay relación geométrica que evaluar, el intento ya es no válido.
    label = 'invalid'
  } else if (relationResult.relation === 'interior' || relationResult.relation === 'concentric') {
    label = 'valid'
  } else if (relationResult.relation === 'tangent-interior') {
    label = 'boundary'
  } else {
    label = 'invalid'
  }

  return { label, relation: relationResult.relation, centersDistance, clearance }
}

/**
 * Cuarto nivel puramente visual para el mapa de eficacia (invalido / cerca
 * del límite / válido / margen alto): no es un criterio físico nuevo, es un
 * reparto en dos mitades del propio `clearance` ya calculado, para que el
 * mapa de calor distinga un acierto "justo" de uno "centrado y con margen".
 */
export function categorizeEfficacy(assessment: ValidityAssessment): EfficacyCategory {
  if (assessment.label !== 'valid') return assessment.label
  const maxClearance = HOOP_RADIUS - BALL_RADIUS
  const marginRatio = maxClearance > 0 ? assessment.clearance / maxClearance : 0
  return marginRatio > 0.5 ? 'high-margin' : 'valid'
}

export const VALIDITY_LABELS: Record<ValidityLabel, string> = {
  invalid: 'No válido',
  boundary: 'Límite',
  valid: 'Válido',
}

export const EFFICACY_LABELS: Record<EfficacyCategory, string> = {
  invalid: 'No válido',
  boundary: 'Cerca del límite',
  valid: 'Válido',
  'high-margin': 'Margen alto',
}

/** Colores del mismo family que los tokens del proyecto (ver `tokens.css`). */
export const EFFICACY_COLORS: Record<EfficacyCategory, string> = {
  invalid: '#8a3714',
  boundary: '#d9a441',
  valid: '#4f9d84',
  'high-margin': '#8fe6c2',
}
