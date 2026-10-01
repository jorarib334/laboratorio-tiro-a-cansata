import { useState } from 'react'
import { Link } from '../../../routing/Link'
import { useScrollFade } from '../../../hooks/useScrollFade'
import './PhysicsHero.css'

/**
 * Vídeo cinematográfico específico del módulo Física, aportado por el
 * usuario. El nombre de archivo real incluye espacios y acentos (no se
 * renombra), así que se codifica con `encodeURI` para usarlo como `src`.
 * macOS guarda el nombre en Unicode NFD (la "ó" como "o" + acento
 * combinado): sin `.normalize('NFD')` aquí, el editor guarda la cadena en
 * NFC y la petición no encuentra el archivo (Vite cae al `index.html` de
 * la SPA en vez de servir el vídeo). Si aun así no cargara, `onError`
 * retira el `<video>` y el fondo degradado sigue funcionando: nunca se
 * sustituye por una escena generada.
 */
const AMBIENT_VIDEO_SRC = encodeURI('/Grabación de pantalla 2026-09-20 a las 22.42.01.mov'.normalize('NFD'))

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
