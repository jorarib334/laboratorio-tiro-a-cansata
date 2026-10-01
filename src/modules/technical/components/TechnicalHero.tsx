import { useState } from 'react'
import { Link } from '../../../routing/Link'
import { useScrollFade } from '../../../hooks/useScrollFade'
import './TechnicalHero.css'

/**
 * Vídeo cinematográfico específico del módulo Representación Técnica,
 * aportado por el usuario. Mismo tratamiento que Física/Geometría: el
 * nombre real incluye espacios y acentos (no se renombra) y macOS lo
 * guarda en Unicode NFD, así que se normaliza antes de `encodeURI`. Si no
 * cargara, `onError` retira el `<video>` y el fondo degradado sigue
 * funcionando — nunca se sustituye por una escena generada.
 */
const CINEMATIC_VIDEO_SRC = encodeURI('/Grabación de pantalla 2026-09-21 a las 23.02.32.mov'.normalize('NFD'))

export function TechnicalHero() {
  const { ref, opacity } = useScrollFade<HTMLElement>()
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <section className="technical-hero" ref={ref} style={{ opacity }}>
      <div className="technical-hero__background">
        {!videoFailed && (
          <video
            className="technical-hero__video"
            src={CINEMATIC_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          />
        )}
        <div className="technical-hero__overlay" />
      </div>

      <div className="technical-hero__content">
        <Link to="/" className="technical-hero__back">
          ← Volver al laboratorio
        </Link>

        <p className="technical-hero__eyebrow">Módulo 03</p>
        <h1 className="technical-hero__title">Representación técnica</h1>
        <p className="technical-hero__subtitle">Un mismo lanzamiento, tres vistas.</p>
        <p className="technical-hero__lead">
          El lanzamiento puede analizarse espacialmente mediante sus proyecciones en alzado,
          planta y perfil.
        </p>

        <p className="technical-hero__hint">Desplázate para explorar ↓</p>
      </div>
    </section>
  )
}
