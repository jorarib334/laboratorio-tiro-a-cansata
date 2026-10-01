/**
 * "¿Qué nos dicen los datos?": observaciones calculadas directamente sobre
 * un barrido real (`SweepResult`), nunca redactadas a mano. Para cada eje
 * barrido se mide cuánto varía la fracción de lanzamientos válidos al
 * recorrer ese eje (su "sensibilidad") y si esa variación tiene una
 * tendencia clara al aumentar el valor del eje — si no la tiene, se marca
 * como "mixed" para no forzar un lenguaje absoluto que los datos no
 * justifiquen.
 */

import type { LaunchParams } from '../physics/types'
import type { SweepResult } from './types'

export type Trend = 'increases' | 'decreases' | 'mixed'

export interface AxisInsight {
  key: keyof LaunchParams
  /** Diferencia entre la fracción de válidos máxima y mínima al variar este eje (0-1). */
  sensitivity: number
  /** Valor de este eje donde la fracción de válidos es mayor. */
  bestValue: number
  /** Si la fracción de válidos tiende a subir, bajar o no muestra una tendencia clara al aumentar este eje. */
  trend: Trend
}

export interface DataInsights {
  totalSimulations: number
  validFraction: number
  boundaryFraction: number
  invalidFraction: number
  /** Ejes ordenados de mayor a menor sensibilidad. */
  axisInsights: AxisInsight[]
}

function classifyTrend(fractions: number[]): Trend {
  let increases = 0
  let decreases = 0
  for (let i = 1; i < fractions.length; i += 1) {
    if (fractions[i] > fractions[i - 1]) increases += 1
    else if (fractions[i] < fractions[i - 1]) decreases += 1
  }
  const total = increases + decreases
  if (total === 0) return 'mixed'
  if (increases / total >= 0.7) return 'increases'
  if (decreases / total >= 0.7) return 'decreases'
  return 'mixed'
}

export function deriveInsights(sweep: SweepResult): DataInsights {
  const { cells, axes, values } = sweep
  const total = cells.length

  const validCount = cells.filter((cell) => cell.validity.label === 'valid').length
  const boundaryCount = cells.filter((cell) => cell.validity.label === 'boundary').length
  const invalidCount = total - validCount - boundaryCount

  const axisInsights: AxisInsight[] = axes.map((axis, axisIndex) => {
    const fractions = values[axisIndex].map((value) => {
      const matching = cells.filter((cell) => cell.params[axis.key] === value)
      if (matching.length === 0) return 0
      const acceptable = matching.filter((cell) => cell.validity.label !== 'invalid').length
      return acceptable / matching.length
    })
    const maxFraction = Math.max(...fractions)
    const minFraction = Math.min(...fractions)
    const bestIndex = fractions.indexOf(maxFraction)

    return {
      key: axis.key,
      sensitivity: maxFraction - minFraction,
      bestValue: values[axisIndex][bestIndex],
      trend: classifyTrend(fractions),
    }
  })

  axisInsights.sort((a, b) => b.sensitivity - a.sensitivity)

  return {
    totalSimulations: total,
    validFraction: total > 0 ? validCount / total : 0,
    boundaryFraction: total > 0 ? boundaryCount / total : 0,
    invalidFraction: total > 0 ? invalidCount / total : 0,
    axisInsights,
  }
}
