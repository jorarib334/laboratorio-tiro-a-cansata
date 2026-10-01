import { useMemo, useState } from 'react'
import { formatNumber } from '../../../format'
import type { NearbyConfiguration } from '../../../results/explore'
import { StepLabel } from '../../../components/StepLabel/StepLabel'
import './NearbyExplorer.css'

interface NearbyExplorerProps {
  nearby: NearbyConfiguration[]
}

type SortKey = 'efficacyIndex' | 'angleTolerance'

/** `null` cuando la propia configuración ya es "no válida": ahí la distancia hasta el límite no es un margen de seguridad (ver `ToleranceMapPanel`). */
function formatTolerance(config: NearbyConfiguration): string {
  if (config.label === 'invalid') return '—'
  return Number.isFinite(config.angleTolerance) ? `± ${formatNumber(config.angleTolerance, 1)}°` : 'sin límite'
}

/** Para ordenar: una configuración no válida nunca debe aparecer como "mayor tolerancia". */
function toleranceSortValue(config: NearbyConfiguration): number {
  return config.label === 'invalid' ? -Infinity : config.angleTolerance
}

/**
 * "Explorar configuraciones": simula un conjunto fijo de configuraciones
 * cercanas (`findNearbyConfigurations`, en `src/results/explore.ts`) y las
 * ordena por eficacia o por tolerancia — sin afirmar cuál es "la mejor",
 * solo cuál tiene el valor más alto DENTRO de este conjunto concreto.
 */
export function NearbyExplorer({ nearby }: NearbyExplorerProps) {
  const [sortKey, setSortKey] = useState<SortKey>('efficacyIndex')

  const sorted = useMemo(() => {
    const scoreOf = sortKey === 'angleTolerance' ? toleranceSortValue : (config: NearbyConfiguration) => config.efficacyIndex
    return [...nearby].sort((a, b) => scoreOf(b) - scoreOf(a))
  }, [nearby, sortKey])
  const topIndex = sorted.length > 0 ? 0 : -1

  return (
    <section className="nearby-explorer">
      <StepLabel step={3} accentVar="--color-ai">
        Explorar configuraciones
      </StepLabel>

      <p className="nearby-explorer__note">
        {nearby.length} configuraciones vecinas de la de arriba (variando V₀ y θ en pasos fijos), cada una simulada por
        separado.
      </p>

      <div className="nearby-explorer__sort">
        <span>Ordenar por</span>
        <button type="button" className={sortKey === 'efficacyIndex' ? 'nearby-explorer__sort-btn--active' : ''} onClick={() => setSortKey('efficacyIndex')}>
          Índice de eficacia
        </button>
        <button type="button" className={sortKey === 'angleTolerance' ? 'nearby-explorer__sort-btn--active' : ''} onClick={() => setSortKey('angleTolerance')}>
          Tolerancia
        </button>
      </div>

      <table className="nearby-explorer__table">
        <thead>
          <tr>
            <th>V₀</th>
            <th>θ</th>
            <th>ΔV₀</th>
            <th>Δθ</th>
            <th>Eficacia</th>
            <th>Tolerancia</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((config, index) => (
            <tr key={`${config.initialSpeed}-${config.launchAngleDeg}`} className={index === topIndex ? 'nearby-explorer__row--top' : undefined}>
              <td>{formatNumber(config.initialSpeed, 1)} m/s</td>
              <td>{formatNumber(config.launchAngleDeg, 0)}°</td>
              <td>{config.deltaSpeed > 0 ? '+' : ''}{formatNumber(config.deltaSpeed, 1)}</td>
              <td>{config.deltaAngle > 0 ? '+' : ''}{formatNumber(config.deltaAngle, 0)}°</td>
              <td>{formatNumber(config.efficacyIndex * 100, 0)}%</td>
              <td>{formatTolerance(config)}</td>
              <td>{config.label === 'invalid' ? 'No válido' : config.label === 'boundary' ? 'Límite' : 'Válido'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {sorted.length > 0 && (sortKey === 'efficacyIndex' || sorted[0].label !== 'invalid') && (
        <p className="nearby-explorer__highlight">
          {sortKey === 'efficacyIndex' ? 'Mayor índice de eficacia' : 'Mayor tolerancia'} dentro del conjunto analizado: V₀ ={' '}
          {formatNumber(sorted[0].initialSpeed, 1)} m/s, θ = {formatNumber(sorted[0].launchAngleDeg, 0)}°.
        </p>
      )}
    </section>
  )
}
