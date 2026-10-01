import { formatNumber } from '../../../format'
import './PlaybackControls.css'

interface PlaybackControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  onPlay: () => void
  onPause: () => void
  onRestart: () => void
}

export function PlaybackControls({ isPlaying, currentTime, duration, onPlay, onPause, onRestart }: PlaybackControlsProps) {
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0

  return (
    <div className="playback-controls">
      <button type="button" className="playback-controls__button" onClick={isPlaying ? onPause : onPlay}>
        {isPlaying ? 'Pausar' : 'Reproducir'}
      </button>
      <button type="button" className="playback-controls__button playback-controls__button--secondary" onClick={onRestart}>
        Reiniciar
      </button>
      <div className="playback-controls__progress" role="presentation">
        <div className="playback-controls__progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <span className="playback-controls__time">
        {formatNumber(currentTime, 2)} / {formatNumber(duration, 2)} s
      </span>
    </div>
  )
}
