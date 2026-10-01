import { writeFileSync } from 'node:fs'
import { runSimulation } from '../../../src/results/runSimulation'
import type { LaunchParams } from '../../../src/physics/types'
import { DEFAULT_RELEASE_HEIGHT, DEFAULT_DISTANCE_TO_HOOP, DEFAULT_HOOP_HEIGHT, DEFAULT_GRAVITY } from '../../../src/physics/constants'

/**
 * Barrido para el apartado 4.4: reutiliza runSimulation (=> computeLaunchResults
 * de Física + assessValidity de Geometría), sin ninguna ecuación nueva.
 * Condiciones fijas = mismos valores por defecto que usa el resto del
 * trabajo (src/physics/constants.ts).
 *
 * Ejecutar desde la raíz del proyecto con: npx tsx docs/investigacion-4-4/scripts/generar-datos.ts
 */

const FIXED = {
  releaseHeight: DEFAULT_RELEASE_HEIGHT, // 2.2 m
  distanceToHoop: DEFAULT_DISTANCE_TO_HOOP, // 4.225 m
  hoopHeight: DEFAULT_HOOP_HEIGHT, // 3.05 m
  gravity: DEFAULT_GRAVITY, // 9.81 m/s^2
}

const V0_MIN = 3
const V0_MAX = 14
const V0_STEP = 0.2

const THETA_MIN = 15
const THETA_MAX = 75
const THETA_STEP = 2

interface Row {
  v0: number
  theta: number
  y0: number
  d: number
  hoopHeight: number
  favorable: boolean
  validityLabel: string
  relation: string
  clearance: number
  maxHeight: number
  flightTime: number
}

const rows: Row[] = []

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

for (let v0raw = V0_MIN; v0raw <= V0_MAX + 1e-9; v0raw += V0_STEP) {
  const v0 = round(v0raw, 2)
  for (let thetaRaw = THETA_MIN; thetaRaw <= THETA_MAX + 1e-9; thetaRaw += THETA_STEP) {
    const theta = round(thetaRaw, 2)
    const params: LaunchParams = {
      initialSpeed: v0,
      launchAngleDeg: theta,
      ...FIXED,
    }
    const result = runSimulation(params)
    rows.push({
      v0,
      theta,
      y0: FIXED.releaseHeight,
      d: FIXED.distanceToHoop,
      hoopHeight: FIXED.hoopHeight,
      favorable: result.validity.label !== 'invalid',
      validityLabel: result.validity.label,
      relation: result.validity.relation,
      clearance: round(result.validity.clearance, 4),
      maxHeight: round(result.results.maxHeight, 3),
      flightTime: round(result.results.flightTime, 3),
    })
  }
}

// --- CSV ---
const header = 'V0_m_s,theta_deg,y0_m,d_m,altura_aro_m,favorable,estado,relacion_geometrica,margen_m,altura_maxima_m,tiempo_vuelo_s'
const csvLines = rows.map((r) =>
  [r.v0, r.theta, r.y0, r.d, r.hoopHeight, r.favorable ? 'favorable' : 'desfavorable', r.validityLabel, r.relation, r.clearance, r.maxHeight, r.flightTime].join(','),
)
writeFileSync('docs/investigacion-4-4/mapa-eficacia-v0-theta.csv', [header, ...csvLines].join('\n'), 'utf8')

// --- Summary stats for interpretation (no invented conclusions) ---
const total = rows.length
const favorableRows = rows.filter((r) => r.favorable)
const favorableCount = favorableRows.length

const v0Values = [...new Set(rows.map((r) => r.v0))].sort((a, b) => a - b)
const thetaValues = [...new Set(rows.map((r) => r.theta))].sort((a, b) => a - b)

const favorableByTheta = thetaValues.map((theta) => {
  const inRow = rows.filter((r) => r.theta === theta)
  const favInRow = inRow.filter((r) => r.favorable)
  const v0s = favInRow.map((r) => r.v0)
  return {
    theta,
    favorableCount: favInRow.length,
    v0Min: v0s.length > 0 ? Math.min(...v0s) : null,
    v0Max: v0s.length > 0 ? Math.max(...v0s) : null,
  }
})

const favorableByV0 = v0Values.map((v0) => {
  const inCol = rows.filter((r) => r.v0 === v0)
  const favInCol = inCol.filter((r) => r.favorable)
  const thetas = favInCol.map((r) => r.theta)
  return {
    v0,
    favorableCount: favInCol.length,
    thetaMin: thetas.length > 0 ? Math.min(...thetas) : null,
    thetaMax: thetas.length > 0 ? Math.max(...thetas) : null,
  }
})

const v0OfFavorable = favorableRows.map((r) => r.v0)
const thetaOfFavorable = favorableRows.map((r) => r.theta)

const summary = {
  totalCombinations: total,
  favorableCount,
  favorableFraction: round(favorableCount / total, 4),
  v0Range: { min: V0_MIN, max: V0_MAX, step: V0_STEP },
  thetaRange: { min: THETA_MIN, max: THETA_MAX, step: THETA_STEP },
  favorableBoundingBox:
    favorableCount > 0
      ? {
          v0Min: Math.min(...v0OfFavorable),
          v0Max: Math.max(...v0OfFavorable),
          thetaMin: Math.min(...thetaOfFavorable),
          thetaMax: Math.max(...thetaOfFavorable),
        }
      : null,
  favorableByTheta,
  favorableByV0,
  fixed: FIXED,
}

writeFileSync('docs/investigacion-4-4/resumen-estadisticas.json', JSON.stringify(summary, null, 2), 'utf8')

console.log(JSON.stringify(summary, null, 2))
