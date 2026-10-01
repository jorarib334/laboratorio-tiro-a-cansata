import type { Circle, CircleRelationResult } from '../../../geometry/types'
import { CircleConstruction } from './CircleConstruction'
import { ContextTrajectory } from './ContextTrajectory'
import './GeometryScene.css'

interface GeometrySceneProps {
  ballCircle: Circle
  hoopCircle: Circle
  relation: CircleRelationResult
  onDragOffset: (dx: number, dy: number) => void
}

/**
 * Dos vistas, como en un plano técnico con detalle ampliado: la vista
 * general orienta (de dónde llega el balón), la vista de detalle es la
 * construcción geométrica real entre las dos circunferencias, a una
 * escala mucho mayor (los radios reales son de centímetros, no de metros
 * de recorrido). El balón puede arrastrarse directamente en la vista de
 * detalle.
 */
export function GeometryScene({ ballCircle, hoopCircle, relation, onDragOffset }: GeometrySceneProps) {
  return (
    <div className="geometry-scene">
      <div className="geometry-scene__panel geometry-scene__panel--context">
        <p className="geometry-scene__panel-label">Vista general</p>
        <ContextTrajectory />
      </div>
      <div className="geometry-scene__panel geometry-scene__panel--detail">
        <p className="geometry-scene__panel-label">Vista de detalle — arrastra el balón</p>
        <CircleConstruction ballCircle={ballCircle} hoopCircle={hoopCircle} relation={relation} onDragOffset={onDragOffset} />
      </div>
    </div>
  )
}
