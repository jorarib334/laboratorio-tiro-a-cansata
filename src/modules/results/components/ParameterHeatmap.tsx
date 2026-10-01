import { useEffect, useRef } from 'react'
import type { Grid } from '../../../results/grid'
import './ParameterHeatmap.css'

interface LaunchPoint {
  initialSpeed: number
  launchAngleDeg: number
}

interface ParameterHeatmapProps<T> {
  grid: Grid<T>
  colorFor: (cell: T) => string
  /** Texto a dibujar centrado en cada celda (p. ej. "52%") — opcional, solo legible con resoluciones bajas. */
  labelFor?: (cell: T) => string
  selected: LaunchPoint | null
  onSelect: (point: LaunchPoint) => void
  size?: number
  ariaLabel: string
}

function nearestIndex(values: number[], target: number): number {
  let bestIndex = 0
  let bestDiff = Infinity
  values.forEach((value, index) => {
    const diff = Math.abs(value - target)
    if (diff < bestDiff) {
      bestDiff = diff
      bestIndex = index
    }
  })
  return bestIndex
}

/**
 * Canvas genérico θ×V0: dibuja cada celda con `colorFor` y resuelve el click
 * a un punto (V0, θ) exacto. Compartido por el mapa de eficacia y el de
 * tolerancia para no duplicar la lógica de rejilla/click en cada uno.
 */
export function ParameterHeatmap<T>({ grid, colorFor, labelFor, selected, onSelect, size = 380, ariaLabel }: ParameterHeatmapProps<T>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const angleSteps = grid.angles.length
  const speedSteps = grid.speeds.length

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cellWidth = size / angleSteps
    const cellHeight = size / speedSteps
    const fontSize = Math.max(9, Math.min(cellWidth, cellHeight) * 0.3)

    ctx.clearRect(0, 0, size, size)
    for (let angleIndex = 0; angleIndex < angleSteps; angleIndex += 1) {
      for (let speedIndex = 0; speedIndex < speedSteps; speedIndex += 1) {
        const cell = grid.cells[angleIndex * speedSteps + speedIndex]
        ctx.fillStyle = colorFor(cell)
        const x = angleIndex * cellWidth
        const y = (speedSteps - 1 - speedIndex) * cellHeight
        ctx.fillRect(x, y, cellWidth + 0.5, cellHeight + 0.5)

        if (labelFor) {
          const text = labelFor(cell)
          const cx = x + cellWidth / 2
          const cy = y + cellHeight / 2
          // Canvas no puede leer variables CSS: "IBM Plex Mono" es la fuente
          // monoespaciada del proyecto (ver --font-mono en tokens.css).
          ctx.font = `600 ${fontSize}px "IBM Plex Mono", ui-monospace, monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.lineWidth = 3
          ctx.strokeStyle = 'rgba(7, 10, 16, 0.75)'
          ctx.strokeText(text, cx, cy)
          ctx.fillStyle = '#f4efe6'
          ctx.fillText(text, cx, cy)
        }
      }
    }

    if (selected) {
      const angleIndex = nearestIndex(grid.angles, selected.launchAngleDeg)
      const speedIndex = nearestIndex(grid.speeds, selected.initialSpeed)
      const x = angleIndex * cellWidth + cellWidth / 2
      const y = (speedSteps - 1 - speedIndex) * cellHeight + cellHeight / 2
      ctx.strokeStyle = '#f4efe6'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, Math.max(cellWidth, cellHeight) * 0.65, 0, Math.PI * 2)
      ctx.stroke()
    }
  }, [grid, colorFor, labelFor, selected, angleSteps, speedSteps, size])

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const xFraction = (event.clientX - rect.left) / rect.width
    const yFraction = (event.clientY - rect.top) / rect.height
    const angleIndex = Math.min(angleSteps - 1, Math.max(0, Math.floor(xFraction * angleSteps)))
    const speedIndexFromTop = Math.min(speedSteps - 1, Math.max(0, Math.floor(yFraction * speedSteps)))
    const speedIndex = speedSteps - 1 - speedIndexFromTop
    onSelect({ initialSpeed: grid.speeds[speedIndex], launchAngleDeg: grid.angles[angleIndex] })
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="parameter-heatmap"
      onClick={handleClick}
      role="img"
      aria-label={ariaLabel}
    />
  )
}
