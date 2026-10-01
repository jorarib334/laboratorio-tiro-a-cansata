import { OFFSET_LIMITS } from '../../../geometry/constants'
import { formatNumber } from '../../../format'
import type { CircleOffset } from '../hooks/useCircleOffset'
import './RelativePositionControls.css'

interface RelativePositionControlsProps {
  offset: CircleOffset
  onChange: (key: keyof CircleOffset, value: number) => void
  onReset: () => void
}

const SLIDERS: Array<{ key: keyof CircleOffset; symbol: string; label: string }> = [
  { key: 'dx', symbol: 'Δx', label: 'Desplazamiento horizontal del centro del balón' },
  { key: 'dy', symbol: 'Δy', label: 'Desplazamiento vertical del centro del balón' },
]

export function RelativePositionControls({ offset, onChange, onReset }: RelativePositionControlsProps) {
  return (
    <div className="relative-position-controls">
      <div className="relative-position-controls__header">
        <span className="relative-position-controls__hint">
          Arrastra el balón en la escena o ajusta los valores exactos aquí
        </span>
        <button type="button" className="relative-position-controls__reset" onClick={onReset}>
          Restablecer
        </button>
      </div>

      {SLIDERS.map(({ key, symbol, label }) => {
        const limits = OFFSET_LIMITS[key]
        const value = offset[key]
        return (
          <label className="relative-position-controls__row" key={key}>
            <div className="relative-position-controls__row-header">
              <span className="relative-position-controls__label">
                <span className="relative-position-controls__symbol">{symbol}</span>
                {label}
              </span>
              <span className="relative-position-controls__readout">
                {formatNumber(value, 3)}
                <span className="relative-position-controls__unit">m</span>
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
