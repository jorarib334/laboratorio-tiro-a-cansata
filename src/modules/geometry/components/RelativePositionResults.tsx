import type { CircleRelationResult } from '../../../geometry/types'
import { formatNumber } from '../../../format'
import { StepLabel } from '../../../components/StepLabel/StepLabel'
import './RelativePositionResults.css'

interface RelativePositionResultsProps {
  relation: CircleRelationResult
}

/**
 * El nombre del estado detectado ya se muestra, grande, en
 * `CurrentRelationBanner`; aquí solo quedan las magnitudes numéricas que
 * lo justifican.
 */
export function RelativePositionResults({ relation }: RelativePositionResultsProps) {
  return (
    <div className="relative-position-results">
      <StepLabel step={3} accentVar="--color-geometry">
        Magnitudes
      </StepLabel>

      <dl className="relative-position-results__grid">
        <div>
          <dt>Distancia entre centros (d)</dt>
          <dd>{formatNumber(relation.distance, 3)} m</dd>
        </div>
        <div>
          <dt>Suma de radios (r_aro + r_balón)</dt>
          <dd>{formatNumber(relation.sumRadii, 3)} m</dd>
        </div>
        <div>
          <dt>Diferencia de radios (|r_aro − r_balón|)</dt>
          <dd>{formatNumber(relation.diffRadii, 3)} m</dd>
        </div>
      </dl>

      <p className="relative-position-results__note">
        Esta clasificación es puramente geométrica (posición relativa de dos circunferencias). El
        proyecto todavía no define una condición de enceste a partir de ella — eso pertenece a un
        criterio pendiente de concretar (SKILL.md §6-7).
      </p>
    </div>
  )
}
