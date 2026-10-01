import { STAGES, stageProgress } from './stages'
import './HeroTelemetry.css'

const RELEASE = { x: 150, y: 460 }
const HOOP = { x: 820, y: 180 }
const APEX = { x: 480, y: 60 }
const TRAJECTORY_D = `M ${RELEASE.x} ${RELEASE.y} Q ${APEX.x} ${APEX.y} ${HOOP.x} ${HOOP.y}`
const BALL_R = 22

interface HeroTelemetryProps {
  progress: number
}

/**
 * Capa científica superpuesta al vídeo, en HTML/SVG (nítida, no grabada en
 * el vídeo). No persigue al balón real fotograma a fotograma — no tenemos
 * esa posición, es vídeo, no una escena que dibujemos nosotros — sino que
 * se presenta como una lectura técnica discreta, en un único tono y trazos
 * finos, para no leerse como un HUD de videojuego.
 */
export function HeroTelemetry({ progress }: HeroTelemetryProps) {
  const scienceIn = stageProgress(progress, STAGES.science)
  const trajectoryIn = stageProgress(progress, STAGES.trajectory)
  const fadeOut = 1 - stageProgress(progress, STAGES.transition)

  return (
    <svg
      className="hero-telemetry"
      viewBox="0 0 1000 562"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      style={{ opacity: fadeOut }}
    >
      {/* Ejes y radio del balón */}
      <g style={{ opacity: scienceIn }}>
        <line x1="60" y1="480" x2="940" y2="480" className="hero-telemetry__line" />
        <line x1="90" y1="500" x2="90" y2="60" className="hero-telemetry__line" />
        <circle cx={RELEASE.x} cy={RELEASE.y} r={BALL_R} className="hero-telemetry__line" fill="none" />
        <line x1={RELEASE.x} y1={RELEASE.y} x2={RELEASE.x + BALL_R} y2={RELEASE.y} className="hero-telemetry__line" strokeDasharray="2 3" />
        <text x={RELEASE.x + BALL_R / 2 - 3} y={RELEASE.y - 6} className="hero-telemetry__label">
          r
        </text>

        <line x1={RELEASE.x} y1={RELEASE.y} x2={RELEASE.x + 70} y2={RELEASE.y - 78} className="hero-telemetry__line hero-telemetry__vector" />
        <text x={RELEASE.x + 74} y={RELEASE.y - 80} className="hero-telemetry__label">
          v₀
        </text>
        <path
          d={`M ${RELEASE.x + 34} ${RELEASE.y} A 34 34 0 0 0 ${RELEASE.x + 22} ${RELEASE.y - 27}`}
          className="hero-telemetry__line"
          fill="none"
        />
        <text x={RELEASE.x + 32} y={RELEASE.y - 12} className="hero-telemetry__label">
          θ
        </text>
      </g>

      {/* Trayectoria, líneas de proyección y distancia */}
      <g style={{ opacity: trajectoryIn }}>
        <path
          d={TRAJECTORY_D}
          fill="none"
          className="hero-telemetry__line hero-telemetry__trajectory"
          pathLength={1}
          style={{ strokeDashoffset: 1 - trajectoryIn }}
        />
        <line x1={HOOP.x} y1={HOOP.y} x2={HOOP.x} y2="480" className="hero-telemetry__line" strokeDasharray="2 4" />
        <line x1={RELEASE.x} y1="500" x2={HOOP.x} y2="500" className="hero-telemetry__line" strokeDasharray="2 4" />
        <text x={(RELEASE.x + HOOP.x) / 2 - 20} y="516" className="hero-telemetry__label">
          d = 6,75 m
        </text>
        <circle cx={HOOP.x} cy={HOOP.y} r="30" className="hero-telemetry__line" fill="none" />
      </g>
    </svg>
  )
}
