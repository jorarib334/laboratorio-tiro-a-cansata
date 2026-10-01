/**
 * Tramos del progreso de scroll (0→1) para el hero. Única fuente de verdad:
 * los componentes visuales solo leen estos rangos, no reparten números por
 * el JSX.
 */
export const STAGES = {
  /** Escena inicial y título. */
  intro: [0, 0.2],
  /** El vídeo avanza, gana protagonismo el balón/pista. */
  advance: [0.2, 0.45],
  /** Elementos científicos y geométricos sutiles. */
  science: [0.45, 0.7],
  /** Trayectoria y aro con protagonismo. */
  trajectory: [0.7, 0.9],
  /** Final del vídeo y transición hacia el laboratorio. */
  transition: [0.9, 1],
} as const

/** 0 antes del tramo, 1 después, interpolado linealmente dentro de él. */
export function stageProgress(progress: number, [start, end]: readonly [number, number]) {
  if (end <= start) return progress >= end ? 1 : 0
  return Math.min(1, Math.max(0, (progress - start) / (end - start)))
}
