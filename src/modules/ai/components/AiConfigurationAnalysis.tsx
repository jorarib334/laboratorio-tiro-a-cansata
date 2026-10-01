import type { CSSProperties } from 'react'
import { formatNumber } from '../../../format'
import type { LaunchParams } from '../../../physics/types'
import { ROBUSTNESS_LABELS, describeRobustness } from '../../../results/efficacyIndex'
import type { EfficacyIndexResult } from '../../../results/efficacyIndex'
import type { ToleranceReport } from '../../../results/marginAnalysis'
import type { KnnPrediction } from '../../../results/knn'
import { StepLabel } from '../../../components/StepLabel/StepLabel'
import './AiConfigurationAnalysis.css'

interface AiConfigurationAnalysisProps {
  params: LaunchParams
  prediction: KnnPrediction
  efficacy: EfficacyIndexResult
  tolerance: ToleranceReport
  k: number
}

function formatOffset(value: number): string {
  return Number.isFinite(value) ? formatNumber(value, 1) : '∞'
}

/**
 * "Análisis inteligente del lanzamiento": clasifica la configuración con el
 * modelo k-NN (favorable/desfavorable), y añade el índice de eficacia y la
 * tolerancia de ESA configuración exacta (calculados con las mismas
 * funciones del modelo físico, no por la IA) para que la clasificación no
 * quede aislada de los números que ya usa el resto del laboratorio.
 */
export function AiConfigurationAnalysis({ params, prediction, efficacy, tolerance, k }: AiConfigurationAnalysisProps) {
  const verdictStyle = {
    '--verdict-color': prediction.label ? 'var(--color-simulator)' : 'var(--color-ball-dim)',
  } as CSSProperties

  const speedSpan = tolerance.speedTolerance.lower + tolerance.speedTolerance.upper
  const angleSpan = tolerance.angleTolerance.lower + tolerance.angleTolerance.upper
  const tighterParam = speedSpan <= angleSpan ? 'V₀' : 'θ'

  return (
    <section className="ai-configuration">
      <StepLabel step={1} accentVar="--color-ai">
        Análisis inteligente del lanzamiento
      </StepLabel>

      <p className="ai-configuration__note">
        Configuración: V₀ = {formatNumber(params.initialSpeed, 1)} m/s, θ = {formatNumber(params.launchAngleDeg, 0)}°, y₀ ={' '}
        {formatNumber(params.releaseHeight, 2)} m, d = {formatNumber(params.distanceToHoop, 2)} m.
      </p>

      <div className="ai-configuration__verdict" style={verdictStyle}>
        <span className="ai-configuration__verdict-dot" aria-hidden="true" />
        <span className="ai-configuration__verdict-label">{prediction.label ? 'Zona favorable' : 'Zona desfavorable'}</span>
        <span className="ai-configuration__verdict-confidence">
          {formatNumber(prediction.confidence * 100, 0)}% de los {k} vecinos coinciden
        </span>
      </div>

      <dl className="ai-configuration__stats">
        <div>
          <dt>Índice de eficacia</dt>
          <dd>{formatNumber(efficacy.index * 100, 0)}%</dd>
        </div>
        <div>
          <dt>Tolerancia de V₀</dt>
          <dd>
            −{formatOffset(tolerance.speedTolerance.lower)} / +{formatOffset(tolerance.speedTolerance.upper)} m/s
          </dd>
        </div>
        <div>
          <dt>Tolerancia de θ</dt>
          <dd>
            −{formatOffset(tolerance.angleTolerance.lower)} / +{formatOffset(tolerance.angleTolerance.upper)} °
          </dd>
        </div>
      </dl>

      <p className="ai-configuration__relevant">
        Nota: "eficacia" no es lo mismo que el veredicto de arriba. El {formatNumber(efficacy.index * 100, 0)}% es cuánto
        aguanta el modelo físico pequeñas variaciones de V₀/θ alrededor de esta configuración exacta —{' '}
        {ROBUSTNESS_LABELS[describeRobustness(efficacy.index)]}. El parámetro más determinante aquí es{' '}
        <strong>{tighterParam}</strong>: es el que tiene menos margen antes de que la configuración cambie de zona.
      </p>

      <p className="ai-configuration__explain-lede">
        Los {k} lanzamientos simulados más parecidos a esta configuración (comparación con configuraciones próximas):
      </p>

      <table className="ai-configuration__neighbors">
        <thead>
          <tr>
            <th>V₀ (m/s)</th>
            <th>θ (°)</th>
            <th>y₀ (m)</th>
            <th>d (m)</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {prediction.neighbors.map((neighbor, index) => (
            <tr key={index}>
              <td>{formatNumber(neighbor.sample.features[0], 1)}</td>
              <td>{formatNumber(neighbor.sample.features[1], 0)}</td>
              <td>{formatNumber(neighbor.sample.features[2], 2)}</td>
              <td>{formatNumber(neighbor.sample.features[3], 2)}</td>
              <td className={neighbor.sample.label ? 'ai-configuration__cell-favorable' : 'ai-configuration__cell-unfavorable'}>
                {neighbor.sample.label ? 'Favorable' : 'Desfavorable'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
