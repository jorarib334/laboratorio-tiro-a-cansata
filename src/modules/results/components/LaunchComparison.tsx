import { formatNumber } from '../../../format'
import { LAUNCH_LIMITS } from '../../../physics/constants'
import { EFFICACY_LABELS, categorizeEfficacy } from '../../../results/validity'
import { StepLabel } from '../../../components/StepLabel/StepLabel'
import { LaunchScene } from '../../physics/visualization/LaunchScene'
import type { useLaunchComparison } from '../hooks/useLaunchComparison'
import './LaunchComparison.css'

interface LaunchComparisonProps {
  comparison: ReturnType<typeof useLaunchComparison>
}

/** `null` cuando la configuración base ya es "no válida": la distancia hasta el límite no es un margen de seguridad en ese caso (ver `ToleranceMapPanel`). */
function formatTolerance(value: number, baseValid: boolean): string {
  if (!baseValid) return '—'
  return Number.isFinite(value) ? `± ${formatNumber(value, 1)}°` : 'sin límite'
}

/**
 * Comparación de 2-3 lanzamientos, uno al lado del otro: trayectoria propia
 * (misma `LaunchScene` de Física) y una tabla de cifras. Solo datos, sin
 * ninguna conclusión sobre cuál es "mejor" — eso lo interpreta quien lo lea.
 */
export function LaunchComparison({ comparison }: LaunchComparisonProps) {
  const { details, updateSlot, addSlot, removeSlot, canAdd, canRemove } = comparison

  return (
    <section className="launch-comparison">
      <StepLabel step={4} accentVar="--color-simulator">
        Comparación de lanzamientos
      </StepLabel>
      <p className="launch-comparison__note">Ajusta V₀ y θ de cada configuración y compara sus trayectorias y cifras directamente.</p>

      <div className="launch-comparison__scenes">
        {details.map((detail) => (
          <div className="launch-comparison__card" key={detail.label}>
            <div className="launch-comparison__card-header">
              <span className="launch-comparison__card-label">{detail.label}</span>
              {canRemove && (
                <button type="button" className="launch-comparison__remove" onClick={() => removeSlot(detail.label)}>
                  Quitar
                </button>
              )}
            </div>

            <div className="launch-comparison__scene">
              <LaunchScene params={detail.params} results={detail.simulation.results} currentTime={detail.simulation.results.hoopArrival.time} />
            </div>

            <label>
              V₀ ({formatNumber(detail.initialSpeed, 1)} m/s)
              <input
                type="range"
                min={LAUNCH_LIMITS.initialSpeed.min}
                max={LAUNCH_LIMITS.initialSpeed.max}
                step={LAUNCH_LIMITS.initialSpeed.step}
                value={detail.initialSpeed}
                onChange={(event) => updateSlot(detail.label, { initialSpeed: Number(event.target.value) })}
              />
            </label>
            <label>
              θ ({formatNumber(detail.launchAngleDeg, 0)}°)
              <input
                type="range"
                min={LAUNCH_LIMITS.launchAngleDeg.min}
                max={LAUNCH_LIMITS.launchAngleDeg.max}
                step={LAUNCH_LIMITS.launchAngleDeg.step}
                value={detail.launchAngleDeg}
                onChange={(event) => updateSlot(detail.label, { launchAngleDeg: Number(event.target.value) })}
              />
            </label>
          </div>
        ))}

        {canAdd && (
          <button type="button" className="launch-comparison__add" onClick={addSlot}>
            + Añadir configuración
          </button>
        )}
      </div>

      <table className="launch-comparison__table">
        <thead>
          <tr>
            <th></th>
            {details.map((detail) => (
              <th key={detail.label}>{detail.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>V₀</th>
            {details.map((detail) => (
              <td key={detail.label}>{formatNumber(detail.initialSpeed, 1)} m/s</td>
            ))}
          </tr>
          <tr>
            <th>θ</th>
            {details.map((detail) => (
              <td key={detail.label}>{formatNumber(detail.launchAngleDeg, 0)}°</td>
            ))}
          </tr>
          <tr>
            <th>Estado</th>
            {details.map((detail) => (
              <td key={detail.label}>{EFFICACY_LABELS[categorizeEfficacy(detail.simulation.validity)]}</td>
            ))}
          </tr>
          <tr>
            <th>Índice de eficacia</th>
            {details.map((detail) => (
              <td key={detail.label}>{formatNumber(detail.efficacy.index * 100, 0)}%</td>
            ))}
          </tr>
          <tr>
            <th>Tolerancia angular</th>
            {details.map((detail) => (
              <td key={detail.label}>
                {formatTolerance(Math.min(detail.tolerance.angleTolerance.lower, detail.tolerance.angleTolerance.upper), detail.tolerance.baseValid)}
              </td>
            ))}
          </tr>
          <tr>
            <th>Altura máxima</th>
            {details.map((detail) => (
              <td key={detail.label}>{formatNumber(detail.simulation.results.maxHeight, 2)} m</td>
            ))}
          </tr>
          <tr>
            <th>Tiempo de vuelo</th>
            {details.map((detail) => (
              <td key={detail.label}>{formatNumber(detail.simulation.results.flightTime, 2)} s</td>
            ))}
          </tr>
          <tr>
            <th>Ángulo de entrada</th>
            {details.map((detail) => (
              <td key={detail.label}>{formatNumber(detail.simulation.results.hoopArrival.angleDeg, 1)}°</td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  )
}
