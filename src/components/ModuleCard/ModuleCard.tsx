import type { CSSProperties, ReactNode } from 'react'
import type { LabModule } from '../../modules/types'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import { Link } from '../../routing/Link'
import { ModuleIcon } from './ModuleIcon'
import { ModuleGraphic } from './ModuleGraphic'
import './ModuleCard.css'

interface ModuleCardProps {
  module: LabModule
  index: number
}

export function ModuleCard({ module, index }: ModuleCardProps) {
  const isPending = module.status === 'en-estudio'
  const { ref, isVisible } = useRevealOnScroll<HTMLElement>()

  const body: ReactNode = (
    <>
      <div className="module-card__window">
        <ModuleGraphic id={module.id} />
        <span className="module-card__index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="module-card__icon-badge">
          <ModuleIcon id={module.id} />
        </div>
      </div>
      <h3 className="module-card__name">{module.name}</h3>
      <p className="module-card__summary">{module.summary}</p>
      <p className="module-card__detail">{module.detail}</p>
      <div className="module-card__footer">
        <span className="module-card__status">
          {isPending && <span className="module-card__status-dot" aria-hidden="true" />}
          {module.statusLabel}
        </span>
        <span className="module-card__arrow" aria-hidden="true">
          →
        </span>
      </div>
    </>
  )

  return (
    <article
      ref={ref}
      className={`module-card${isVisible ? ' module-card--visible' : ''}`}
      style={
        {
          '--accent': `var(${module.accentVar})`,
          '--reveal-delay': `${index * 110}ms`,
        } as CSSProperties
      }
    >
      {module.route ? (
        <Link to={module.route} className="module-card__body">
          {body}
        </Link>
      ) : (
        <div className="module-card__body">{body}</div>
      )}
    </article>
  )
}
