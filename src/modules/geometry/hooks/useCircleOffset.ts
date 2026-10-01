import { useMemo, useState } from 'react'
import { classifyCircleRelation } from '../../../geometry/circleRelations'
import { BALL_RADIUS, HOOP_RADIUS, OFFSET_LIMITS } from '../../../geometry/constants'
import type { Circle } from '../../../geometry/types'

export interface CircleOffset {
  dx: number
  dy: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

// Un pequeño desplazamiento por defecto (no exactamente 0,0) evita el caso
// degenerado de centros coincidentes, donde las etiquetas de ambos centros
// se dibujarían superpuestas; sigue siendo un caso "interior" claro.
const DEFAULT_OFFSET: CircleOffset = { dx: 0.05, dy: 0 }

/**
 * Posición del centro del balón respecto al centro del aro (ambos en el
 * origen de su propio sistema local, en metros). La clasificación
 * geométrica se recalcula siempre a partir de los radios reales y la
 * distancia resultante — nunca de una etiqueta o caso elegido a mano.
 */
export function useCircleOffset() {
  const [offset, setOffset] = useState<CircleOffset>(DEFAULT_OFFSET)

  function updateOffset(key: keyof CircleOffset, value: number) {
    if (Number.isNaN(value)) return
    const { min, max } = OFFSET_LIMITS[key]
    setOffset((prev) => ({ ...prev, [key]: clamp(value, min, max) }))
  }

  /** Fija dx y dy a la vez (arrastre libre del balón sobre la escena). */
  function setOffsetXY(dx: number, dy: number) {
    if (Number.isNaN(dx) || Number.isNaN(dy)) return
    setOffset({
      dx: clamp(dx, OFFSET_LIMITS.dx.min, OFFSET_LIMITS.dx.max),
      dy: clamp(dy, OFFSET_LIMITS.dy.min, OFFSET_LIMITS.dy.max),
    })
  }

  function reset() {
    setOffset(DEFAULT_OFFSET)
  }

  const hoopCircle: Circle = useMemo(() => ({ cx: 0, cy: 0, r: HOOP_RADIUS }), [])
  const ballCircle: Circle = useMemo(
    () => ({ cx: offset.dx, cy: offset.dy, r: BALL_RADIUS }),
    [offset.dx, offset.dy],
  )
  const relation = useMemo(() => classifyCircleRelation(ballCircle, hoopCircle), [ballCircle, hoopCircle])

  return { offset, updateOffset, setOffsetXY, reset, hoopCircle, ballCircle, relation }
}
