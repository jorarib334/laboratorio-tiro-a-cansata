import { useMemo, useState } from 'react'
import type { LaunchParams } from '../../../physics/types'
import { computeEfficacyGrid } from '../../../results/efficacyIndex'
import { computeToleranceGrid } from '../../../results/marginAnalysis'

export interface LaunchMapsConfig {
  speedMin: number
  speedMax: number
  angleMin: number
  angleMax: number
  resolution: number
}

const DEFAULT_CONFIG: LaunchMapsConfig = {
  speedMin: 3,
  speedMax: 14,
  angleMin: 15,
  angleMax: 75,
  // Con celdas más pequeñas los porcentajes/grados escritos dentro de cada
  // una dejan de leerse — 10x10 mantiene el número legible.
  resolution: 10,
}

type Context = Pick<LaunchParams, 'releaseHeight' | 'distanceToHoop' | 'hoopHeight' | 'gravity'>

function buildBase(config: LaunchMapsConfig, context: Context): LaunchParams {
  return { initialSpeed: config.speedMin, launchAngleDeg: config.angleMin, ...context }
}

function buildGrids(config: LaunchMapsConfig, context: Context) {
  const base = buildBase(config, context)
  const angleAxis = { min: config.angleMin, max: config.angleMax, steps: config.resolution }
  const speedAxis = { min: config.speedMin, max: config.speedMax, steps: config.resolution }
  return {
    efficacyGrid: computeEfficacyGrid(base, angleAxis, speedAxis),
    toleranceGrid: computeToleranceGrid(base, angleAxis, speedAxis),
  }
}

/**
 * Mapa de eficacia y mapa de tolerancia COMPARTEN un único rango/resolución
 * θ×V0. Hay dos cosas distintas que pueden cambiar, y se tratan de forma
 * distinta a propósito:
 *
 * - El CONTEXTO (y0, d, altura del aro — el lanzamiento actual del
 *   Explorador, en `ResultsPage`): las rejillas se recalculan SIEMPRE que
 *   cambia, automáticamente (`useMemo`), sin ningún botón — es la variable
 *   del lanzamiento, tiene que reaccionar de verdad.
 * - El RANGO/RESOLUCIÓN del propio mapa (θ/V0 mínimo-máximo, nº de celdas):
 *   es una preferencia de visualización, no un dato del lanzamiento, así
 *   que se queda pendiente de aplicar con "Generar mapas" — para no
 *   recalcular la rejilla entera en cada pulsación mientras se escribe un
 *   número o se arrastra la resolución.
 */
export function useLaunchMaps(context: Context) {
  const [config, setConfig] = useState<LaunchMapsConfig>(DEFAULT_CONFIG)
  const [appliedConfig, setAppliedConfig] = useState<LaunchMapsConfig>(DEFAULT_CONFIG)

  function updateConfig(patch: Partial<LaunchMapsConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }))
  }

  function generate() {
    setAppliedConfig(config)
  }

  const grids = useMemo(() => buildGrids(appliedConfig, context), [appliedConfig, context])

  return { config, updateConfig, efficacyGrid: grids.efficacyGrid, toleranceGrid: grids.toleranceGrid, generate }
}
