import { NextModuleButton } from '../../components/NextModuleButton/NextModuleButton'
import { StepLabel } from '../../components/StepLabel/StepLabel'
import { EquationPanel } from './components/EquationPanel'
import { LiveTelemetry } from './components/LiveTelemetry'
import { ParameterControls } from './components/ParameterControls'
import { PhysicsHero } from './components/PhysicsHero'
import { PlaybackControls } from './components/PlaybackControls'
import { ResultsPanel } from './components/ResultsPanel'
import { useLaunchParams } from './hooks/useLaunchParams'
import { useTrajectoryPlayback } from './hooks/useTrajectoryPlayback'
import { LaunchScene } from './visualization/LaunchScene'
import './PhysicsPage.css'

export function PhysicsPage() {
  const { params, updateParam, reset, results } = useLaunchParams()
  const playback = useTrajectoryPlayback(results.flightTime)

  function handleReset() {
    reset()
    playback.reset()
  }

  return (
    <div className="physics-page">
      <PhysicsHero />

      <div className="physics-page__content">
        <EquationPanel />

        <div className="physics-page__lab">
          <div className="physics-page__scene-column">
            <StepLabel step={2}>Trayectoria</StepLabel>
            <div className="physics-page__scene-frame">
              <LaunchScene params={params} results={results} currentTime={playback.currentTime} />
              <LiveTelemetry params={params} currentTime={playback.currentTime} />
            </div>
            <PlaybackControls
              isPlaying={playback.isPlaying}
              currentTime={playback.currentTime}
              duration={results.flightTime}
              onPlay={playback.play}
              onPause={playback.pause}
              onRestart={playback.restart}
            />
          </div>

          <aside className="physics-page__controls-column">
            <StepLabel step={1}>Condiciones iniciales</StepLabel>
            <ParameterControls params={params} onChange={updateParam} onReset={handleReset} />
          </aside>
        </div>

        <ResultsPanel params={params} results={results} />

        <NextModuleButton to="/geometria" label="Geometría" accentVar="--color-geometry" />
      </div>
    </div>
  )
}
