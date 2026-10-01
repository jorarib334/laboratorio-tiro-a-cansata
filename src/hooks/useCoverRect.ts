import { useEffect, useState, type RefObject } from 'react'

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Traduce un rectángulo en coordenadas nativas de un vídeo/imagen a su
 * posición real en pantalla cuando se muestra con `object-fit: cover`
 * (recorte y escala dependen de la proporción del contenedor, así que un
 * porcentaje fijo en CSS no sirve). Se recalcula con ResizeObserver al
 * cambiar el tamaño del contenedor, nunca por fotograma de scroll.
 */
export function useCoverRect(
  containerRef: RefObject<HTMLElement | null>,
  naturalSize: { width: number; height: number },
  sourceRect: Rect,
) {
  const [screenRect, setScreenRect] = useState<Rect | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const recalc = () => {
      const { width: cw, height: ch } = container.getBoundingClientRect()
      if (!cw || !ch) return
      const scale = Math.max(cw / naturalSize.width, ch / naturalSize.height)
      const renderedW = naturalSize.width * scale
      const renderedH = naturalSize.height * scale
      const offsetX = (cw - renderedW) / 2
      const offsetY = (ch - renderedH) / 2
      setScreenRect({
        x: offsetX + sourceRect.x * scale,
        y: offsetY + sourceRect.y * scale,
        width: sourceRect.width * scale,
        height: sourceRect.height * scale,
      })
    }

    recalc()
    const observer = new ResizeObserver(recalc)
    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef, naturalSize.width, naturalSize.height, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height])

  return screenRect
}
