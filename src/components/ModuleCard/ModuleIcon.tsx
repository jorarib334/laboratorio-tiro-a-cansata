import type { ReactNode } from 'react'
import type { LabModule } from '../../modules/types'

const paths: Record<LabModule['id'], ReactNode> = {
  physics: (
    <>
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  geometry: (
    <>
      <path d="M4 19 L13 4 L20 19 Z" />
      <path d="M9 19 L13 11.5 L16.5 19" />
    </>
  ),
  ai: (
    <>
      <path d="M9 4.5a3.2 3.2 0 0 0-3.2 3.2c0 .3 0 .6.1.9A3 3 0 0 0 5 14a3 3 0 0 0 2 2.8V18a2.5 2.5 0 0 0 2.5 2.5h1V4.5H9Z" />
      <path d="M15 4.5a3.2 3.2 0 0 1 3.2 3.2c0 .3 0 .6-.1.9A3 3 0 0 1 19 14a3 3 0 0 1-2 2.8V18a2.5 2.5 0 0 1-2.5 2.5h-1V4.5H15Z" />
    </>
  ),
  technical: (
    <>
      <path d="M12 2 L20 6.5 L12 11 L4 6.5 Z" />
      <path d="M4 6.5 L4 17.5 L12 22 L12 11 Z" />
      <path d="M20 6.5 L20 17.5 L12 22 L12 11 Z" />
    </>
  ),
  results: (
    <>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" fill="currentColor" stroke="none" />
    </>
  ),
}

interface ModuleIconProps {
  id: LabModule['id']
  className?: string
}

export function ModuleIcon({ id, className = 'module-card__icon' }: ModuleIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[id]}
    </svg>
  )
}
