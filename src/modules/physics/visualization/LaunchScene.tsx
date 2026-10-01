import { useMemo } from 'react'
import { degToRad, positionAt, sampleTrajectory } from '../../../physics/trajectory'
import type { LaunchParams, LaunchResults } from '../../../physics/types'
import { formatNumber } from '../../../format'
import { PlayerFigure } from './PlayerFigure'
import { PLAYER_HAND_LOCAL } from './playerGeometry'
import './LaunchScene.css'

interface LaunchSceneProps {
  params: LaunchParams
  results: LaunchResults
  currentTime: number
}

const VIEW_WIDTH = 1000
const VIEW_HEIGHT = 620
const PADDING = { top: 56, right: 56, bottom: 92, left: 92 }

/**
 * Escena principal del lanzamiento: jugador → balón → trayectoria → aro,
 * calculada a partir del modelo físico (no una animación decorativa). La
 * geometría de pantalla es puramente de presentación; ninguna cifra física
 * se calcula aquí, todo llega ya resuelto desde `src/physics/`.
 */
export function LaunchScene({ params, results, currentTime }: LaunchSceneProps) {
  const scene = useMemo(() => {
    const usableWidth = VIEW_WIDTH - PADDING.left - PADDING.right
    const usableHeight = VIEW_HEIGHT - PADDING.top - PADDING.bottom

    const worldWidth = Math.max(results.range, params.distanceToHoop, 1) * 1.15
    const worldHeight = Math.max(results.maxHeight, params.hoopHeight, params.releaseHeight, 1) * 1.3

    const scale = Math.min(usableWidth / worldWidth, usableHeight / worldHeight)
    const groundY = VIEW_HEIGHT - PADDING.bottom

    const toScreenX = (x: number) => PADDING.left + x * scale
    const toScreenY = (y: number) => groundY - y * scale

    const points = sampleTrajectory(params, results.flightTime, 140)
    const pathD = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${toScreenX(point.x).toFixed(2)} ${toScreenY(point.y).toFixed(2)}`)
      .join(' ')

    const ballPosition = positionAt(params, currentTime)
    const launchScreen = { x: toScreenX(0), y: toScreenY(params.releaseHeight) }
    const hoopScreen = { x: toScreenX(params.distanceToHoop), y: toScreenY(params.hoopHeight) }
    const ballScreen = { x: toScreenX(ballPosition.x), y: toScreenY(ballPosition.y) }

    // El vector arranca en el borde del balón (no en su centro) para no
    // dibujarse encima y confundirse visualmente con él.
    const ballRadius = 11
    const vectorLength = 80
    const angleRad = degToRad(params.launchAngleDeg)
    const vectorStart = {
      x: launchScreen.x + ballRadius * Math.cos(angleRad),
      y: launchScreen.y - ballRadius * Math.sin(angleRad),
    }
    const vectorEnd = {
      x: vectorStart.x + vectorLength * Math.cos(angleRad),
      y: vectorStart.y - vectorLength * Math.sin(angleRad),
    }
    const arcRadius = 42
    const arcEnd = {
      x: launchScreen.x + arcRadius * Math.cos(angleRad),
      y: launchScreen.y - arcRadius * Math.sin(angleRad),
    }

    const distanceLineY = groundY + 36
    const heightLineX = launchScreen.x - 46

    // La figura del jugador tiene su propia proporción (metros, ver
    // PlayerFigure); se escala de forma uniforme para que su mano quede
    // exactamente en el punto de liberación (0, y0) del modelo.
    const reachScale = params.releaseHeight > 0 ? params.releaseHeight / PLAYER_HAND_LOCAL.y : 0
    const playerScale = scale * reachScale
    const playerFeetX = launchScreen.x - PLAYER_HAND_LOCAL.x * playerScale

    return {
      groundY,
      rightEdge: PADDING.left + usableWidth,
      pathD,
      launchScreen,
      hoopScreen,
      ballScreen,
      vectorStart,
      vectorEnd,
      arcEnd,
      distanceLineY,
      heightLineX,
      playerScale,
      playerFeetX,
    }
  }, [params, results, currentTime])

  return (
    <svg
      className="launch-scene"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role="img"
      aria-label={`Escena de lanzamiento: velocidad inicial ${formatNumber(params.initialSpeed, 1)} metros por segundo, ángulo ${formatNumber(params.launchAngleDeg, 0)} grados`}
    >
      <defs>
        <marker id="vector-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-glow-blue)" />
        </marker>
        <filter id="trajectory-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ejes */}
      <line className="launch-scene__axis" x1={PADDING.left} y1={scene.groundY} x2={scene.rightEdge} y2={scene.groundY} />
      <line className="launch-scene__axis" x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={scene.groundY} />

      {/* Nivel de altura del aro, de referencia */}
      <line className="launch-scene__guide" x1={PADDING.left} y1={scene.hoopScreen.y} x2={scene.hoopScreen.x} y2={scene.hoopScreen.y} />

      {/* Trayectoria calculada */}
      <path className="launch-scene__path" d={scene.pathD} filter="url(#trajectory-glow)" />

      {/* Jugador: en segundo plano frente al balón y la trayectoria, que son
          el elemento científico central de la escena */}
      <g
        className="launch-scene__player-group"
        transform={`translate(${scene.playerFeetX} ${scene.groundY}) scale(${scene.playerScale} ${-scene.playerScale})`}
      >
        <PlayerFigure />
      </g>

      {/* Vector de velocidad inicial, arrancando en el borde del balón */}
      <line
        className="launch-scene__vector"
        x1={scene.vectorStart.x}
        y1={scene.vectorStart.y}
        x2={scene.vectorEnd.x}
        y2={scene.vectorEnd.y}
        markerEnd="url(#vector-arrowhead)"
      />
      <path
        className="launch-scene__angle-arc"
        d={`M ${scene.launchScreen.x + 42} ${scene.launchScreen.y} A 42 42 0 0 0 ${scene.arcEnd.x} ${scene.arcEnd.y}`}
      />
      <text className="launch-scene__label" x={scene.launchScreen.x + 54} y={scene.launchScreen.y - 18}>
        θ = {formatNumber(params.launchAngleDeg, 0)}°
      </text>
      <text className="launch-scene__label" x={scene.vectorEnd.x + 8} y={scene.vectorEnd.y - 8}>
        V₀ = {formatNumber(params.initialSpeed, 1)} m/s
      </text>

      {/* Aro: poste (con perspectiva, ligeramente retrasado), brazo de
          soporte, tablero con cuadro interior, red y sombra sutil */}
      <g className="launch-scene__hoop">
        <line
          x1={scene.hoopScreen.x + 14}
          y1={scene.groundY}
          x2={scene.hoopScreen.x + 14}
          y2={scene.hoopScreen.y - 18}
          className="launch-scene__hoop-pole"
        />
        <path
          className="launch-scene__hoop-brace"
          d={`M ${scene.hoopScreen.x + 14} ${scene.hoopScreen.y - 44} L ${scene.hoopScreen.x + 2} ${scene.hoopScreen.y - 12} M ${scene.hoopScreen.x + 14} ${scene.hoopScreen.y - 18} L ${scene.hoopScreen.x + 2} ${scene.hoopScreen.y - 18}`}
        />

        <rect
          x={scene.hoopScreen.x - 3}
          y={scene.hoopScreen.y - 58}
          width={6}
          height={42}
          rx={1}
          className="launch-scene__backboard"
        />
        <rect
          x={scene.hoopScreen.x - 3}
          y={scene.hoopScreen.y - 34}
          width={6}
          height={11}
          className="launch-scene__backboard-square"
        />

        <ellipse cx={scene.hoopScreen.x + 3} cy={scene.hoopScreen.y + 3} rx={20} ry={4} className="launch-scene__hoop-shadow" />
        <ellipse cx={scene.hoopScreen.x} cy={scene.hoopScreen.y} rx={22} ry={5} className="launch-scene__hoop-rim" />

        <path
          className="launch-scene__net"
          d={[-18, -11, -4, 3, 10, 18]
            .map((offset) => {
              const topX = scene.hoopScreen.x + offset
              const bottomX = scene.hoopScreen.x + offset * 0.45
              const midX = scene.hoopScreen.x + offset * 0.85
              return `M ${topX} ${scene.hoopScreen.y + 1} Q ${midX} ${scene.hoopScreen.y + 15} ${bottomX} ${scene.hoopScreen.y + 27}`
            })
            .join(' ')}
        />
      </g>

      {/* Balón animado */}
      <g className="launch-scene__ball" transform={`translate(${scene.ballScreen.x} ${scene.ballScreen.y})`}>
        <circle r={11} className="launch-scene__ball-fill" />
        <path
          d="M -11 0 H 11 M 0 -11 V 11 M -7.8 -7.8 Q 0 0 -7.8 7.8 M 7.8 -7.8 Q 0 0 7.8 7.8"
          className="launch-scene__ball-seams"
        />
      </g>

      {/* Distancia horizontal */}
      <g className="launch-scene__dimension">
        <line x1={PADDING.left} y1={scene.distanceLineY} x2={scene.hoopScreen.x} y2={scene.distanceLineY} />
        <line x1={PADDING.left} y1={scene.distanceLineY - 6} x2={PADDING.left} y2={scene.distanceLineY + 6} />
        <line x1={scene.hoopScreen.x} y1={scene.distanceLineY - 6} x2={scene.hoopScreen.x} y2={scene.distanceLineY + 6} />
        <text x={(PADDING.left + scene.hoopScreen.x) / 2} y={scene.distanceLineY + 22} textAnchor="middle">
          d = {formatNumber(params.distanceToHoop, 2)} m
        </text>
      </g>

      {/* Altura de liberación */}
      <g className="launch-scene__dimension">
        <line x1={scene.heightLineX} y1={scene.groundY} x2={scene.heightLineX} y2={scene.launchScreen.y} />
        <line x1={scene.heightLineX - 6} y1={scene.groundY} x2={scene.heightLineX + 6} y2={scene.groundY} />
        <line x1={scene.heightLineX - 6} y1={scene.launchScreen.y} x2={scene.heightLineX + 6} y2={scene.launchScreen.y} />
        <text x={scene.heightLineX - 10} y={(scene.groundY + scene.launchScreen.y) / 2} textAnchor="end" dominantBaseline="middle">
          y₀ = {formatNumber(params.releaseHeight, 2)} m
        </text>
      </g>
    </svg>
  )
}
