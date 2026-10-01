import { readFileSync, writeFileSync } from 'node:fs'

/** Ejecutar desde la raíz del proyecto con: npx tsx docs/investigacion-4-4/scripts/generar-svg.ts (después de generar-datos.ts) */

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

const V0_MIN = 3
const V0_MAX = 14
const THETA_MIN = 15
const THETA_MAX = 75

const WIDTH = 960
const HEIGHT = 700
const MARGIN = { left: 90, right: 40, top: 90, bottom: 80 }
const chartW = WIDTH - MARGIN.left - MARGIN.right
const chartH = HEIGHT - MARGIN.top - MARGIN.bottom

function scaleV0(v0: number): number {
  return MARGIN.left + ((v0 - V0_MIN) / (V0_MAX - V0_MIN)) * chartW
}
function scaleTheta(theta: number): number {
  // Mayor ángulo arriba, como en un gráfico científico convencional.
  return MARGIN.top + (1 - (theta - THETA_MIN) / (THETA_MAX - THETA_MIN)) * chartH
}

const v0Values = [...new Set(rows.map((r) => r.v0))].sort((a, b) => a - b)
const thetaValues = [...new Set(rows.map((r) => r.theta))].sort((a, b) => a - b)
const cellW = chartW / v0Values.length
const cellH = chartH / thetaValues.length

const FAVORABLE_COLOR = '#2f8f5c'
const UNFAVORABLE_COLOR = '#e3ddd0'
const AXIS_COLOR = '#2a2620'
const GRID_COLOR = '#cfc8b8'

const cells = rows
  .map((r) => {
    const x = scaleV0(r.v0) - cellW / 2
    const y = scaleTheta(r.theta) - cellH / 2
    const fill = r.favorable ? FAVORABLE_COLOR : UNFAVORABLE_COLOR
    return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(cellW + 0.6).toFixed(2)}" height="${(cellH + 0.6).toFixed(2)}" fill="${fill}" />`
  })
  .join('\n')

const v0Ticks = []
for (let v = 3; v <= 14; v += 1) v0Ticks.push(v)
const thetaTicks = [15, 25, 35, 45, 55, 65, 75]

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

  <rect x="${MARGIN.left}" y="${MARGIN.top}" width="${chartW}" height="${chartH}" fill="${UNFAVORABLE_COLOR}" />
  ${thetaTickMarks}
  ${v0TickMarks}
  ${cells}

  <rect x="${MARGIN.left}" y="${MARGIN.top}" width="${chartW}" height="${chartH}" fill="none" stroke="${AXIS_COLOR}" stroke-width="1.5" />

  <text x="${MARGIN.left + chartW / 2}" y="${HEIGHT - 28}" font-size="15" text-anchor="middle" fill="${AXIS_COLOR}">Velocidad inicial V&#8320; (m/s)</text>
  <text x="26" y="${MARGIN.top + chartH / 2}" font-size="15" text-anchor="middle" fill="${AXIS_COLOR}" transform="rotate(-90 26 ${MARGIN.top + chartH / 2})">&#193;ngulo de lanzamiento &#952; (&#176;)</text>

  <g transform="translate(${WIDTH - MARGIN.right - 230}, ${MARGIN.top - 34})">
    <rect x="0" y="-14" width="14" height="14" fill="${FAVORABLE_COLOR}" />
    <text x="20" y="-3" font-size="13" fill="${AXIS_COLOR}">Favorable</text>
    <rect x="110" y="-14" width="14" height="14" fill="${UNFAVORABLE_COLOR}" stroke="${GRID_COLOR}" />
    <text x="130" y="-3" font-size="13" fill="${AXIS_COLOR}">Desfavorable</text>
  </g>
</svg>`

writeFileSync('docs/investigacion-4-4/mapa-eficacia-v0-theta.svg', svg, 'utf8')
console.log('SVG generado:', rows.length, 'celdas')
