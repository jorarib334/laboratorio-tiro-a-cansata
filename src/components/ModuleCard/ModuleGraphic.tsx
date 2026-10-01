import type { LabModule } from '../../modules/types'

/**
 * La "ventana" de cada módulo: una escena propia en SVG (no un icono, no
 * una imagen estática) que anticipa de qué trata la disciplina. Cada una
 * usa el color de acento del propio módulo, y algunos trazos reaccionan al
 * :hover de la tarjeta (ver module-card--visible:hover en ModuleCard.css).
 */
export function ModuleGraphic({ id }: { id: LabModule['id'] }) {
  switch (id) {
    case 'physics':
      return (
        <svg className="module-graphic" viewBox="0 0 220 120" role="presentation" aria-hidden="true">
          <line x1="18" y1="95" x2="205" y2="95" className="module-graphic__axis" />
          <line x1="28" y1="95" x2="28" y2="22" className="module-graphic__axis" />
          <path d="M 34 88 Q 108 20 182 60" className="module-graphic__stroke module-graphic__hover-draw" fill="none" />
          <circle cx="182" cy="60" r="3" className="module-graphic__dot" />
          <line x1="34" y1="88" x2="54" y2="58" className="module-graphic__vector" />
          <path d="M 34 88 A 18 18 0 0 0 46 74" className="module-graphic__thin" fill="none" />
        </svg>
      )
    case 'geometry':
      return (
        <svg className="module-graphic" viewBox="0 0 220 120" role="presentation" aria-hidden="true">
          <circle cx="150" cy="55" r="32" className="module-graphic__stroke" fill="none" />
          <circle cx="150" cy="55" r="2" className="module-graphic__dot" />
          <circle cx="93" cy="82" r="15" className="module-graphic__stroke module-graphic__hover-draw" fill="none" />
          <circle cx="93" cy="82" r="2" className="module-graphic__dot" />
          <line x1="107" y1="76" x2="120" y2="70" className="module-graphic__thin" strokeDasharray="2 3" />
          <line x1="150" y1="23" x2="150" y2="87" className="module-graphic__thin" strokeDasharray="1 4" />
        </svg>
      )
    case 'technical':
      return (
        <svg className="module-graphic" viewBox="0 0 220 120" role="presentation" aria-hidden="true">
          <g className="module-graphic__hover-draw">
            <path d="M110 18 L152 40 L110 62 L68 40 Z" className="module-graphic__stroke" fill="none" />
            <path d="M68 40 L68 82 L110 104 L110 62 Z" className="module-graphic__thin" fill="none" />
            <path d="M152 40 L152 82 L110 104 L110 62 Z" className="module-graphic__thin" fill="none" />
          </g>
          <circle cx="110" cy="62" r="3" className="module-graphic__dot" />
          <line x1="68" y1="82" x2="68" y2="98" className="module-graphic__thin" strokeDasharray="1 4" />
          <line x1="152" y1="82" x2="152" y2="98" className="module-graphic__thin" strokeDasharray="1 4" />
          <rect x="50" y="98" width="120" height="10" className="module-graphic__thin" fill="none" />
        </svg>
      )
    case 'results':
      return (
        <svg className="module-graphic" viewBox="0 0 220 120" role="presentation" aria-hidden="true">
          <line x1="24" y1="102" x2="24" y2="18" className="module-graphic__axis" />
          <line x1="24" y1="102" x2="200" y2="102" className="module-graphic__axis" />
          <g className="module-graphic__hover-draw">
            {[0, 1, 2, 3, 4].flatMap((col) =>
              [0, 1, 2].map((row) => {
                const distanceFromBand = Math.abs(col - row * 1.3 - 0.5)
                const opacity = distanceFromBand < 0.9 ? 0.9 : distanceFromBand < 1.8 ? 0.45 : 0.18
                return (
                  <rect
                    key={`${col}-${row}`}
                    x={34 + col * 32}
                    y={26 + row * 24}
                    width="26"
                    height="18"
                    fill="var(--accent)"
                    opacity={opacity}
                  />
                )
              }),
            )}
          </g>
        </svg>
      )
    case 'ai':
    default:
      return (
        <svg className="module-graphic" viewBox="0 0 220 120" role="presentation" aria-hidden="true">
          <rect x="16" y="14" width="188" height="92" className="module-graphic__thin" strokeDasharray="1 4" fill="none" />
          <g className="module-graphic__hover-draw">
            <line x1="45" y1="85" x2="95" y2="40" className="module-graphic__thin" />
            <line x1="95" y1="40" x2="150" y2="65" className="module-graphic__thin" />
            <line x1="95" y1="40" x2="140" y2="25" className="module-graphic__thin" />
            <line x1="150" y1="65" x2="185" y2="50" className="module-graphic__thin" />
          </g>
          <circle cx="45" cy="85" r="4" className="module-graphic__node" />
          <circle cx="140" cy="25" r="4" className="module-graphic__node" />
          <circle cx="150" cy="65" r="4" className="module-graphic__node" />
          <circle cx="185" cy="50" r="4" className="module-graphic__node" />
          <circle cx="95" cy="40" r="6" className="module-graphic__dot" />
        </svg>
      )
  }
}
