import { positionAt, velocityAt } from '../../../physics/trajectory'
import type { LaunchParams } from '../../../physics/types'
import { formatNumber } from '../../../format'
import './LiveTelemetry.css'

interface LiveTelemetryProps {
  params: LaunchParams
  currentTime: number
}

/** Lectura en vivo de la posición y velocidad del balón durante la animación. */
export function LiveTelemetry({ params, currentTime }: LiveTelemetryProps) {
  const position = positionAt(params, currentTime)
  const velocity = velocityAt(params, currentTime)
  const speed = Math.hypot(velocity.vx, velocity.vy)

  return (
    <div className="live-telemetry" role="status">
      <div className="live-telemetry__item">
        <span className="live-telemetry__label">t</span>
        <span className="live-telemetry__value">{formatNumber(currentTime, 2)} s</span>
      </div>
      <div className="live-telemetry__item">
        <span className="live-telemetry__label">Posición</span>
        <span className="live-telemetry__value">
          x {formatNumber(position.x, 2)} m · y {formatNumber(position.y, 2)} m
        </span>
      </div>
      <div className="live-telemetry__item">
        <span className="live-telemetry__label">Velocidad</span>
        <span className="live-telemetry__value">
          Vx {formatNumber(velocity.vx, 2)} · Vy {formatNumber(velocity.vy, 2)} m/s
        </span>
      </div>
      <div className="live-telemetry__item">
        <span className="live-telemetry__label">|v|</span>
        <span className="live-telemetry__value">{formatNumber(speed, 2)} m/s</span>
      </div>
    </div>
  )
}
