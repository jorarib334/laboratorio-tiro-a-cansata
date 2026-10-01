import { useMemo } from 'react'
import { pickTrajectoryExamples } from '../../../results/examples'
import { buildReferenceDataset } from '../../../results/referenceDataset'

/** Barrido de referencia compartido con el módulo IA (ver `referenceDataset.ts`), usado aquí para los ejemplos de trayectorias. */
export function useReferenceDataset() {
  return useMemo(() => {
    const sweep = buildReferenceDataset()
    return {
      sweep,
      examples: pickTrajectoryExamples(sweep.cells),
    }
  }, [])
}
