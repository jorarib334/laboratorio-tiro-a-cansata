import { useState } from 'react'
import { Link } from '../../../routing/Link'
import { useScrollFade } from '../../../hooks/useScrollFade'
import './GeometryHero.css'

/**
 * Vídeo cinematográfico específico del módulo Geometría, aportado por el
 * usuario. Mismo tratamiento que el de Física: el nombre real incluye
 * espacios y acentos (no se renombra) y macOS lo guarda en Unicode NFD, así
 * que se normaliza antes de `encodeURI`. Si no cargara, `onError` retira
 * el `<video>` y el fondo degradado sigue funcionando — nunca se sustituye
 * por una escena generada.
 */
const CINEMATIC_VIDEO_SRC = encodeURI('/Grabación de pantalla 2026-09-20 a las 23.50.42.mov'.normalize('NFD'))

export function GeometryHero() {
  const { ref, opacity } = useScrollFade<HTMLElement>()
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <section className="geometry-hero" ref={ref} style={{ opacity }}>
      <div className="geometry-hero__background">
        {!videoFailed && (
          <video
            className="geometry-hero__video"
            src={CINEMATIC_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          />
        )}
        <div className="geometry-hero__overlay" />
      </div>

      <div className="geometry-hero__content">
        <Link to="/" className="geometry-hero__back">
          ← Volver al laboratorio
        </Link>

        <p className="geometry-hero__eyebrow">Módulo 02</p>
        <h1 className="geometry-hero__title">Geometría</h1>
        <p className="geometry-hero__subtitle">La posición del balón también determina el enceste.</p>
        <p className="geometry-hero__lead">
          Estudia la relación geométrica entre el balón, el aro y la trayectoria que los conecta.
        </p>

        <p className="geometry-hero__hint">Desplázate para explorar ↓</p>
      </div>
    </section>
  )
}
