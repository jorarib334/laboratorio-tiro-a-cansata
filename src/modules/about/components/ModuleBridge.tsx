import type { CSSProperties } from 'react'
import { Link } from '../../../routing/Link'
import { BRIDGE_ENTRIES } from '../moduleBridge'
import { StepLabel } from '../../../components/StepLabel/StepLabel'
import './ModuleBridge.css'

/** De la memoria escrita al laboratorio: cada apartado real del trabajo, enlazado al módulo interactivo donde se puede comprobar en vivo. */
export function ModuleBridge() {
  return (
    <section className="module-bridge">
      <StepLabel step={3}>De la memoria al laboratorio</StepLabel>
      <p className="module-bridge__note">
        Cada apartado del trabajo escrito tiene su contrapartida interactiva aquí: donde la memoria describe una
        decisión o un resultado, el laboratorio deja comprobarlo en vivo.
      </p>

      <ul className="module-bridge__list">
        {BRIDGE_ENTRIES.map((entry) => {
          const style = { '--accent': `var(${entry.accentVar})` } as CSSProperties
          return (
            <li key={entry.route} style={style}>
              <Link to={entry.route} className="module-bridge__item">
                <span className="module-bridge__section">{entry.section}</span>
                <span className="module-bridge__text">
                  <span className="module-bridge__title">{entry.title}</span>
                  <span className="module-bridge__module">Ver en {entry.moduleLabel} →</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
