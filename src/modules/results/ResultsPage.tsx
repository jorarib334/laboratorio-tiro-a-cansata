import { useMemo } from 'react'
import { NextModuleButton } from '../../components/NextModuleButton/NextModuleButton'
import { LaunchComparison } from './components/LaunchComparison'
import { LaunchExplorer } from './components/LaunchExplorer'
import { LaunchMaps } from './components/LaunchMaps'
import { ResultsHero } from './components/ResultsHero'
import { TrajectoryExamples } from './components/TrajectoryExamples'
import { useLaunchComparison } from './hooks/useLaunchComparison'
import { useLaunchMaps } from './hooks/useLaunchMaps'
import { useReferenceDataset } from './hooks/useReferenceDataset'
import { useResultsLab } from './hooks/useResultsLab'
import './ResultsPage.css'

export function ResultsPage() {
  const lab = useResultsLab()
  const context = useMemo(
    () => ({
      releaseHeight: lab.params.releaseHeight,
      distanceToHoop: lab.params.distanceToHoop,
      hoopHeight: lab.params.hoopHeight,
      gravity: lab.params.gravity,
    }),
    [lab.params.releaseHeight, lab.params.distanceToHoop, lab.params.hoopHeight, lab.params.gravity],
  )
  const maps = useLaunchMaps(context)
  const comparison = useLaunchComparison(context)
  const reference = useReferenceDataset()

  return (
    <div className="results-page">
      <ResultsHero />

      <div className="results-page__content">
        <LaunchExplorer params={lab.params} simulation={lab.simulation} onChange={lab.updateParam} onReset={lab.reset} />

        <LaunchMaps
          config={maps.config}
          onConfigChange={maps.updateConfig}
          efficacyGrid={maps.efficacyGrid}
          toleranceGrid={maps.toleranceGrid}
          onGenerate={maps.generate}
          selectedParams={lab.params}
          selectedSimulation={lab.simulation}
          selectedEfficacy={lab.efficacy}
          selectedTolerance={lab.tolerance}
          onSelect={lab.selectPoint}
        />

        <LaunchComparison comparison={comparison} />

        <TrajectoryExamples examples={reference.examples} />

        <NextModuleButton to="/ia" label="Inteligencia Artificial" accentVar="--color-ai" />
      </div>
    </div>
  )
}
