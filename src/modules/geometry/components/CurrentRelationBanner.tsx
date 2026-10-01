import { CIRCLE_RELATION_LABELS } from '../../../geometry/circleRelations'
import type { CircleRelation } from '../../../geometry/types'
import './CurrentRelationBanner.css'

interface CurrentRelationBannerProps {
  relation: CircleRelation
}

/**
 * Estado detectado automáticamente a partir de la posición real del
 * balón — nunca seleccionado manualmente. Deliberadamente secundario
 * (línea compacta, no un titular): la construcción visual es la
 * protagonista. `key={relation}` reinicia la transición de entrada cada
 * vez que la clasificación cambia.
 */
export function CurrentRelationBanner({ relation }: CurrentRelationBannerProps) {
  return (
    <p className="current-relation-banner">
      <span className="current-relation-banner__eyebrow">Relación actual</span>
      <span key={relation} className="current-relation-banner__name">
        {CIRCLE_RELATION_LABELS[relation]}
      </span>
    </p>
  )
}
