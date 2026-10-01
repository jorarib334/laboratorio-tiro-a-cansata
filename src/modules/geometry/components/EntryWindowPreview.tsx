import { StepLabel } from '../../../components/StepLabel/StepLabel'
import './EntryWindowPreview.css'

const UPCOMING_FIELDS = [
  'Posición del balón',
  'Radio del balón',
  'Radio del aro',
  'Posición del aro',
  'Distancia al aro',
  'Trayectoria',
  'Ángulo de entrada',
  'Desviación respecto a la posición ideal',
]

/**
 * Preparación de la futura "ventana geométrica de enceste" (SKILL.md §7).
 * Deliberadamente conceptual, sin valores en vivo ni criterio calculado:
 * el proyecto no define todavía qué margen o "posición ideal" cuenta como
 * válida, así que mostrar cifras aquí sería inventarlas. La lógica ya
 * preparada (radios/posiciones reales y el contexto de Física vía
 * `physicsBridge.ts`) vive en `src/geometry/entryWindow.ts`, lista para
 * que el Simulador la use cuando ese criterio se concrete.
 */
export function EntryWindowPreview() {
  return (
    <div className="entry-window-preview">
      <StepLabel step={4} accentVar="--color-geometry">
        Ventana geométrica
      </StepLabel>

      <p className="entry-window-preview__tag">Preparada para el simulador</p>

      <p className="entry-window-preview__intro">
        La ventana geométrica representa la región de posiciones del balón compatible con el paso
        por el aro, combinando las condiciones geométricas con la trayectoria física.
      </p>

      <ul className="entry-window-preview__fields">
        {UPCOMING_FIELDS.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
    </div>
  )
}
