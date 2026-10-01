import { useCallback, useMemo } from 'react'
import { formatNumber } from '../../../format'
import type { ToleranceGridCell } from '../../../results/marginAnalysis'
import { bandFor, toleranceBands } from '../../../results/colorScale'
import type { Grid } from '../../../results/grid'
import { EFFICACY_COLORS } from '../../../results/validity'
import { StepLabel } from '../../../components/StepLabel/StepLabel'
import { BandLegend } from './BandLegend'
import { ParameterHeatmap } from './ParameterHeatmap'
import './ToleranceMapPanel.css'

interface ToleranceMapPanelProps {
  grid: Grid<ToleranceGridCell>
  selected: { initialSpeed: number; launchAngleDeg: number } | null
  onSelect: (point: { initialSpeed: number; launchAngleDeg: number }) => void
}

function cellToleranceDegrees(cell: ToleranceGridCell): number {
  return Math.min(cell.tolerance.angleTolerance.lower, cell.tolerance.angleTolerance.upper)
}

/**
 * Mapa de tolerancia: cada celda válida es la tolerancia angular de esa
 * configuración (el menor de los dos márgenes, por bisección — ver
 * `computeToleranceReport`), sobre el MISMO dominio θ×V0 que el mapa de
 * eficacia (mismo `LaunchMapControls`, mismo botón "Generar mapas"). Las 5
 * bandas azules se calculan solo sobre las celdas YA válidas (ver
 * `toleranceBands`), así que el mejor margen real siempre se ve en el azul
 * más claro.
 *
 * Cuando la propia configuración base ya es "no válida" (`baseValid` de
 * `computeToleranceReport`), la distancia hasta el límite no significa
 * "margen de seguridad" sino "cuánto habría que cambiarla para que
 * empezara a funcionar" — esas celdas se pintan aparte (rojo), nunca con
 * el azul de tolerancia.
 */
export function ToleranceMapPanel({ grid, selected, onSelect }: ToleranceMapPanelProps) {
  const bands = useMemo(
    () => toleranceBands(grid.cells.filter((cell) => cell.tolerance.baseValid).map(cellToleranceDegrees)),
    [grid],
  )

  const colorFor = useCallback(
    (cell: ToleranceGridCell) => (cell.tolerance.baseValid ? bandFor(cellToleranceDegrees(cell), bands).color : EFFICACY_COLORS.invalid),
    [bands],
  )

  const labelFor = useCallback((cell: ToleranceGridCell) => {
    if (!cell.tolerance.baseValid) return '—'
    const degrees = cellToleranceDegrees(cell)
    return Number.isFinite(degrees) ? `±${Math.round(degrees)}°` : '∞'
  }, [])

  return (
    <div className="tolerance-map-panel">
      <StepLabel step={3} accentVar="--color-simulator">
        Mapa de tolerancia
      </StepLabel>
      <p className="tolerance-map-panel__note">
        Usa el mismo rango de V₀ y θ que el mapa de eficacia. Cada celda válida muestra cuánto se
        puede desviar θ (en la dirección más restrictiva) antes de dejar de cumplir la condición de
        enceste; las celdas ya no válidas de partida se marcan en rojo, no con una tolerancia.
      </p>
      <ParameterHeatmap
        grid={grid}
        colorFor={colorFor}
        labelFor={labelFor}
        selected={selected}
        onSelect={onSelect}
        ariaLabel="Mapa de tolerancia, ángulo por velocidad inicial"
      />
      <BandLegend
        bands={bands}
        formatValue={(value) => `±${formatNumber(value, 1)}°`}
        extraLabel="Configuración base no válida"
        extraColor={EFFICACY_COLORS.invalid}
      />
    </div>
  )
}
