import { NextModuleButton } from '../../components/NextModuleButton/NextModuleButton'
import { StepLabel } from '../../components/StepLabel/StepLabel'
import { CurrentRelationBanner } from './components/CurrentRelationBanner'
import { EntryWindowPreview } from './components/EntryWindowPreview'
import { GeometryHero } from './components/GeometryHero'
import { GeometryLegend } from './components/GeometryLegend'
import { RelationReference } from './components/RelationReference'
import { RelativePositionControls } from './components/RelativePositionControls'
import { RelativePositionResults } from './components/RelativePositionResults'
import { useCircleOffset } from './hooks/useCircleOffset'
import { GeometryScene } from './visualization/GeometryScene'
import './GeometryPage.css'

export function GeometryPage() {
  const { offset, updateOffset, setOffsetXY, reset, hoopCircle, ballCircle, relation } = useCircleOffset()

  return (
    <div className="geometry-page">
      <GeometryHero />

      <div className="geometry-page__content">
        <section>
          <h2 className="geometry-page__section-title">Estados posibles</h2>
          <RelationReference />
        </section>

        <div className="geometry-page__lab">
          <div className="geometry-page__scene-column">
            <div className="geometry-page__scene-header">
              <StepLabel step={2} accentVar="--color-geometry">
                Construcción geométrica
              </StepLabel>
              <CurrentRelationBanner relation={relation.relation} />
            </div>
            <GeometryScene ballCircle={ballCircle} hoopCircle={hoopCircle} relation={relation} onDragOffset={setOffsetXY} />
            <GeometryLegend ballCircle={ballCircle} hoopCircle={hoopCircle} relation={relation} />
          </div>

          <aside className="geometry-page__controls-column">
            <StepLabel step={1} accentVar="--color-geometry">
              Posición relativa
            </StepLabel>
            <RelativePositionControls offset={offset} onChange={updateOffset} onReset={reset} />
          </aside>
        </div>

        <RelativePositionResults relation={relation} />

        <EntryWindowPreview />

        <NextModuleButton to="/representacion-tecnica" label="Representación técnica" accentVar="--color-technical" />
      </div>
    </div>
  )
}
