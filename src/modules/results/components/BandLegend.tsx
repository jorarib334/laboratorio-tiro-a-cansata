import type { Band } from '../../../results/colorScale'
import './BandLegend.css'

interface BandLegendProps {
  /** En orden ascendente (de `efficacyBands`/`toleranceBands`); se muestra de mayor a menor, como una leyenda de mapa. */
  bands: Band[]
  formatValue: (value: number) => string
  /** Banda extra al final (p. ej. "Configuración base no válida" en el mapa de tolerancia), sin rango numérico. */
  extraLabel?: string
  extraColor?: string
}

/** Leyenda de bandas discretas con su color y su rango real — no un degradado suelto sin marcas. */
export function BandLegend({ bands, formatValue, extraLabel, extraColor }: BandLegendProps) {
  const descending = [...bands].reverse()

  return (
    <ul className="band-legend">
      {descending.map((band) => (
        <li key={band.label}>
          <span className="band-legend__swatch" style={{ background: band.color }} aria-hidden="true" />
          <span className="band-legend__label">{band.label}</span>
          <span className="band-legend__range">
            {formatValue(band.min)} – {formatValue(band.max)}
          </span>
        </li>
      ))}
      {extraLabel && (
        <li>
          <span className="band-legend__swatch" style={{ background: extraColor }} aria-hidden="true" />
          <span className="band-legend__label">{extraLabel}</span>
        </li>
      )}
    </ul>
  )
}
