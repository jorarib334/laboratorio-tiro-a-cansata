import { useMemo } from 'react'
import type { LaunchParams } from '../../../physics/types'
import { deriveInsights } from '../../../results/insights'
import type { KnnSample } from '../../../results/knn'
import { KNN_FEATURE_KEYS, computeFeatureRanges, evaluateKnn, predictKnn, splitDataset, sweepToDataset } from '../../../results/knn'
import { buildReferenceDataset } from '../../../results/referenceDataset'

const K_NEIGHBORS = 5
const TRAIN_FRACTION = 0.8

export type AiQuery = Pick<LaunchParams, 'initialSpeed' | 'launchAngleDeg' | 'releaseHeight' | 'distanceToHoop'>

export interface ComparisonExample {
  sample: KnnSample
  predictedFavorable: boolean
}

/**
 * IA del módulo: k-NN (ver `src/results/knn.ts`) entrenado sobre el mismo
 * barrido de referencia (V0, θ, y0, d) que usa Resultados para sus propias
 * observaciones (`buildReferenceDataset`, ver `src/results/referenceDataset.ts`)
 * — no un conjunto de datos distinto "por casualidad". Todo el cálculo
 * (barrido, entrenamiento, evaluación) ocurre una única vez en el
 * navegador; no hay ninguna llamada de red.
 */
export function useAiModel() {
  return useMemo(() => {
    const sweep = buildReferenceDataset()
    const dataset = sweepToDataset(sweep)
    const { train, test } = splitDataset(dataset, TRAIN_FRACTION)
    const ranges = computeFeatureRanges(train)
    const evaluation = evaluateKnn(train, test, K_NEIGHBORS)
    const insights = deriveInsights(sweep)

    function classify(query: AiQuery) {
      const features = KNN_FEATURE_KEYS.map((key) => query[key])
      return predictKnn(features, train, ranges, K_NEIGHBORS)
    }

    // Un ejemplo real de acuerdo y uno de discrepancia entre el modelo físico
    // (la etiqueta del propio dato, calculada por `assessValidity`) y la
    // predicción de la IA sobre el conjunto de prueba (nunca visto en el
    // entrenamiento), para ilustrar la comparación con casos concretos.
    let agreementExample: ComparisonExample | null = null
    let discrepancyExample: ComparisonExample | null = null
    for (const sample of test) {
      const prediction = predictKnn(sample.features, train, ranges, K_NEIGHBORS)
      if (prediction.label === sample.label && !agreementExample) {
        agreementExample = { sample, predictedFavorable: prediction.label }
      }
      if (prediction.label !== sample.label && !discrepancyExample) {
        discrepancyExample = { sample, predictedFavorable: prediction.label }
      }
      if (agreementExample && discrepancyExample) break
    }

    return {
      sweep,
      trainSize: train.length,
      testSize: test.length,
      evaluation,
      insights,
      classify,
      k: K_NEIGHBORS,
      agreementExample,
      discrepancyExample,
    }
  }, [])
}
