import { linspace } from './linspace'

export interface AxisRange {
  min: number
  max: number
  steps: number
}

export interface Grid<T> {
  /** Valores del eje θ (X). */
  angles: number[]
  /** Valores del eje V0 (Y). */
  speeds: number[]
  /** Producto cartesiano θ×V0: índice = angleIndex*speeds.length + speedIndex. */
  cells: T[]
}

/**
 * Rejilla genérica θ×V0 usada por el mapa de eficacia y el mapa de tolerancia
 * (`efficacyIndex.ts`, `marginAnalysis.ts` via `computeToleranceGrid`) — una
 * sola iteración cartesiana compartida, sin duplicarla en cada mapa.
 */
export function buildGrid<T>(angleAxis: AxisRange, speedAxis: AxisRange, compute: (initialSpeed: number, launchAngleDeg: number) => T): Grid<T> {
  const angles = linspace(angleAxis.min, angleAxis.max, angleAxis.steps)
  const speeds = linspace(speedAxis.min, speedAxis.max, speedAxis.steps)
  const cells: T[] = []
  for (const launchAngleDeg of angles) {
    for (const initialSpeed of speeds) {
      cells.push(compute(initialSpeed, launchAngleDeg))
    }
  }
  return { angles, speeds, cells }
}
