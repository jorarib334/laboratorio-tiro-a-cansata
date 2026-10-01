import { StepLabel } from '../../../components/StepLabel/StepLabel'
import './TrainingDataSummary.css'

interface TrainingDataSummaryProps {
  totalSimulations: number
  trainSize: number
  testSize: number
}

/** "Datos de entrenamiento": de dónde sale el conjunto que usa la IA — el mismo barrido de referencia de Resultados, nunca una tabla hecha a mano. */
export function TrainingDataSummary({ totalSimulations, trainSize, testSize }: TrainingDataSummaryProps) {
  return (
    <section className="training-data-summary">
      <StepLabel step={0} accentVar="--color-ai">
        Datos de entrenamiento
      </StepLabel>

      <p className="training-data-summary__note">
        El modelo se entrena con el mismo barrido de referencia que usa Resultados para sus propias
        observaciones: ninguna tabla escrita a mano, todo sale de simular el modelo físico y
        geométrico del laboratorio.
      </p>

      <dl className="training-data-summary__grid">
        <div>
          <dt>Número de simulaciones</dt>
          <dd>{totalSimulations.toLocaleString('es-ES')}</dd>
        </div>
        <div>
          <dt>Entrenamiento / prueba</dt>
          <dd>
            {trainSize.toLocaleString('es-ES')} / {testSize.toLocaleString('es-ES')}
          </dd>
        </div>
        <div>
          <dt>Variables utilizadas</dt>
          <dd>V₀, θ, y₀, d</dd>
        </div>
      </dl>
    </section>
  )
}
