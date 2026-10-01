import { useEffect, useRef, useState } from 'react'

/**
 * Animación del balón a lo largo de la trayectoria calculada, mediante
 * requestAnimationFrame. Independiente del vídeo del hero de la portada:
 * aquí el tiempo avanza en tiempo real (segundos de simulación) y controla
 * la posición del balón vía `positionAt(params, currentTime)`.
 */
export function useTrajectoryPlayback(duration: number) {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const durationRef = useRef(duration)
  const rafRef = useRef<number | null>(null)
  const lastTimestampRef = useRef<number | null>(null)

  useEffect(() => {
    if (durationRef.current === duration) return
    durationRef.current = duration
    setCurrentTime(0)
    setIsPlaying(false)
  }, [duration])

  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null
      return
    }

    function step(timestamp: number) {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp
      const deltaSeconds = (timestamp - lastTimestampRef.current) / 1000
      lastTimestampRef.current = timestamp

      setCurrentTime((previous) => {
        const next = previous + deltaSeconds
        if (next >= durationRef.current) {
          setIsPlaying(false)
          return durationRef.current
        }
        return next
      })
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [isPlaying])

  function play() {
    if (currentTime >= durationRef.current) setCurrentTime(0)
    setIsPlaying(true)
  }

  function pause() {
    setIsPlaying(false)
  }

  function restart() {
    setCurrentTime(0)
    setIsPlaying(true)
  }

  function reset() {
    setCurrentTime(0)
    setIsPlaying(false)
  }

  return { currentTime, isPlaying, play, pause, restart, reset }
}
