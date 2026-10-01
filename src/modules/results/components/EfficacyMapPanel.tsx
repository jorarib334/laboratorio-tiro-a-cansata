import { useCallback, useMemo } from 'react'
import { formatNumber } from '../../../format'
import type { EfficacyGridCell } from '../../../results/efficacyIndex'
import { bandFor, efficacyBands } from '../../../results/colorScale'
import type { Grid } from '../../../results/grid'
import { StepLabel } from '../../../components/StepLabel/StepLabel'
import { BandLegend } from './BandLegend'
import { ParameterHeatmap } from './ParameterHeatmap'
import './EfficacyMapPanel.css'

interface EfficacyMapPanelProps {
  grid: Grid<EfficacyGridCell>
  selected: { initialSpeed: number; launchAngleDeg: number } | null
  onSelect: (point: { initialSpeed: number; launchAngleDeg: number }) => void
}

/**
 * Mapa de eficacia: cada celda es el ÍNDICE DE EFICACIA de esa configuración
 * exacta (robustez frente a pequeñas variaciones de V0/θ, ver
 * `computeEfficacyIndex`) — nunca "probabilidad de encestar", el modelo es
 * determinista. Las 5 bandas de color se calculan sobre el máximo REAL de
 * este mapa (ver `efficacyBands`), así que el mejor punto siempre cae en la
 * banda más alta (verde), y cada celda muestra su porcentaje exacto. Al
 * hacer click se selecciona esa configuración (ver `SelectedLaunchDetail`,
 * sincronizado con el mapa de tolerancia).
 */
export function EfficacyMapPanel({ grid, selected, onSelect }: EfficacyMapPanelProps) {
  const bands = useMemo(() => efficacyBands(grid.cells.map((cell) => cell.efficacy.index)), [grid])
  const colorFor = useCallback((cell: EfficacyGridCell) => bandFor(cell.efficacy.index, bands).color, [bands])
  const labelFor = useCallback((cell: EfficacyGridCell) => `${Math.round(cell.efficacy.index * 100)}%`, [])
  const sample = grid.cells[0]
  const maxIndex = bands[bands.length - 1]?.max ?? 0

  return (
    <div className="efficacy-map-panel">
      <StepLabel step={2} accentVar="--color-simulator">
        Mapa de eficacia
      </StepLabel>
      <p className="efficacy-map-panel__note">
        Cada celda es una configuración (V₀, θ) exacta y simula {sample ? sample.efficacy.sampleCount : 0} lanzamientos
        vecinos alrededor suyo (V₀ ± {sample ? formatNumber(sample.efficacy.speedDelta, 1) : '–'} m/s, θ ±{' '}
        {sample ? formatNumber(sample.efficacy.angleDelta, 0) : '–'}°): el número y el color son qué fracción de esos
        vecinos sigue entrando. <strong>No es lo mismo que "válido"</strong> — un lanzamiento puede ser válido en su
        punto exacto y aun así frágil. Las bandas de color se ajustan al máximo real de este mapa ({formatNumber(maxIndex * 100, 0)}%),
        así que el mejor punto siempre se ve verde.
      </p>
      <ParameterHeatmap
        grid={grid}
        colorFor={colorFor}
        labelFor={labelFor}
        selected={selected}
        onSelect={onSelect}
        ariaLabel="Mapa de eficacia, ángulo por velocidad inicial"
      />
      <BandLegend bands={bands} formatValue={(value) => `${formatNumber(value * 100, 0)}%`} />
    </div>
  )
}
