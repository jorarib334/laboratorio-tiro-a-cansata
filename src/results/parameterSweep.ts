import type { LaunchParams } from '../physics/types'
import { linspace } from './linspace'
import { runSimulation } from './runSimulation'
import type { AxisSweepConfig, SweepResult } from './types'

/**
 * Utilidad de barrido general y reutilizable: dado un lanzamiento base y una
 * lista de ejes a variar (1 o más parámetros de `LaunchParams`), genera el
 * producto cartesiano de todos los valores y simula cada combinación con
 * `runSimulation` (el mismo motor físico+geometría de todo el proyecto).
 *
 * La usa tanto el "Mapa de eficacia" (2 ejes: V0 y θ) como el conjunto de
 * entrenamiento de la IA (4 ejes: V0, θ, y0, d) — un mismo mecanismo, sin
 * duplicar lógica de barrido para cada caso de uso.
 */
export function runParameterSweep(base: LaunchParams, axes: AxisSweepConfig[]): SweepResult {
  const values = axes.map((axis) => linspace(axis.min, axis.max, axis.steps))

  function expand(axisIndex: number, current: LaunchParams): LaunchParams[] {
    if (axisIndex === axes.length) return [current]
    const axis = axes[axisIndex]
    const combos: LaunchParams[] = []
    for (const value of values[axisIndex]) {
      combos.push(...expand(axisIndex + 1, { ...current, [axis.key]: value }))
    }
    return combos
  }

  const cells = expand(0, base).map((params) => runSimulation(params))

  return { base, axes, values, cells }
}
