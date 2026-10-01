import { formatNumber } from '../../../format'
import type { KnnEvaluation } from '../../../results/knn'
import type { ComparisonExample } from '../hooks/useAiModel'
import { StepLabel } from '../../../components/StepLabel/StepLabel'
import './ModelComparison.css'

interface ModelComparisonProps {
  evaluation: KnnEvaluation
  trainSize: number
  testSize: number
  agreementExample: ComparisonExample | null
  discrepancyExample: ComparisonExample | null
}

function describeExample(example: ComparisonExample): string {
  const [initialSpeed, launchAngleDeg, releaseHeight, distanceToHoop] = example.sample.features
  return `V₀ = ${formatNumber(initialSpeed, 1)} m/s, θ = ${formatNumber(launchAngleDeg, 0)}°, y₀ = ${formatNumber(releaseHeight, 2)} m, d = ${formatNumber(distanceToHoop, 2)} m`
}

/**
 * Comparación honesta: precisión y matriz de confusión de la IA frente a la
 * propia etiqueta del modelo físico+geométrico sobre datos de prueba nunca
 * vistos en el entrenamiento. El objetivo declarado es estudiar cuánto
 * aprende la IA del modelo físico, no afirmar que lo supera.
 */
export function ModelComparison({ evaluation, trainSize, testSize, agreementExample, discrepancyExample }: ModelComparisonProps) {
  const { confusion } = evaluation
  const actualFavorable = confusion.truePositive + confusion.falseNegative
  const isImbalanced = testSize > 0 && actualFavorable / testSize < 0.15

  return (
    <section className="model-comparison">
      <StepLabel step={2} accentVar="--color-ai">
        Modelo físico vs IA
      </StepLabel>

      <p className="model-comparison__disclaimer">
        La IA no sustituye ni mejora el modelo físico: se entrena con lanzamientos que el propio
        modelo físico y geométrico ya clasificó, y aquí se mide solo cuánto es capaz de reproducir
        ese patrón en lanzamientos que no vio durante el entrenamiento.
      </p>

      <dl className="model-comparison__stats">
        <div>
          <dt>Simulaciones de entrenamiento</dt>
          <dd>{trainSize.toLocaleString('es-ES')}</dd>
        </div>
        <div>
          <dt>Simulaciones de prueba</dt>
          <dd>{testSize.toLocaleString('es-ES')}</dd>
        </div>
        <div>
          <dt>Acierto global (k = {evaluation.k})</dt>
          <dd>{formatNumber(evaluation.accuracy * 100, 1)}%</dd>
        </div>
        <div>
          <dt>Precisión en "favorable"</dt>
          <dd>{formatNumber(evaluation.precision * 100, 1)}%</dd>
        </div>
        <div>
          <dt>Sensibilidad en "favorable"</dt>
          <dd>{formatNumber(evaluation.recall * 100, 1)}%</dd>
        </div>
      </dl>

      {isImbalanced && (
        <p className="model-comparison__imbalance-note">
          Solo {formatNumber((actualFavorable / testSize) * 100, 1)}% de los lanzamientos de prueba son
          realmente favorables: con datos tan desequilibrados, el acierto global es engañoso — la
          sensibilidad (cuántos favorables detecta de verdad) es la cifra que importa aquí.
        </p>
      )}

      <div className="model-comparison__matrix-block">
        <span className="model-comparison__matrix-caption">Matriz de confusión (conjunto de prueba)</span>
        <table className="model-comparison__matrix">
          <thead>
            <tr>
              <th />
              <th>Físico: favorable</th>
              <th>Físico: desfavorable</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>IA: favorable</th>
              <td className="model-comparison__cell-correct">{confusion.truePositive}</td>
              <td className="model-comparison__cell-wrong">{confusion.falsePositive}</td>
            </tr>
            <tr>
              <th>IA: desfavorable</th>
              <td className="model-comparison__cell-wrong">{confusion.falseNegative}</td>
              <td className="model-comparison__cell-correct">{confusion.trueNegative}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="model-comparison__examples">
        {agreementExample && (
          <p>
            <strong>Ejemplo de acuerdo:</strong> {describeExample(agreementExample)} → ambos modelos lo
            clasifican como {agreementExample.predictedFavorable ? 'favorable' : 'desfavorable'}.
          </p>
        )}
        {discrepancyExample ? (
          <p>
            <strong>Ejemplo de discrepancia:</strong> {describeExample(discrepancyExample)} → el modelo
            físico lo clasifica como {discrepancyExample.sample.label ? 'favorable' : 'desfavorable'}, la
            IA como {discrepancyExample.predictedFavorable ? 'favorable' : 'desfavorable'}.
          </p>
        ) : (
          <p>No se ha encontrado ninguna discrepancia en el conjunto de prueba actual.</p>
        )}
      </div>
    </section>
  )
}
