import { useEffect, useRef, type RefObject } from 'react'

/**
 * Sincroniza un <video> con un progreso externo (0→1) en vez de reproducirlo
 * de forma autónoma: nunca llama a play(), solo mueve currentTime. Separado
 * de useScrollProgress a propósito — este hook no sabe nada de scroll, solo
 * de vídeo, para poder cambiar cómo se calcula el progreso sin tocarlo.
 *
 * No mueve currentTime hasta que el vídeo está enteramente en búfer:
 * hacerlo antes lanza una nueva petición de rango por cada seek, que el
 * navegador aborta en cuanto llega el siguiente scroll — el vídeo se queda
 * negro porque nunca termina de decodificar un fotograma. El clip es
 * pequeño, así que el búfer completo tarda poco; hasta entonces se ve el
 * poster.
 */
export function useVideoScrub(videoRef: RefObject<HTMLVideoElement | null>, progress: number) {
  const progressRef = useRef(progress)
  const readyRef = useRef(false)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    readyRef.current = false

    const scrubToCurrentProgress = () => {
      const duration = video.duration
      if (!duration || Number.isNaN(duration)) return
      const target = progressRef.current * duration
      if (Math.abs(video.currentTime - target) > 0.02) {
        video.currentTime = target
      }
    }

    const isFullyBuffered = () => {
      const { buffered, duration } = video
      if (!duration || Number.isNaN(duration) || buffered.length === 0) return false
      return buffered.end(buffered.length - 1) >= duration - 0.15
    }

    const checkReady = () => {
      if (readyRef.current || !isFullyBuffered()) return
      readyRef.current = true
      scrubToCurrentProgress()
    }

    video.addEventListener('loadedmetadata', checkReady)
    video.addEventListener('progress', checkReady)
    video.addEventListener('canplaythrough', checkReady)
    checkReady()

    return () => {
      video.removeEventListener('loadedmetadata', checkReady)
      video.removeEventListener('progress', checkReady)
      video.removeEventListener('canplaythrough', checkReady)
    }
  }, [videoRef])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !readyRef.current) return
    const duration = video.duration
    if (!duration || Number.isNaN(duration)) return
    const target = progress * duration
    if (Math.abs(video.currentTime - target) > 0.02) {
      video.currentTime = target
    }
  }, [progress, videoRef])
}
