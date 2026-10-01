import { usePageScrollProgress } from '../../hooks/usePageScrollProgress'
import './ScrollProgressBar.css'

/**
 * Indicador fino de avance por la página, con el mismo degradado azul→naranja
 * del resto del laboratorio. Puramente informativo (no interactivo).
 */
export function ScrollProgressBar() {
  const progress = usePageScrollProgress()

  return (
    <div className="scroll-progress" role="presentation" aria-hidden="true">
      <div className="scroll-progress__fill" style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}
