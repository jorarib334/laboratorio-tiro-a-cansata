import type { CSSProperties } from 'react'
import { formatNumber } from '../../../format'
import { LAUNCH_LIMITS } from '../../../physics/constants'
import type { LaunchParams } from '../../../physics/types'
import { EFFICACY_COLORS, EFFICACY_LABELS, categorizeEfficacy } from '../../../results/validity'
import type { SimulationResult } from '../../../results/types'
import { StepLabel } from '../../../components/StepLabel/StepLabel'
import { LaunchScene } from '../../physics/visualization/LaunchScene'
import type { ExplorerParamKey } from '../hooks/useResultsLab'
import '../../physics/components/ParameterControls.css'
import './LaunchExplorer.css'

interface LaunchExplorerProps {
  params: LaunchParams
  simulation: SimulationResult
  onChange: (key: ExplorerParamKey, value: number) => void
  onReset: () => void
}

const SLIDERS: Array<{ key: ExplorerParamKey; symbol: string; label: string; unit: string; digits: number }> = [
  { key: 'initialSpeed', symbol: 'V₀', label: 'Velocidad inicial', unit: 'm/s', digits: 1 },
  { key: 'launchAngleDeg', symbol: 'θ', label: 'Ángulo de lanzamiento', unit: '°', digits: 0 },
  { key: 'releaseHeight', symbol: 'y₀', label: 'Altura inicial', unit: 'm', digits: 2 },
  { key: 'distanceToHoop', symbol: 'd', label: 'Distancia al aro', unit: 'm', digits: 2 },
]

/**
 * Explorador interactivo: reutiliza `LaunchScene` (la misma escena 2D de
 * Física) y el mismo motor de simulación — solo añade la lectura de
 * validez/margen. No hay un formulario tradicional con botón "calcular": el
 * resultado se actualiza al mover cada control.
 */
export function LaunchExplorer({ params, simulation, onChange, onReset }: LaunchExplorerProps) {
  const category = categorizeEfficacy(simulation.validity)
  const verdictStyle = { '--verdict-color': EFFICACY_COLORS[category] } as CSSProperties

  return (
    <section className="launch-explorer">
      <StepLabel step={1} accentVar="--color-simulator">
        Explorador de lanzamientos
      </StepLabel>

      <div className="launch-explorer__layout">
        <div className="launch-explorer__scene-column">
          <div className="launch-explorer__scene-frame">
            <LaunchScene params={params} results={simulation.results} currentTime={simulation.results.hoopArrival.time} />
          </div>

          <div className="launch-explorer__verdict" style={verdictStyle}>
            <span className="launch-explorer__verdict-dot" aria-hidden="true" />
            <span className="launch-explorer__verdict-label">{EFFICACY_LABELS[category]}</span>
          </div>

          <dl className="launch-explorer__metrics">
            <div>
              <dt>Altura máxima</dt>
              <dd>{formatNumber(simulation.results.maxHeight, 2)} m</dd>
            </div>
            <div>
              <dt>Tiempo de vuelo</dt>
              <dd>{formatNumber(simulation.results.flightTime, 2)} s</dd>
            </div>
            <div>
              <dt>Velocidad de entrada</dt>
              <dd>{formatNumber(simulation.results.hoopArrival.speed, 2)} m/s</dd>
            </div>
            <div>
              <dt>Ángulo de entrada</dt>
              <dd>{formatNumber(simulation.results.hoopArrival.angleDeg, 1)}°</dd>
            </div>
          </dl>
        </div>

        <aside className="launch-explorer__controls-column">
          <div className="parameter-controls">
            <div className="parameter-controls__header">
              <span className="parameter-controls__hint">Ajusta y observa la validez al instante</span>
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
        </aside>
      </div>
    </section>
  )
}
