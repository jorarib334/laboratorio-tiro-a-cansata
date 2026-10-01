import { Link } from '../../../routing/Link'
import { useScrollFade } from '../../../hooks/useScrollFade'
import './AiHero.css'

/** Identidad visual ligeramente diferenciada (acento `--color-ai`) pero coherente con el resto del laboratorio: mismo fondo oscuro, misma tipografía, sin vídeo. */
export function AiHero() {
  const { ref, opacity } = useScrollFade<HTMLElement>()

  return (
    <section className="ai-hero" ref={ref} style={{ opacity }}>
      <div className="ai-hero__background" />

      <div className="ai-hero__content">
        <Link to="/" className="ai-hero__back">
          ← Volver al laboratorio
        </Link>

        <p className="ai-hero__eyebrow">Módulo 05</p>
        <h1 className="ai-hero__title">Inteligencia Artificial</h1>
        <p className="ai-hero__subtitle">Hasta qué punto un modelo puede aprender la física</p>
        <p className="ai-hero__lead">
          Un modelo ligero e interpretable (k-vecinos-más-cercanos), entrenado con los mismos
          lanzamientos que simula Resultados, intenta reconocer sus patrones — sin ninguna llamada a
          un servicio externo. No sustituye al modelo físico: se compara con él.
        </p>

        <p className="ai-hero__hint">Desplázate para explorar ↓</p>
      </div>
    </section>
  )
}
