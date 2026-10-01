import { Link } from '../../../routing/Link'
import { useScrollFade } from '../../../hooks/useScrollFade'
import './AboutHero.css'

/**
 * Portada del "Sobre el proyecto": reutiliza el mismo tratamiento tipográfico
 * que el titular de la portada general (texto sólido + arco de trayectoria
 * dibujándose, sin degradado de color aislando una palabra — ver
 * HeroSequence.css) para que se sienta como el mismo proyecto, pero con el
 * título REAL de la memoria (no la frase de marketing de la portada).
 */
export function AboutHero() {
  const { ref, opacity } = useScrollFade<HTMLElement>()

  return (
    <section className="about-hero" ref={ref} style={{ opacity }}>
      <div className="about-hero__background" />

      <div className="about-hero__content">
        <Link to="/" className="about-hero__back">
          ← Volver al laboratorio
        </Link>

        <p className="about-hero__eyebrow">Trabajo de investigación de Bachillerato</p>
        <p className="about-hero__lead-in">El tiro a canasta también se puede analizar.</p>

        <h1 className="about-hero__title">
          La ciencia de un tiro a canasta
          <svg className="about-hero__accent-arc" viewBox="0 0 260 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M6 46 Q 130 -6 254 40" pathLength={1} />
          </svg>
        </h1>
        <p className="about-hero__subtitle">Simulación y análisis de las variables que determinan la eficacia del lanzamiento</p>

        <p className="about-hero__byline">Jorge Ardura Ibáñez · Colegio Valdefuentes · 2026</p>
      </div>
    </section>
  )
}
