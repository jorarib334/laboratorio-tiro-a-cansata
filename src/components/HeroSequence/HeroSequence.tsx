import { useScrollProgress } from '../../hooks/useScrollProgress'
import { HeroVideoScene } from './HeroVideoScene'
import { HeroTelemetry } from './HeroTelemetry'
import { STAGES, stageProgress } from './stages'
import './HeroSequence.css'

/**
 * El vídeo termina de avanzar un poco antes de que empiece el oscurecimiento
 * final (ver STAGES.transition): así el balón entrando en el aro se ve con
 * claridad, en vez de fundirse a negro justo en ese instante.
 */
const VIDEO_COMPLETE_AT = 0.88

/**
 * El hero como experiencia de scroll a pantalla completa: el vídeo real del
 * lanzamiento (HeroVideoScene) ocupa todo el fondo y avanza con el
 * progreso del scroll (ver useVideoScrub, dentro de HeroVideoScene); una
 * capa científica sutil (HeroTelemetry) aparece progresivamente encima; al
 * final, la escena cede protagonismo y se funde con el laboratorio.
 */
export function HeroSequence() {
  const { ref, progress } = useScrollProgress<HTMLElement>()
  const videoProgress = Math.min(1, progress / VIDEO_COMPLETE_AT)
  const transitionOut = stageProgress(progress, STAGES.transition)
  const hintOpacity = 1 - stageProgress(progress, [0, 0.06])

  return (
    <section className="hero-sequence" ref={ref}>
      <div className="hero-sequence__stage">
        <HeroVideoScene progress={videoProgress} />
        <HeroTelemetry progress={progress} />

        <div className="hero-sequence__lab-reveal" style={{ opacity: transitionOut }} aria-hidden="true" />

        <div
          className="hero-sequence__text"
          style={{ opacity: 1 - transitionOut, transform: `translateY(${transitionOut * -12}px)` }}
        >
          <div className="hero-sequence__heading">
            <span className="hero-sequence__index" aria-hidden="true">
              H.01
            </span>
            <h1>
              <span className="hero-sequence__line hero-sequence__line--1">El tiro a canasta</span>
              <span className="hero-sequence__line hero-sequence__line--2">también se puede</span>
              <span className="hero-sequence__line hero-sequence__line--accent">
                analizar
                <svg className="hero-sequence__accent-arc" viewBox="0 0 260 60" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M6 46 Q 130 -6 254 40" pathLength={1} />
                </svg>
              </span>
            </h1>
          </div>
          <p className="hero-sequence__lead">
            Física, geometría e inteligencia artificial aplicadas al lanzamiento de baloncesto.
          </p>
        </div>

        <p className="hero-sequence__hint" style={{ opacity: hintOpacity }}>
          Desplázate para explorar ↓
        </p>
      </div>
    </section>
  )
}
