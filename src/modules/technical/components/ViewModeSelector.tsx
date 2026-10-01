import { VIEW_MODE_DESCRIPTIONS, VIEW_MODE_LABELS } from '../../../scene3d/viewPresets'
import type { SceneViewMode } from '../../../scene3d/types'
import './ViewModeSelector.css'

interface ViewModeSelectorProps {
  viewMode: SceneViewMode
  onChange: (mode: SceneViewMode) => void
  onResetView: () => void
  technicalMode: boolean
  onToggleTechnicalMode: () => void
}

const MODES: SceneViewMode[] = ['orbital', 'alzado', 'planta', 'perfil']

/**
 * Control técnico de vistas. También sirve como alternativa accesible a la
 * rotación con ratón (útil en pantallas táctiles, ver módulo §13).
 */
export function ViewModeSelector({ viewMode, onChange, onResetView, technicalMode, onToggleTechnicalMode }: ViewModeSelectorProps) {
  return (
    <div className="view-mode-selector">
      <div className="view-mode-selector__row">
        <div className="view-mode-selector__tabs" role="tablist" aria-label="Vista de la escena">
          {MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={viewMode === mode}
              className={`view-mode-selector__tab${viewMode === mode ? ' view-mode-selector__tab--active' : ''}`}
              onClick={() => onChange(mode)}
            >
              {VIEW_MODE_LABELS[mode]}
            </button>
          ))}
        </div>

        <div className="view-mode-selector__actions">
          <button
            type="button"
            aria-pressed={technicalMode}
            className={`view-mode-selector__toggle${technicalMode ? ' view-mode-selector__toggle--active' : ''}`}
            onClick={onToggleTechnicalMode}
          >
            Modo técnico
          </button>
          <button type="button" className="view-mode-selector__reset" onClick={onResetView}>
            Vista inicial
          </button>
        </div>
      </div>

      <p className="view-mode-selector__description">{VIEW_MODE_DESCRIPTIONS[viewMode]}</p>
    </div>
  )
}
