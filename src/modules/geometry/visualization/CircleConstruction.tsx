import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { formatNumber } from '../../../format'
import type { Circle, CircleRelationResult } from '../../../geometry/types'
import './CircleConstruction.css'

interface CircleConstructionProps {
  ballCircle: Circle
  hoopCircle: Circle
  relation: CircleRelationResult
  /** Si se indica, el balón puede arrastrarse directamente sobre la escena. */
  onDragOffset?: (dx: number, dy: number) => void
}

const VIEW_SIZE = 440
const CENTER = { x: VIEW_SIZE / 2, y: VIEW_SIZE / 2 }
const SCALE = 340

/**
 * Construcción de Dibujo Técnico: circunferencias del balón y del aro, más
 * las líneas auxiliares que correspondan al estado actual (no todas a la
 * vez). Deliberadamente SIN etiquetas de texto para C/R — esa información
 * vive en `GeometryLegend`, fuera de la construcción, para que el dibujo
 * principal quede limpio y el punto de tangencia (cuando existe) sea lo
 * primero que se ve. Todo se deriva de `ballCircle`/`hoopCircle`/`relation`
 * (calculados en `src/geometry/`); este componente solo dibuja.
 */
export function CircleConstruction({ ballCircle, hoopCircle, relation, onDragOffset }: CircleConstructionProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{ startScreenX: number; startScreenY: number; startDx: number; startDy: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const scene = useMemo(() => {
    const toScreen = (x: number, y: number) => ({ x: CENTER.x + x * SCALE, y: CENTER.y - y * SCALE })

    const hoopScreen = { ...toScreen(hoopCircle.cx, hoopCircle.cy), r: hoopCircle.r * SCALE }
    const ballScreen = { ...toScreen(ballCircle.cx, ballCircle.cy), r: ballCircle.r * SCALE }

    const dx = ballCircle.cx - hoopCircle.cx
    const dy = ballCircle.cy - hoopCircle.cy
    const hasDirection = relation.distance > 1e-6
    const ux = hasDirection ? dx / relation.distance : 1
    const uy = hasDirection ? dy / relation.distance : 0

    const hoopRadiusEdge = toScreen(hoopCircle.cx + ux * hoopCircle.r, hoopCircle.cy + uy * hoopCircle.r)
    const ballRadiusEdge = toScreen(ballCircle.cx - ux * ballCircle.r, ballCircle.cy - uy * ballCircle.r)

    const midX = (hoopScreen.x + ballScreen.x) / 2
    const midY = (hoopScreen.y + ballScreen.y) / 2
    // Etiqueta de distancia desplazada perpendicularmente a la línea de
    // centros, para que no quede escrita encima de ella.
    const perpX = -uy
    const perpY = -ux
    const distanceLabel = { x: midX + perpX * 16, y: midY + perpY * 16 }

    const tangencyScreen = relation.tangencyPoint ? toScreen(relation.tangencyPoint.x, relation.tangencyPoint.y) : null
    const intersectionScreen = relation.intersectionPoints
      ? ([toScreen(relation.intersectionPoints[0].x, relation.intersectionPoints[0].y), toScreen(relation.intersectionPoints[1].x, relation.intersectionPoints[1].y)] as const)
      : null

    return { hoopScreen, ballScreen, hoopRadiusEdge, ballRadiusEdge, distanceLabel, tangencyScreen, intersectionScreen }
  }, [ballCircle, hoopCircle, relation])

  function handlePointerDown(event: ReactPointerEvent<SVGCircleElement>) {
    if (!onDragOffset) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      startScreenX: event.clientX,
      startScreenY: event.clientY,
      startDx: ballCircle.cx,
      startDy: ballCircle.cy,
    }
    setIsDragging(true)
  }

  function handlePointerMove(event: ReactPointerEvent<SVGCircleElement>) {
    const drag = dragRef.current
    if (!drag || !onDragOffset || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const screenToViewBox = VIEW_SIZE / rect.width
    const deltaWorldX = ((event.clientX - drag.startScreenX) * screenToViewBox) / SCALE
    const deltaWorldY = (-(event.clientY - drag.startScreenY) * screenToViewBox) / SCALE
    onDragOffset(drag.startDx + deltaWorldX, drag.startDy + deltaWorldY)
  }

  function handlePointerUp() {
    dragRef.current = null
    setIsDragging(false)
  }

  const showRadii = relation.relation === 'tangent-exterior' || relation.relation === 'tangent-interior' || relation.relation === 'secant'
  const showTangency = relation.tangencyPoint !== null
  const showIntersection = relation.relation === 'secant' && relation.intersectionPoints !== null

  return (
    <svg
      ref={svgRef}
      className="circle-construction"
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      role="img"
      aria-label="Construcción geométrica entre las circunferencias del balón y del aro"
    >
      {/* Circunferencias: siempre visibles, son la representación base */}
      <circle className="circle-construction__hoop" cx={scene.hoopScreen.x} cy={scene.hoopScreen.y} r={scene.hoopScreen.r} />
      <circle
        className={`circle-construction__ball${isDragging ? ' circle-construction__ball--dragging' : ''}`}
        cx={scene.ballScreen.x}
        cy={scene.ballScreen.y}
        r={scene.ballScreen.r}
        style={onDragOffset ? { cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' } : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      {/* Construcción auxiliar: solo la relevante para el estado actual,
          sin etiquetas de texto (C/R/etc. viven en la leyenda aparte).
          Pequeña animación de entrada al cambiar de estado. */}
      <g key={relation.relation} className="circle-construction__aux">
        <line
          className="circle-construction__center-line"
          x1={scene.hoopScreen.x}
          y1={scene.hoopScreen.y}
          x2={scene.ballScreen.x}
          y2={scene.ballScreen.y}
        />
        <circle className="circle-construction__center-dot" cx={scene.hoopScreen.x} cy={scene.hoopScreen.y} r={3.5} />
        <circle className="circle-construction__center-dot" cx={scene.ballScreen.x} cy={scene.ballScreen.y} r={3.5} />

        <text className="circle-construction__distance" x={scene.distanceLabel.x} y={scene.distanceLabel.y} textAnchor="middle">
          d = {formatNumber(relation.distance, 3)} m
        </text>

        {showRadii && (
          <>
            <line
              className="circle-construction__radius-line"
              x1={scene.hoopScreen.x}
              y1={scene.hoopScreen.y}
              x2={scene.hoopRadiusEdge.x}
              y2={scene.hoopRadiusEdge.y}
            />
            <line
              className="circle-construction__radius-line"
              x1={scene.ballScreen.x}
              y1={scene.ballScreen.y}
              x2={scene.ballRadiusEdge.x}
              y2={scene.ballRadiusEdge.y}
            />
          </>
        )}

        {showTangency && scene.tangencyScreen && (
          <g className="circle-construction__tangency">
            <circle className="circle-construction__tangency-halo" cx={scene.tangencyScreen.x} cy={scene.tangencyScreen.y} r={11} />
            <circle className="circle-construction__tangency-point" cx={scene.tangencyScreen.x} cy={scene.tangencyScreen.y} r={4.5} />
            <text x={scene.tangencyScreen.x + 14} y={scene.tangencyScreen.y - 12}>
              Punto de tangencia
            </text>
          </g>
        )}

        {showIntersection && scene.intersectionScreen && (
          <g className="circle-construction__intersection">
            <line
              className="circle-construction__chord"
              x1={scene.intersectionScreen[0].x}
              y1={scene.intersectionScreen[0].y}
              x2={scene.intersectionScreen[1].x}
              y2={scene.intersectionScreen[1].y}
            />
            <circle cx={scene.intersectionScreen[0].x} cy={scene.intersectionScreen[0].y} r={4} />
            <circle cx={scene.intersectionScreen[1].x} cy={scene.intersectionScreen[1].y} r={4} />
          </g>
        )}
      </g>
    </svg>
  )
}
