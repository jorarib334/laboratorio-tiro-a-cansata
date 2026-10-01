import { Link } from '../../routing/Link'
import './Navbar.css'

interface NavItem {
  label: string
  href?: string
  to?: string
}

const navItems: NavItem[] = [
  { label: 'Inicio', href: '#top' },
  { label: 'Física', to: '/fisica' },
  { label: 'Geometría', to: '/geometria' },
  { label: 'Representación técnica', to: '/representacion-tecnica' },
  { label: 'Resultados', to: '/resultados' },
  { label: 'IA', to: '/ia' },
  { label: 'Sobre el proyecto', to: '/sobre-el-proyecto' },
]

export function Navbar() {
  return (
    <header className="navbar" id="top">
      <a className="navbar__brand" href="#top">
        <svg className="navbar__mark" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="15" fill="var(--color-ball)" />
          <g fill="none" stroke="var(--color-ink)" strokeWidth="1.6">
            <circle cx="16" cy="16" r="15" />
            <path d="M1 16h30M16 1v30" />
            <path d="M16 1c6 4 6 26 0 30M16 1c-6 4-6 26 0 30" />
          </g>
        </svg>
        <span className="navbar__brand-text">
          <span className="navbar__brand-title">Laboratorio de tiro a canasta</span>
          <span className="navbar__brand-subtitle">Laboratorio virtual</span>
        </span>
      </a>

      <nav className="navbar__nav" aria-label="Secciones del laboratorio">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              {item.to ? (
                <Link to={item.to}>{item.label}</Link>
              ) : item.href ? (
                <a href={item.href} aria-current="page">
                  {item.label}
                </a>
              ) : (
                <span className="navbar__pending" title="Próximamente" aria-disabled="true">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <a className="navbar__cta" href="#enfoques">
        Comenzar
      </a>
    </header>
  )
}
