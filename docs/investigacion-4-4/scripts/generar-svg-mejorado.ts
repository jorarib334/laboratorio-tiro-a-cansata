import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Dos variantes del mismo mapa de eficacia (mismos datos de
 * mapa-eficacia-v0-theta.csv, sin recalcular nada), pensadas para que las 67
 * combinaciones favorables se aprecien mejor que en la versión original:
 *
 * 1. "recortado": mismo tamaño de celda real, pero encuadrado solo en la
 *    zona donde hay algo que ver (en vez de todo el rango 3-14 m/s /
 *    15-75°, que deja mucho espacio vacío) — ninguna celda se agranda, solo
 *    se quita el margen desfavorable irrelevante.
 * 2. "resaltado": el rango completo original, pero las celdas favorables se
 *    dibujan con un contorno oscuro y un poco más grandes que su tamaño real
 *    para que un punto aislado no se pierda a esta escala — indicado
 *    explícitamente en el pie de la figura, para no dar una impresión de
 *    tamaño real que no es.
 *
 * Ejecutar desde la raíz: npx tsx docs/investigacion-4-4/scripts/generar-svg-mejorado.ts
 */

interface Row {
  v0: number
  theta: number
  favorable: boolean
}

const csv = readFileSync('docs/investigacion-4-4/mapa-eficacia-v0-theta.csv', 'utf8').trim().split('\n')
const [, ...dataLines] = csv
const rows: Row[] = dataLines.map((line) => {
  const cols = line.split(',')
  return { v0: Number(cols[0]), theta: Number(cols[1]), favorable: cols[5] === 'favorable' }
})

const v0Values = [...new Set(rows.map((r) => r.v0))].sort((a, b) => a - b)
const thetaValues = [...new Set(rows.map((r) => r.theta))].sort((a, b) => a - b)
const v0Step = v0Values[1] - v0Values[0]
const thetaStep = thetaValues[1] - thetaValues[0]

const AXIS_COLOR = '#2a2620'
const GRID_COLOR = '#cfc8b8'
const FAVORABLE_COLOR = '#2f8f5c'
const FAVORABLE_OUTLINE = '#173d28'
const UNFAVORABLE_COLOR = '#e3ddd0'

interface RenderOptions {
  outputPath: string
  subtitleExtra: string
  v0Min: number
  v0Max: number
  thetaMin: number
  thetaMax: number
  v0TickStep: number
  thetaTickStep: number
  dilate: number
  outline: boolean
}

