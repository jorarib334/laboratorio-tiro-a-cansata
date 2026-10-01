import { useState } from 'react'
import { Link } from '../../../routing/Link'
import { useScrollFade } from '../../../hooks/useScrollFade'
import './PhysicsHero.css'

/**
 * Vídeo cinematográfico específico del módulo Física. Si no cargara,
 * `onError` retira el `<video>` y el fondo degradado sigue funcionando:
 * nunca se sustituye por una escena generada.
 */
const AMBIENT_VIDEO_SRC = '/physics-bg.mp4'

export function PhysicsHero() {
  const { ref, opacity } = useScrollFade<HTMLElement>()
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <section className="physics-hero" ref={ref} style={{ opacity }}>
      <div className="physics-hero__background">
        {!videoFailed && (
          <video
            className="physics-hero__video"
            src={AMBIENT_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          />
        )}
        <div className="physics-hero__overlay" />
      </div>

      <div className="physics-hero__content">
        <Link to="/" className="physics-hero__back">
          ← Volver al laboratorio
        </Link>

        <p className="physics-hero__eyebrow">Módulo 01</p>
        <h1 className="physics-hero__title">Física</h1>
        <p className="physics-hero__subtitle">Del lanzamiento real al modelo matemático</p>
        <p className="physics-hero__lead">
          Cada lanzamiento se traduce en un modelo físico que permite estudiar su trayectoria:
          velocidad, ángulo y altura dejan de ser una sensación y pasan a ser variables.
        </p>

        <p className="physics-hero__hint">Desplázate para explorar ↓</p>
      </div>
    </section>
  )
}
