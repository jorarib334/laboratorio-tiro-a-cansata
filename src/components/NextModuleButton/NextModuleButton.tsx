import type { CSSProperties } from 'react'
import { Link } from '../../routing/Link'
import './NextModuleButton.css'

interface NextModuleButtonProps {
  to: string
  label: string
  accentVar: string
  /** Por defecto "Siguiente módulo"; el último módulo del recorrido usa otro texto (p. ej. "Fin del recorrido"). */
  eyebrow?: string
}

/** Botón de navegación al final de cada módulo — el mismo componente en los cinco módulos, para que el recorrido se sienta como un único hilo conductor. */
export function NextModuleButton({ to, label, accentVar, eyebrow = 'Siguiente módulo' }: NextModuleButtonProps) {
  const style = { '--accent': `var(${accentVar})` } as CSSProperties

  return (
    <div className="next-module-button__row">
      <Link to={to} className="next-module-button" style={style}>
        <span className="next-module-button__eyebrow">{eyebrow}</span>
        <span className="next-module-button__label">
          {label}
          <span className="next-module-button__arrow" aria-hidden="true">
            →
          </span>
        </span>
      </Link>
    </div>
  )
}
