import { formatNumber } from '../../../format'
import { LAUNCH_LIMITS } from '../../../physics/constants'
import type { LaunchParams } from '../../../physics/types'
import type { AiQueryKey } from '../hooks/useAiQuery'
import '../../physics/components/ParameterControls.css'
import './AiQueryControls.css'

interface AiQueryControlsProps {
  params: LaunchParams
  onChange: (key: AiQueryKey, value: number) => void
  onReset: () => void
}

const SLIDERS: Array<{ key: AiQueryKey; symbol: string; label: string; unit: string; digits: number }> = [
  { key: 'initialSpeed', symbol: 'V₀', label: 'Velocidad inicial', unit: 'm/s', digits: 1 },
  { key: 'launchAngleDeg', symbol: 'θ', label: 'Ángulo de lanzamiento', unit: '°', digits: 0 },
  { key: 'releaseHeight', symbol: 'y₀', label: 'Altura inicial', unit: 'm', digits: 2 },
  { key: 'distanceToHoop', symbol: 'd', label: 'Distancia al aro', unit: 'm', digits: 2 },
]

/** Panel de entrada V0/θ/y0/d compartido por "Análisis inteligente" y "Explorar configuraciones" — una sola configuración alimenta ambas herramientas. */
export function AiQueryControls({ params, onChange, onReset }: AiQueryControlsProps) {
  return (
    <div className="ai-query-controls parameter-controls">
      <div className="parameter-controls__header">
        <span className="parameter-controls__hint">Configuración analizada por la IA</span>
        <button type="button" className="parameter-controls__reset" onClick={onReset}>
          Restablecer
        </button>
      </div>

      {SLIDERS.map(({ key, symbol, label, unit, digits }) => {
        const limits = LAUNCH_LIMITS[key]
        const value = params[key]
        return (
          <label className="parameter-controls__row" key={key}>
            <div className="parameter-controls__row-header">
              <span className="parameter-controls__label">
                <span className="parameter-controls__symbol">{symbol}</span>
                {label}
              </span>
              <span className="parameter-controls__readout">
                {formatNumber(value, digits)}
                <span className="parameter-controls__unit">{unit}</span>
              </span>
            </div>
            <input
              type="range"
              min={limits.min}
              max={limits.max}
              step={limits.step}
              value={value}
              onChange={(event) => onChange(key, Number(event.target.value))}
            />
          </label>
        )
      })}
    </div>
  )
}
