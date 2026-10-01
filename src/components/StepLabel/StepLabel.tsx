import type { CSSProperties } from 'react'
import './StepLabel.css'

interface StepLabelProps {
  step: number
  children: string
  /** Token de color del módulo (ver `src/styles/tokens.css`), p.ej. '--color-physics'. */
  accentVar?: string
}

/** Etiqueta "N · texto" que guía al usuario por las fases de un módulo del laboratorio. */
export function StepLabel({ step, children, accentVar = '--color-physics' }: StepLabelProps) {
  const style = { '--step-label-accent': `var(${accentVar})` } as CSSProperties

  return (
    <div className="step-label" style={style}>
      <span className="step-label__dot" aria-hidden="true" />
      <span className="step-label__index">{step.toString().padStart(2, '0')}</span>
      <span className="step-label__text">{children}</span>
    </div>
  )
}