function renderMap(opts: RenderOptions): void {
  const WIDTH = 960
  const HEIGHT = 720
  const MARGIN = { left: 90, right: 40, top: 110, bottom: 80 }
  const chartW = WIDTH - MARGIN.left - MARGIN.right
  const chartH = HEIGHT - MARGIN.top - MARGIN.bottom

  const scaleV0 = (v0: number) => MARGIN.left + ((v0 - opts.v0Min) / (opts.v0Max - opts.v0Min)) * chartW
  const scaleTheta = (theta: number) => MARGIN.top + (1 - (theta - opts.thetaMin) / (opts.thetaMax - opts.thetaMin)) * chartH

  const cellW = (chartW / (opts.v0Max - opts.v0Min)) * v0Step
  const cellH = (chartH / (opts.thetaMax - opts.thetaMin)) * thetaStep

  const visibleRows = rows.filter((r) => r.v0 >= opts.v0Min - v0Step && r.v0 <= opts.v0Max + v0Step && r.theta >= opts.thetaMin - thetaStep && r.theta <= opts.thetaMax + thetaStep)
  const totalFavorable = rows.filter((r) => r.favorable).length

  // Desfavorables primero, favorables encima (y con el posible "inflado"), para que nunca quede tapada una celda favorable.
  const unfavorableCells = visibleRows
    .filter((r) => !r.favorable)
    .map((r) => {
      const x = scaleV0(r.v0) - cellW / 2
      const y = scaleTheta(r.theta) - cellH / 2
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(cellW + 0.6).toFixed(2)}" height="${(cellH + 0.6).toFixed(2)}" fill="${UNFAVORABLE_COLOR}" />`
    })
    .join('\n')

  const d = opts.dilate
  const favorableCells = visibleRows
    .filter((r) => r.favorable)
    .map((r) => {
      const x = scaleV0(r.v0) - cellW / 2 - d
      const y = scaleTheta(r.theta) - cellH / 2 - d
      const stroke = opts.outline ? ` stroke="${FAVORABLE_OUTLINE}" stroke-width="1.2"` : ''
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(cellW + 0.6 + d * 2).toFixed(2)}" height="${(cellH + 0.6 + d * 2).toFixed(2)}" fill="${FAVORABLE_COLOR}"${stroke} />`
    })
    .join('\n')

  const v0Ticks: number[] = []
  for (let v = Math.ceil(opts.v0Min); v <= opts.v0Max; v += opts.v0TickStep) v0Ticks.push(Number(v.toFixed(1)))
  const thetaTicks: number[] = []
  for (let t = Math.ceil(opts.thetaMin); t <= opts.thetaMax; t += opts.thetaTickStep) thetaTicks.push(t)

  const v0TickMarks = v0Ticks
    .map((v) => {
      const x = scaleV0(v)
      return `<line x1="${x.toFixed(1)}" y1="${MARGIN.top}" x2="${x.toFixed(1)}" y2="${MARGIN.top + chartH}" stroke="${GRID_COLOR}" stroke-width="1" />
<text x="${x.toFixed(1)}" y="${MARGIN.top + chartH + 22}" font-size="13" text-anchor="middle" fill="${AXIS_COLOR}" font-family="Arial, sans-serif">${v}</text>`
    })
    .join('\n')

  const thetaTickMarks = thetaTicks
    .map((t) => {
      const y = scaleTheta(t)
      return `<line x1="${MARGIN.left}" y1="${y.toFixed(1)}" x2="${MARGIN.left + chartW}" y2="${y.toFixed(1)}" stroke="${GRID_COLOR}" stroke-width="1" />
<text x="${MARGIN.left - 14}" y="${(y + 4).toFixed(1)}" font-size="13" text-anchor="end" fill="${AXIS_COLOR}" font-family="Arial, sans-serif">${t}°</text>`
    })
    .join('\n')

  const svg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="#ffffff" />

  <text x="${WIDTH / 2}" y="34" font-size="20" font-weight="700" text-anchor="middle" fill="${AXIS_COLOR}">Mapa de eficacia del lanzamiento en funci&#243;n de V&#8320; y &#952;</text>
  <text x="${WIDTH / 2}" y="58" font-size="13.5" text-anchor="middle" fill="#54503f">y&#8320; = 2,20 m &#183; d = 4,225 m &#183; altura del aro = 3,05 m &#183; g = 9,81 m/s&#178;</text>
  <text x="${WIDTH / 2}" y="78" font-size="12.5" font-style="italic" text-anchor="middle" fill="#726c58">${opts.subtitleExtra}</text>

  <rect x="${MARGIN.left}" y="${MARGIN.top}" width="${chartW}" height="${chartH}" fill="${UNFAVORABLE_COLOR}" />
  ${thetaTickMarks}
  ${v0TickMarks}
  ${unfavorableCells}
  ${favorableCells}

  <rect x="${MARGIN.left}" y="${MARGIN.top}" width="${chartW}" height="${chartH}" fill="none" stroke="${AXIS_COLOR}" stroke-width="1.5" />

  <g transform="translate(${MARGIN.left + 14}, ${MARGIN.top + chartH - 44})">
    <rect x="0" y="0" width="290" height="30" fill="#ffffff" stroke="${AXIS_COLOR}" stroke-width="1" opacity="0.92" />
    <text x="10" y="20" font-size="14" font-weight="700" fill="${AXIS_COLOR}">N = ${totalFavorable} configuraciones favorables (de 1.736)</text>
  </g>

  <text x="${MARGIN.left + chartW / 2}" y="${HEIGHT - 28}" font-size="15" text-anchor="middle" fill="${AXIS_COLOR}">Velocidad inicial V&#8320; (m/s)</text>
  <text x="26" y="${MARGIN.top + chartH / 2}" font-size="15" text-anchor="middle" fill="${AXIS_COLOR}" transform="rotate(-90 26 ${MARGIN.top + chartH / 2})">&#193;ngulo de lanzamiento &#952; (&#176;)</text>

  <g transform="translate(${WIDTH - MARGIN.right - 230}, ${MARGIN.top - 40})">
    <rect x="0" y="-14" width="14" height="14" fill="${FAVORABLE_COLOR}"${opts.outline ? ` stroke="${FAVORABLE_OUTLINE}" stroke-width="1.2"` : ''} />
    <text x="20" y="-3" font-size="13" fill="${AXIS_COLOR}">Favorable</text>
    <rect x="110" y="-14" width="14" height="14" fill="${UNFAVORABLE_COLOR}" stroke="${GRID_COLOR}" />
    <text x="130" y="-3" font-size="13" fill="${AXIS_COLOR}">Desfavorable</text>
  </g>
</svg>`

  writeFileSync(opts.outputPath, svg, 'utf8')
  console.log('Generado:', opts.outputPath)
}

// Variante 1: recortada a la zona con datos relevantes, tamaño de celda real (sin inflar).
renderMap({
  outputPath: 'docs/investigacion-4-4/mapa-eficacia-v0-theta-recortado.svg',
  subtitleExtra: 'Encuadre recortado a la zona relevante (V₀ 6,5–14,5 m/s, θ 14°–71°) — mismas celdas, mismo tamaño real, sin margen vacío',
  v0Min: 6.5,
  v0Max: 14.5,
  thetaMin: 14,
  thetaMax: 71,
  v0TickStep: 1,
  thetaTickStep: 5,
  dilate: 0,
  outline: true,
})

// Variante 2: rango completo original, pero celdas favorables resaltadas (agrandadas) para que ningún punto aislado pase desapercibido.
renderMap({
  outputPath: 'docs/investigacion-4-4/mapa-eficacia-v0-theta-resaltado.svg',
  subtitleExtra: 'Rango completo original — las celdas favorables se han agrandado y remarcado para facilitar su lectura visual (no a escala real)',
  v0Min: 3,
  v0Max: 14,
  thetaMin: 15,
  thetaMax: 75,
  v0TickStep: 1,
  thetaTickStep: 10,
  dilate: 3.5,
  outline: true,
})
