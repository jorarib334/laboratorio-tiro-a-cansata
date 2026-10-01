import type { LaunchParams, LaunchResults } from '../../../physics/types'
import { StepLabel } from '../../../components/StepLabel/StepLabel'
import { formatNumber } from '../../../format'
import './ResultsPanel.css'

interface ResultsPanelProps {
  params: LaunchParams
  results: LaunchResults
}

export function ResultsPanel({ params, results }: ResultsPanelProps) {
  return (
    <div className="results-panel">
      <section>
        <StepLabel step={3}>Llegada al aro</StepLabel>
        {results.hoopArrival.reachesHoop ? (
          <dl className="results-panel__grid">
            <div>
              <dt>Altura del balón</dt>
              <dd>{formatNumber(results.hoopArrival.y, 2)} m</dd>
            </div>
            <div>
              <dt>Velocidad de entrada</dt>
              <dd>{formatNumber(results.hoopArrival.speed, 2)} m/s</dd>
            </div>
            <div>
              <dt>Componentes de la velocidad</dt>
              <dd>
                Vx {formatNumber(results.hoopArrival.vx, 2)} · Vy {formatNumber(results.hoopArrival.vy, 2)} m/s
              </dd>
            </div>
            <div>
              <dt>Ángulo de entrada</dt>
              <dd>{formatNumber(results.hoopArrival.angleDeg, 1)}°</dd>
            </div>
          </dl>
        ) : (
          <p className="results-panel__warning">
            Con d = {formatNumber(params.distanceToHoop, 2)} m, el balón toca el suelo antes de llegar a esa
            distancia horizontal.
          </p>
        )}
      </section>

      <section>
        <StepLabel step={4}>Resultado</StepLabel>
        <dl className="results-panel__grid">
          <div>
            <dt>Tiempo de vuelo</dt>
            <dd>{formatNumber(results.flightTime, 2)} s</dd>
          </div>
          <div>
            <dt>Alcance</dt>
            <dd>{formatNumber(results.range, 2)} m</dd>
          </div>
          <div>
            <dt>Altura máxima</dt>
            <dd>{formatNumber(results.maxHeight, 2)} m</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
