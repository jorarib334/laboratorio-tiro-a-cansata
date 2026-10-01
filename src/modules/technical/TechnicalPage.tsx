import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { NextModuleButton } from '../../components/NextModuleButton/NextModuleButton'
import { StepLabel } from '../../components/StepLabel/StepLabel'
import type { Scene3DCanvasHandle } from '../../scene3d/Scene3DCanvas'
import { buildScene3DData } from '../../scene3d/trajectoryAdapter'
import { TechnicalHero } from './components/TechnicalHero'
import { ViewModeSelector } from './components/ViewModeSelector'
import { useViewMode } from './hooks/useViewMode'
import './TechnicalPage.css'

/**
 * Carga diferida: three.js/@react-three solo se descargan cuando alguien
 * visita este módulo, no en el resto de la app (ver skill immersive-3d-web,
 * reference/retrofit.md).
 */
const Scene3DCanvas = lazy(() => import('../../scene3d/Scene3DCanvas').then((m) => ({ default: m.Scene3DCanvas })))

export function TechnicalPage() {
  const { viewMode, setViewMode } = useViewMode()
  const [technicalMode, setTechnicalMode] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const canvasRef = useRef<Scene3DCanvasHandle>(null)
  const data = useMemo(() => buildScene3DData(), [])

  return (
    <div className="technical-page">
      <TechnicalHero />

      <div className="technical-page__content">
        <StepLabel step={1} accentVar="--color-technical">
          Modelo espacial
        </StepLabel>

        <ViewModeSelector
          viewMode={viewMode}
          onChange={setViewMode}
          onResetView={() => canvasRef.current?.resetView()}
          technicalMode={technicalMode}
          onToggleTechnicalMode={() => setTechnicalMode((prev) => !prev)}
        />

        <div className="technical-page__stage">
          <Suspense fallback={<div className="technical-page__loading">Cargando escena 3D…</div>}>
            <Scene3DCanvas ref={canvasRef} data={data} viewMode={viewMode} technicalMode={technicalMode} onFirstInteract={() => setHasInteracted(true)} />
          </Suspense>

          <p className={`technical-page__stage-hint${hasInteracted ? ' technical-page__stage-hint--hidden' : ''}`} aria-hidden={hasInteracted}>
            Arrastra para explorar el modelo
          </p>
        </div>

        <p className="technical-page__hint">
          Arrastra para rotar, rueda del ratón para acercar/alejar. En Alzado, Planta y Perfil la
          rotación queda fija en esa proyección; el zoom sigue disponible.
        </p>

        <NextModuleButton to="/resultados" label="Resultados" accentVar="--color-simulator" />
      </div>
    </div>
  )
}
