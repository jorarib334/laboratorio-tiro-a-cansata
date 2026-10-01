/**
 * Escalas de color en 5 bandas discretas (Muy baja/Baja/Media/Alta/Muy alta),
 * una para el mapa de eficacia (rojo→verde) y otra para el de tolerancia
 * (azul oscuro→azul claro), para poder mostrar una leyenda con parejas
 * color+rango legibles (en vez de un degradado continuo sin marcas).
 *
 * Los rangos de cada banda se calculan sobre los valores REALES del mapa
 * que se está viendo (ancladas en 0, que es un valor real posible, no un
 * artefacto): así el mejor punto de cualquier mapa cae siempre en la banda
 * más alta (verde/azul claro), en vez de compararlo contra un 100%
 * absoluto que casi nunca se alcanza — ver la entrada de la bitácora sobre
 * esta decisión.
 */

export interface Band {
  label: string
  color: string
  min: number
  max: number
}

const BAND_LABELS = ['Muy baja', 'Baja', 'Media', 'Alta', 'Muy alta']

/** Mismos tonos que `EFFICACY_COLORS` en `validity.ts` (invalid/boundary/valid/high-margin), más un naranja intermedio — para que este mapa y el resto de la interfaz usen el mismo lenguaje de color. */
const EFFICACY_PALETTE = ['#8a3714', '#b8541f', '#d9a441', '#4f9d84', '#8fe6c2']

/** Azules (no usados en ningún otro sitio del laboratorio) para diferenciar a simple vista el mapa de tolerancia del de eficacia. */
const TOLERANCE_PALETTE = ['#2a3a4a', '#355a72', '#3f7d94', '#3fa9ff', '#8ed0ff']

function computeBands(maxValue: number, palette: string[]): Band[] {
  const max = Number.isFinite(maxValue) && maxValue > 0 ? maxValue : 1
  const step = max / palette.length
  return palette.map((color, i) => ({
    label: BAND_LABELS[i],
    color,
    min: step * i,
    max: i === palette.length - 1 ? max : step * (i + 1),
  }))
}

export function efficacyBands(values: number[]): Band[] {
  return computeBands(values.length > 0 ? Math.max(...values) : 0, EFFICACY_PALETTE)
}

/** `values` debe ser solo la tolerancia de configuraciones YA válidas (ver `ToleranceMapPanel`) — las no válidas se pintan aparte. */
export function toleranceBands(values: number[]): Band[] {
  const finite = values.filter((value) => Number.isFinite(value))
  return computeBands(finite.length > 0 ? Math.max(...finite) : 15, TOLERANCE_PALETTE)
}

export function bandFor(value: number, bands: Band[]): Band {
  const clamped = Number.isFinite(value) ? value : bands[bands.length - 1].max
  for (const band of bands) {
    if (clamped <= band.max) return band
  }
  return bands[bands.length - 1]
}
