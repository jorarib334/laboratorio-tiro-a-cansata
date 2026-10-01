import { PLAYER_HAND_LOCAL } from './playerGeometry'

interface PlayerFigureProps {
  /**
   * Ruta a una ilustración externa (fondo transparente) para sustituir el
   * pictograma procedural, si en el futuro se añade un asset visual más
   * realista. Mientras no se indique, se dibuja la silueta vectorial.
   * Nota: la escena aplica `scale(1,-1)` al grupo del jugador (coordenadas
   * locales con Y hacia arriba); por eso la imagen se corrige con un
   * segundo `scale(1,-1)` interno para no quedar invertida.
   */
  imageSrc?: string
}

/**
 * Pictograma técnico del lanzador: silueta vectorial (no un muñeco de
 * líneas sueltas ni una figura geométrica genérica), en pose de tiro con el
 * brazo de lanzamiento extendido y la mano orientada hacia arriba/adelante,
 * siguiendo el gesto de un "follow-through". Coordenadas propias en
 * metros, eje Y hacia arriba.
 */
export function PlayerFigure({ imageSrc }: PlayerFigureProps) {
  if (imageSrc) {
    return (
      <image
        href={imageSrc}
        x={-0.2}
        y={-2.3}
        width={0.75}
        height={2.3}
        transform="scale(1,-1)"
        preserveAspectRatio="xMidYMax meet"
      />
    )
  }

  return (
    <g className="launch-scene__player">
      {/* Cuerpo (masa del torso, no solo una línea) */}
      <ellipse className="launch-scene__player-torso" cx={-0.01} cy={1.28} rx={0.09} ry={0.34} />

      {/* Cabeza */}
      <circle className="launch-scene__player-head" cx={0.02} cy={1.8} r={0.15} />

      {/* Pierna de impulso (extendida atrás) */}
      <path className="launch-scene__player-limb" d="M -0.02 0.95 Q -0.2 0.75 -0.16 0.55 Q -0.13 0.35 -0.08 0.08" />

      {/* Pierna flexionada (recogida) */}
      <path className="launch-scene__player-limb" d="M -0.02 0.95 Q 0.1 0.8 0.18 0.68 Q 0.21 0.45 0.22 0.15" />

      {/* Brazo de guía, flexionado tras la suelta */}
      <path className="launch-scene__player-limb" d="M -0.02 1.58 Q -0.2 1.48 -0.18 1.4 Q -0.14 1.32 -0.06 1.3" />

      {/* Brazo de lanzamiento, extendido, con la muñeca orientada hacia el lanzamiento */}
      <path className="launch-scene__player-limb" d="M 0 1.6 Q 0.14 1.8 0.22 1.92 Q 0.28 2.02 0.32 2.1" />
      <path
        className="launch-scene__player-limb launch-scene__player-limb--hand"
        d={`M 0.32 2.1 Q 0.36 2.16 ${PLAYER_HAND_LOCAL.x} ${PLAYER_HAND_LOCAL.y}`}
      />
    </g>
  )
}
