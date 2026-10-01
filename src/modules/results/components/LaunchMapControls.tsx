import type { LaunchMapsConfig } from '../hooks/useLaunchMaps'
import './LaunchMapControls.css'

interface LaunchMapControlsProps {
  config: LaunchMapsConfig
  onChange: (patch: Partial<LaunchMapsConfig>) => void
  onGenerate: () => void
}

/** Rango y resolución compartidos por el mapa de eficacia y el de tolerancia — un único control, ambos mapas usan siempre el mismo dominio θ×V0. */
export function LaunchMapControls({ config, onChange, onGenerate }: LaunchMapControlsProps) {
  return (
    <div className="launch-map-controls">
      <label>
        θ mínimo
        <input type="number" value={config.angleMin} min={5} max={config.angleMax - 1} onChange={(event) => onChange({ angleMin: Number(event.target.value) })} />
      </label>
      <label>
        θ máximo
        <input type="number" value={config.angleMax} min={config.angleMin + 1} max={85} onChange={(event) => onChange({ angleMax: Number(event.target.value) })} />
      </label>
      <label>
        V₀ mínimo
        <input
          type="number"
          value={config.speedMin}
          min={1}
          max={config.speedMax - 0.5}
          step={0.5}
          onChange={(event) => onChange({ speedMin: Number(event.target.value) })}
        />
      </label>
      <label>
        V₀ máximo
        <input
          type="number"
          value={config.speedMax}
          min={config.speedMin + 0.5}
          max={20}
          step={0.5}
          onChange={(event) => onChange({ speedMax: Number(event.target.value) })}
        />
      </label>
      <label>
        Resolución ({config.resolution}×{config.resolution})
        <input type="range" min={6} max={16} value={config.resolution} onChange={(event) => onChange({ resolution: Number(event.target.value) })} />
      </label>

      <button type="button" className="launch-map-controls__generate" onClick={onGenerate}>
        Generar mapas
      </button>
    </div>
  )
}
