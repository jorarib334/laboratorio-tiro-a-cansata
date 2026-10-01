import { LAUNCH_LIMITS } from '../../../physics/constants'
import type { LaunchParams } from '../../../physics/types'
import { formatNumber } from '../../../format'
import './ParameterControls.css'

interface ParameterControlsProps {
  params: LaunchParams
  onChange: (key: keyof typeof LAUNCH_LIMITS, value: number) => void
  onReset: () => void
}

const SLIDERS: Array<{ key: keyof typeof LAUNCH_LIMITS; symbol: string; label: string; unit: string; digits: number }> = [
  { key: 'initialSpeed', symbol: 'V₀', label: 'Velocidad inicial', unit: 'm/s', digits: 1 },
  { key: 'launchAngleDeg', symbol: 'θ', label: 'Ángulo de lanzamiento', unit: '°', digits: 0 },
  { key: 'releaseHeight', symbol: 'y₀', label: 'Altura inicial', unit: 'm', digits: 2 },
  { key: 'distanceToHoop', symbol: 'd', label: 'Distancia al aro', unit: 'm', digits: 2 },
  { key: 'hoopHeight', symbol: 'hₐᵣₒ', label: 'Altura del aro', unit: 'm', digits: 2 },
]

export function ParameterControls({ params, onChange, onReset }: ParameterControlsProps) {
  return (
    <div className="parameter-controls">
      <div className="parameter-controls__header">
        <span className="parameter-controls__hint">Ajusta y observa la escena en tiempo real</span>
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
