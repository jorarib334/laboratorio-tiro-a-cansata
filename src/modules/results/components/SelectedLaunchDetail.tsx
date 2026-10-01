import type { CSSProperties } from 'react'
import { formatNumber } from '../../../format'
import type { LaunchParams } from '../../../physics/types'
import { ROBUSTNESS_LABELS, describeRobustness } from '../../../results/efficacyIndex'
import type { EfficacyIndexResult } from '../../../results/efficacyIndex'
import type { ToleranceReport } from '../../../results/marginAnalysis'
import type { SimulationResult } from '../../../results/types'
import { EFFICACY_COLORS, EFFICACY_LABELS, categorizeEfficacy } from '../../../results/validity'
import { LaunchScene } from '../../physics/visualization/LaunchScene'
import './SelectedLaunchDetail.css'

interface SelectedLaunchDetailProps {
  params: LaunchParams
  simulation: SimulationResult
  efficacy: EfficacyIndexResult
  tolerance: ToleranceReport
}

function formatTolerance(value: number): string {
  return Number.isFinite(value) ? `± ${formatNumber(value, 1)}°` : 'sin límite en el rango'
}

/** Panel lateral sincronizado con ambos mapas: la trayectoria y todos los parámetros del punto (V0, θ) seleccionado, calculados al momento (no leídos de la rejilla, que es solo aproximada). */
export function SelectedLaunchDetail({ params, simulation, efficacy, tolerance }: SelectedLaunchDetailProps) {
  const category = categorizeEfficacy(simulation.validity)
  const verdictStyle = { '--verdict-color': EFFICACY_COLORS[category] } as CSSProperties
  const angleTolerance = Math.min(tolerance.angleTolerance.lower, tolerance.angleTolerance.upper)

  return (
    <aside className="selected-launch-detail">
      <p className="selected-launch-detail__heading">Configuración seleccionada</p>
      <p className="selected-launch-detail__params">
        V₀ = {formatNumber(params.initialSpeed, 1)} m/s · θ = {formatNumber(params.launchAngleDeg, 0)}°
      </p>

      <div className="selected-launch-detail__scene">
        <LaunchScene params={params} results={simulation.results} currentTime={simulation.results.hoopArrival.time} />
      </div>

      <div className="selected-launch-detail__verdict" style={verdictStyle}>
        <span className="selected-launch-detail__verdict-dot" aria-hidden="true" />
        <span>{EFFICACY_LABELS[category]}</span>
      </div>

      {category !== 'invalid' && (
        <p className="selected-launch-detail__robustness">
          Es válido en este punto exacto, pero {ROBUSTNESS_LABELS[describeRobustness(efficacy.index)]}.
        </p>
      )}

      <dl className="selected-launch-detail__metrics">
        <div>
          <dt>Índice de eficacia</dt>
          <dd>{formatNumber(efficacy.index * 100, 0)}%</dd>
        </div>
        <div>
          <dt>Tolerancia angular</dt>
          <dd>{formatTolerance(angleTolerance)}</dd>
        </div>
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
    </aside>
  )
}
