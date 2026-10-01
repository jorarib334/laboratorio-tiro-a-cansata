import { useState } from 'react'
import { formatNumber } from '../../../format'
import type { TrajectoryExampleSet } from '../../../results/examples'
import type { SimulationResult } from '../../../results/types'
import { EFFICACY_COLORS, EFFICACY_LABELS, categorizeEfficacy } from '../../../results/validity'
import { StepLabel } from '../../../components/StepLabel/StepLabel'
import { LaunchScene } from '../../physics/visualization/LaunchScene'
import './TrajectoryExamples.css'

interface TrajectoryExamplesProps {
  examples: TrajectoryExampleSet
}

const CARDS: Array<{ key: keyof TrajectoryExampleSet; title: string; description: string }> = [
  { key: 'favorable', title: 'Configuración favorable', description: 'El lanzamiento con más margen geométrico dentro del conjunto simulado.' },
  { key: 'nearLimit', title: 'Cercana al límite', description: 'Un lanzamiento justo en (o muy cerca de) el límite geométrico del aro.' },
  { key: 'invalid', title: 'No válida', description: 'Un lanzamiento que llega al plano del aro pero no cumple la condición de enceste.' },
]

/**
 * Tres ejemplos elegidos de datos ya simulados (`pickTrajectoryExamples`, ver
 * `src/results/examples.ts`) — no imágenes ni configuraciones inventadas.
 * Cada tarjeta muestra la trayectoria real de ese lanzamiento al seleccionarla.
 */
export function TrajectoryExamples({ examples }: TrajectoryExamplesProps) {
  const firstAvailable = CARDS.find((card) => examples[card.key] !== null)?.key ?? 'favorable'
  const [active, setActive] = useState<keyof TrajectoryExampleSet>(firstAvailable)
  const activeExample: SimulationResult | null = examples[active]

  return (
    <section className="trajectory-examples">
      <StepLabel step={5} accentVar="--color-simulator">
        Ejemplos de trayectorias
      </StepLabel>

      <div className="trajectory-examples__tabs">
        {CARDS.map((card) => {
          const example = examples[card.key]
          if (!example) return null
          const category = categorizeEfficacy(example.validity)
          return (
            <button
              type="button"
              key={card.key}
              className={`trajectory-examples__tab${active === card.key ? ' trajectory-examples__tab--active' : ''}`}
              onClick={() => setActive(card.key)}
            >
              <span className="trajectory-examples__tab-dot" style={{ background: EFFICACY_COLORS[category] }} aria-hidden="true" />
              {card.title}
            </button>
          )
        })}
      </div>

      {activeExample ? (
        <div className="trajectory-examples__detail">
          <div className="trajectory-examples__scene">
            <LaunchScene params={activeExample.params} results={activeExample.results} currentTime={activeExample.results.hoopArrival.time} />
          </div>
          <div className="trajectory-examples__info">
            <p className="trajectory-examples__description">{CARDS.find((card) => card.key === active)?.description}</p>
            <dl className="trajectory-examples__metrics">
              <div>
                <dt>V₀</dt>
                <dd>{formatNumber(activeExample.params.initialSpeed, 1)} m/s</dd>
              </div>
              <div>
                <dt>θ</dt>
                <dd>{formatNumber(activeExample.params.launchAngleDeg, 0)}°</dd>
              </div>
              <div>
                <dt>y₀</dt>
                <dd>{formatNumber(activeExample.params.releaseHeight, 2)} m</dd>
              </div>
              <div>
                <dt>d</dt>
                <dd>{formatNumber(activeExample.params.distanceToHoop, 2)} m</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{EFFICACY_LABELS[categorizeEfficacy(activeExample.validity)]}</dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        <p className="trajectory-examples__empty">No se ha encontrado ningún ejemplo de esta categoría en el conjunto de referencia actual.</p>
      )}
    </section>
  )
}
