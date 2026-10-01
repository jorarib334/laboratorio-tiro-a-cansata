import { useEffect, useRef, useState } from 'react'

/**
 * Traduce el scroll dentro de una sección alta en un valor de progreso
 * 0→1: 0 cuando el principio de la sección llega arriba del todo, 1 cuando
 * su final llega abajo del todo. Pensado para una sección con un escenario
 * en `position: sticky` dentro, al estilo "scrollytelling".
 *
 * Sin librerías: un listener de scroll con `requestAnimationFrame` (para no
 * recalcular más de una vez por fotograma) que solo se activa mientras la
 * sección está cerca del viewport, vigilado con `IntersectionObserver`.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setProgress(1)
      return
    }

    let ticking = false
    let active = false

    const measure = () => {
      ticking = false
      const rect = node.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) {
        setProgress(1)
        return
      }
      const raw = -rect.top / scrollable
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    const onScroll = () => {
      if (!active || ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting
        if (active) measure()
      },
      { rootMargin: '20% 0px 20% 0px' },
    )

    observer.observe(node)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { ref, progress }
}
