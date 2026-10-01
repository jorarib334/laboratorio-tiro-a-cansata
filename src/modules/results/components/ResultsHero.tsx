import { Link } from '../../../routing/Link'
import { useScrollFade } from '../../../hooks/useScrollFade'
import './ResultsHero.css'

/**
 * Sin vídeo: a diferencia de Física/Geometría/Representación técnica, este
 * módulo no tiene un vídeo cinematográfico propio todavía. En vez de
 * inventar una escena o forzar un vídeo genérico, el hero usa solo tipografía
 * y un fondo degradado — igual de coherente con la estética del laboratorio.
 */
export function ResultsHero() {
  const { ref, opacity } = useScrollFade<HTMLElement>()

  return (
    <section className="results-hero" ref={ref} style={{ opacity }}>
      <div className="results-hero__background" />

      <div className="results-hero__content">
        <Link to="/" className="results-hero__back">
          ← Volver al laboratorio
        </Link>

        <p className="results-hero__eyebrow">Módulo 04</p>
        <h1 className="results-hero__title">Resultados</h1>
        <p className="results-hero__subtitle">De un lanzamiento a un mapa de comportamiento</p>
        <p className="results-hero__lead">
          Cada cifra de este módulo sale de simular el mismo modelo físico y geométrico de los
          módulos anteriores, muchas veces y con parámetros distintos — nada se escribe a mano. Al
          final, una inteligencia artificial entrenada con esos mismos datos intenta reconocer sus
          patrones.
        </p>

        <p className="results-hero__hint">Desplázate para explorar ↓</p>
      </div>
    </section>
  )
}
