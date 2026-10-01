import { NextModuleButton } from '../../components/NextModuleButton/NextModuleButton'
import { AiConfigurationAnalysis } from './components/AiConfigurationAnalysis'
import { AiHero } from './components/AiHero'
import { AiQueryControls } from './components/AiQueryControls'
import { ModelComparison } from './components/ModelComparison'
import { NearbyExplorer } from './components/NearbyExplorer'
import { TrainingDataSummary } from './components/TrainingDataSummary'
import { useAiModel } from './hooks/useAiModel'
import { useAiQuery } from './hooks/useAiQuery'
import './AiPage.css'

export function AiPage() {
  const model = useAiModel()
  const query = useAiQuery()
  const prediction = model.classify(query.params)

  return (
    <div className="ai-page">
      <AiHero />

      <div className="ai-page__content">
        <TrainingDataSummary totalSimulations={model.sweep.cells.length} trainSize={model.trainSize} testSize={model.testSize} />

        <AiQueryControls params={query.params} onChange={query.updateParam} onReset={query.reset} />

        <AiConfigurationAnalysis params={query.params} prediction={prediction} efficacy={query.efficacy} tolerance={query.tolerance} k={model.k} />

        <NearbyExplorer nearby={query.nearby} />

        <div className="ai-page__divider" role="separator">
          <span>Modelo físico vs IA</span>
        </div>

        <ModelComparison
          evaluation={model.evaluation}
          trainSize={model.trainSize}
          testSize={model.testSize}
          agreementExample={model.agreementExample}
          discrepancyExample={model.discrepancyExample}
        />

        <NextModuleButton to="/" label="Inicio" accentVar="--color-ai" eyebrow="Fin del recorrido" />
      </div>
    </div>
  )
}
