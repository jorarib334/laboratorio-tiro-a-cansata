import { useMemo } from 'react'
import { sampleTrajectory } from '../../../physics/trajectory'
import { formatNumber } from '../../../format'
import { EXAMPLE_LAUNCH_RESULTS, EXAMPLE_PHYSICS_PARAMS } from '../exampleApproach'
import './ContextTrajectory.css'

const VIEW_WIDTH = 420
const VIEW_HEIGHT = 260
const PADDING = { top: 24, right: 24, bottom: 30, left: 24 }

/**
 * Vista general de orientación: de dónde procede el punto de llegada al
 * aro que se analiza en detalle junto a esta escena. Reutiliza las mismas
 * funciones de `src/physics/` con los valores por defecto del módulo
 * Física (ver `exampleApproach.ts`) — no duplica el modelo ni inventa una
 * trayectoria propia. Cuando los dos módulos se conecten, estos parámetros
 * de ejemplo se sustituirán por los que el usuario haya fijado en Física.
 */
export function ContextTrajectory() {
  const scene = useMemo(() => {
    const results = EXAMPLE_LAUNCH_RESULTS
    const usableWidth = VIEW_WIDTH - PADDING.left - PADDING.right
    const usableHeight = VIEW_HEIGHT - PADDING.top - PADDING.bottom

    const worldWidth = Math.max(results.range, EXAMPLE_PHYSICS_PARAMS.distanceToHoop, 1) * 1.1
    const worldHeight = Math.max(results.maxHeight, EXAMPLE_PHYSICS_PARAMS.hoopHeight, 1) * 1.25
    const scale = Math.min(usableWidth / worldWidth, usableHeight / worldHeight)
    const groundY = VIEW_HEIGHT - PADDING.bottom

    const toScreenX = (x: number) => PADDING.left + x * scale
    const toScreenY = (y: number) => groundY - y * scale

    const points = sampleTrajectory(EXAMPLE_PHYSICS_PARAMS, results.flightTime, 90)
    const pathD = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toScreenX(p.x).toFixed(2)} ${toScreenY(p.y).toFixed(2)}`)
      .join(' ')

    const entryPoint = { x: toScreenX(EXAMPLE_PHYSICS_PARAMS.distanceToHoop), y: toScreenY(EXAMPLE_PHYSICS_PARAMS.hoopHeight) }

    return { pathD, entryPoint, groundY, rightEdge: PADDING.left + usableWidth }
  }, [])

  return (
    <svg className="context-trajectory" viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} role="img" aria-label="Trayectoria de ejemplo llegando al aro">
      <line className="context-trajectory__ground" x1={PADDING.left} y1={scene.groundY} x2={scene.rightEdge} y2={scene.groundY} />
      <path className="context-trajectory__path" d={scene.pathD} />
      <circle className="context-trajectory__entry" cx={scene.entryPoint.x} cy={scene.entryPoint.y} r={5} />
      <line
        className="context-trajectory__guide"
        x1={scene.entryPoint.x}
        y1={scene.entryPoint.y}
        x2={scene.entryPoint.x}
        y2={scene.groundY}
      />
      <text className="context-trajectory__label" x={scene.entryPoint.x + 10} y={scene.entryPoint.y - 8}>
        Punto de entrada
      </text>
      <text className="context-trajectory__caption" x={PADDING.left} y={18}>
        Ejemplo con los valores por defecto de Física — d = {formatNumber(EXAMPLE_PHYSICS_PARAMS.distanceToHoop, 2)} m
      </text>
    </svg>
  )
}
