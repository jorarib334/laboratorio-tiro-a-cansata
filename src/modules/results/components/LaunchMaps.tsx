import type { LaunchParams } from '../../../physics/types'
import type { EfficacyGridCell, EfficacyIndexResult } from '../../../results/efficacyIndex'
import type { Grid } from '../../../results/grid'
import type { ToleranceGridCell, ToleranceReport } from '../../../results/marginAnalysis'
import type { SimulationResult } from '../../../results/types'
import type { LaunchMapsConfig } from '../hooks/useLaunchMaps'
import { EfficacyMapPanel } from './EfficacyMapPanel'
import { LaunchMapControls } from './LaunchMapControls'
import { SelectedLaunchDetail } from './SelectedLaunchDetail'
import { ToleranceMapPanel } from './ToleranceMapPanel'
import './LaunchMaps.css'

interface LaunchMapsProps {
  config: LaunchMapsConfig
  onConfigChange: (patch: Partial<LaunchMapsConfig>) => void
  efficacyGrid: Grid<EfficacyGridCell>
  toleranceGrid: Grid<ToleranceGridCell>
  onGenerate: () => void
  /** El lanzamiento actual del Explorador — MISMA fuente de verdad, no un estado local duplicado (ver `useResultsLab`/`ResultsPage`). */
  selectedParams: LaunchParams
  selectedSimulation: SimulationResult
  selectedEfficacy: EfficacyIndexResult
  selectedTolerance: ToleranceReport
  onSelect: (point: { initialSpeed: number; launchAngleDeg: number }) => void
}

/**
 * Compone los mapas de eficacia y tolerancia. Los dos leen y escriben la
 * MISMA selección (V0, θ) que el Explorador de arriba: hacer click en una
 * celda mueve los sliders del Explorador (y su trayectoria/resultados), y
 * mover esos sliders mueve la marca en ambos mapas — una única fuente de
 * verdad, sin estado propio aquí.
 */
export function LaunchMaps({
  config,
  onConfigChange,
  efficacyGrid,
  toleranceGrid,
  onGenerate,
  selectedParams,
  selectedSimulation,
  selectedEfficacy,
  selectedTolerance,
  onSelect,
}: LaunchMapsProps) {
  const selected = { initialSpeed: selectedParams.initialSpeed, launchAngleDeg: selectedParams.launchAngleDeg }

  return (
    <section className="launch-maps">
      <div className="launch-maps__layout">
        <div className="launch-maps__grids-column">
          <EfficacyMapPanel grid={efficacyGrid} selected={selected} onSelect={onSelect} />
          <ToleranceMapPanel grid={toleranceGrid} selected={selected} onSelect={onSelect} />
          <LaunchMapControls config={config} onChange={onConfigChange} onGenerate={onGenerate} />
        </div>

        <SelectedLaunchDetail params={selectedParams} simulation={selectedSimulation} efficacy={selectedEfficacy} tolerance={selectedTolerance} />
      </div>
    </section>
  )
}
