import { formatNumber } from '../../../format'
import type { Circle, CircleRelationResult } from '../../../geometry/types'
import './GeometryLegend.css'

interface GeometryLegendProps {
  ballCircle: Circle
  hoopCircle: Circle
  relation: CircleRelationResult
}

/**
 * Leyenda técnica de las variables geométricas (C, R, d): vive fuera de la
 * construcción principal para que esta quede limpia (ver
 * `CircleConstruction`), pero la información sigue disponible.
 */
export function GeometryLegend({ ballCircle, hoopCircle, relation }: GeometryLegendProps) {
  return (
    <dl className="geometry-legend">
      <div className="geometry-legend__item">
        <dt>
          <span className="geometry-legend__swatch geometry-legend__swatch--dot" aria-hidden="true" />
          C<sub>balón</sub>
        </dt>
        <dd>
          ({formatNumber(ballCircle.cx, 3)}, {formatNumber(ballCircle.cy, 3)}) m
        </dd>
      </div>
      <div className="geometry-legend__item">
        <dt>
          <span className="geometry-legend__swatch geometry-legend__swatch--line" aria-hidden="true" />
          R<sub>balón</sub>
        </dt>
        <dd>{formatNumber(ballCircle.r, 3)} m</dd>
      </div>
      <div className="geometry-legend__item">
        <dt>
          <span className="geometry-legend__swatch geometry-legend__swatch--dot" aria-hidden="true" />
          C<sub>aro</sub>
        </dt>
        <dd>
          ({formatNumber(hoopCircle.cx, 3)}, {formatNumber(hoopCircle.cy, 3)}) m
        </dd>
      </div>
      <div className="geometry-legend__item">
        <dt>
          <span className="geometry-legend__swatch geometry-legend__swatch--line" aria-hidden="true" />
          R<sub>aro</sub>
        </dt>
        <dd>{formatNumber(hoopCircle.r, 4)} m</dd>
      </div>
      <div className="geometry-legend__item">
        <dt>
          <span className="geometry-legend__swatch geometry-legend__swatch--center-line" aria-hidden="true" />d
        </dt>
        <dd>{formatNumber(relation.distance, 3)} m</dd>
      </div>
    </dl>
  )
}
