import { useEffect, useRef, useState } from 'react'

/**
 * Opacidad 1→0 a medida que el elemento se desplaza fuera de la parte
 * superior del viewport. A diferencia de `useScrollProgress` (pensado para
 * una sección alta en `position: sticky`), este hook es para un bloque de
 * altura normal que simplemente se desvanece al hacer scroll sobre él, sin
 * fijarlo ni robar recorrido de scroll adicional.
 */
export function useScrollFade<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOpacity(1)
      return
    }

    let ticking = false

    const measure = () => {
      ticking = false
      const rect = node.getBoundingClientRect()
      const hidden = Math.max(0, -rect.top) / rect.height
      setOpacity(Math.min(1, Math.max(0, 1 - hidden)))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { ref, opacity }
}
