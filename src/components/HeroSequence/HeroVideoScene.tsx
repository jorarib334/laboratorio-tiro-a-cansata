import { useRef } from 'react'
import { useVideoScrub } from '../../hooks/useVideoScrub'
import { useCoverRect } from '../../hooks/useCoverRect'
import './HeroVideoScene.css'

interface HeroVideoSceneProps {
  progress: number
}

const VIDEO_NATURAL_SIZE = { width: 2558, height: 1294 }

/**
 * Rectángulo, en píxeles nativos del vídeo, donde aparece la marca de otro
 * producto grabada en la base del soporte de la canasta. Con el vídeo a
 * pantalla completa (`object-fit: cover`), qué parte del vídeo se recorta
 * depende de la proporción de cada pantalla, así que un porcentaje fijo en
 * CSS ya no basta — useCoverRect recalcula dónde cae este rectángulo en
 * cada tamaño de ventana.
 */
const BRAND_SOURCE_RECT = { x: 1900, y: 780, width: 620, height: 380 }

/**
 * El vídeo real a pantalla completa, controlado por scroll (nunca
 * autoplay: solo se mueve currentTime, ver useVideoScrub).
 */
export function HeroVideoScene({ progress }: HeroVideoSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoScrub(videoRef, progress)
  const maskRect = useCoverRect(containerRef, VIDEO_NATURAL_SIZE, BRAND_SOURCE_RECT)

  return (
    <div className="hero-video-scene" ref={containerRef}>
      <video
        ref={videoRef}
        className="hero-video-scene__video"
        src="/hero-lanzamiento.mp4"
        poster="/hero-poster.jpg"
        preload="auto"
        muted
        playsInline
        aria-hidden="true"
      />
      {maskRect && (
        <div
          className="hero-video-scene__mask"
          style={{
            left: maskRect.x,
            top: maskRect.y,
            width: maskRect.width,
            height: maskRect.height,
          }}
        />
      )}
      <div className="hero-video-scene__glare-mask" />
      <div className="hero-video-scene__vignette" />
    </div>
  )
}
