/**
 * Inteligencia artificial del módulo Resultados: k-vecinos-más-cercanos
 * (k-NN), implementado aquí desde cero (sin librería de ML). Elegido frente
 * a regresión logística o un árbol de decisión porque:
 *
 * - No necesita entrenamiento iterativo (gradiente, convergencia): "entrenar"
 *   es solo guardar los ejemplos, así que no hay riesgo de que el
 *   entrenamiento falle o no converja.
 * - Es trivialmente interpretable: la propia predicción puede mostrar "estos
 *   son los k lanzamientos simulados más parecidos", en vez de pesos
 *   abstractos — encaja con el propio "Mapa de eficacia", que ya es una
 *   nube de puntos simulados.
 * - Es fácil de verificar a mano: con k=1, la predicción de un punto que
 *   coincide con un dato de entrenamiento debe ser exactamente su etiqueta.
 *
 * No hay ninguna llamada externa: todo el cálculo ocurre en el navegador
 * sobre datos generados por `parameterSweep.ts` + `validity.ts`.
 */

import type { SweepResult } from './types'

/** Orden fijo de variables de entrada, usado en todo este archivo. */
export const KNN_FEATURE_KEYS = ['initialSpeed', 'launchAngleDeg', 'releaseHeight', 'distanceToHoop'] as const
export type KnnFeatureKey = (typeof KNN_FEATURE_KEYS)[number]

export interface KnnSample {
  features: number[]
  /** true = zona favorable (válido o límite), false = desfavorable. */
  label: boolean
}

export interface FeatureRange {
  min: number
  max: number
}

export interface KnnNeighbor {
  sample: KnnSample
  distance: number
}

export interface KnnPrediction {
  label: boolean
  confidence: number
  neighbors: KnnNeighbor[]
}

export interface ConfusionMatrix {
  truePositive: number
  falsePositive: number
  trueNegative: number
  falseNegative: number
}

export interface KnnEvaluation {
  k: number
  trainSize: number
  testSize: number
  accuracy: number
  /** De los lanzamientos que la IA predice favorables, qué fracción lo son de verdad (TP / (TP+FP)). */
  precision: number
  /** De los lanzamientos realmente favorables, qué fracción detecta la IA (TP / (TP+FN)). Con datos muy desequilibrados (pocos favorables), la precisión global puede parecer alta aunque este valor sea bajo. */
  recall: number
  confusion: ConfusionMatrix
}

/** Convierte un barrido físico (`SweepResult`) en ejemplos de entrenamiento — nunca datos escritos a mano. */
export function sweepToDataset(sweep: SweepResult): KnnSample[] {
  return sweep.cells.map((cell) => ({
    features: KNN_FEATURE_KEYS.map((key) => cell.params[key]),
    label: cell.validity.label !== 'invalid',
  }))
}

export function computeFeatureRanges(samples: KnnSample[]): FeatureRange[] {
  const dims = samples[0]?.features.length ?? 0
  const ranges: FeatureRange[] = []
  for (let d = 0; d < dims; d += 1) {
    let min = Infinity
    let max = -Infinity
    for (const sample of samples) {
      const value = sample.features[d]
      if (value < min) min = value
      if (value > max) max = value
    }
    ranges.push({ min, max: max > min ? max : min + 1 })
  }
  return ranges
}

function normalize(features: number[], ranges: FeatureRange[]): number[] {
  return features.map((value, i) => (value - ranges[i].min) / (ranges[i].max - ranges[i].min))
}

function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i += 1) sum += (a[i] - b[i]) ** 2
  return Math.sqrt(sum)
}

export function findNearestNeighbors(query: number[], samples: KnnSample[], ranges: FeatureRange[], k: number): KnnNeighbor[] {
  const normalizedQuery = normalize(query, ranges)
  const scored = samples.map((sample) => ({
    sample,
    distance: euclideanDistance(normalizedQuery, normalize(sample.features, ranges)),
  }))
  scored.sort((a, b) => a.distance - b.distance)
  return scored.slice(0, Math.min(k, scored.length))
}

export function predictKnn(query: number[], samples: KnnSample[], ranges: FeatureRange[], k: number): KnnPrediction {
  const neighbors = findNearestNeighbors(query, samples, ranges, k)
  const favorableCount = neighbors.filter((n) => n.sample.label).length
  const label = favorableCount >= neighbors.length / 2
  const confidence = neighbors.length > 0 ? Math.max(favorableCount, neighbors.length - favorableCount) / neighbors.length : 0
  return { label, confidence, neighbors }
}

/**
 * Reparto reproducible train/test: mismo barajado en cada ejecución (semilla
 * fija) para que la precisión mostrada no cambie solo por recargar la
 * página, usando un generador congruencial simple (sin dependencias).
 */
export function splitDataset(samples: KnnSample[], trainFraction: number, seed = 42): { train: KnnSample[]; test: KnnSample[] } {
  const shuffled = [...samples]
  let state = seed
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    const j = state % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const splitIndex = Math.floor(shuffled.length * trainFraction)
  return { train: shuffled.slice(0, splitIndex), test: shuffled.slice(splitIndex) }
}

export function evaluateKnn(train: KnnSample[], test: KnnSample[], k: number): KnnEvaluation {
  const ranges = computeFeatureRanges(train)
  const confusion: ConfusionMatrix = { truePositive: 0, falsePositive: 0, trueNegative: 0, falseNegative: 0 }

  for (const sample of test) {
    const prediction = predictKnn(sample.features, train, ranges, k)
    if (prediction.label && sample.label) confusion.truePositive += 1
    else if (prediction.label && !sample.label) confusion.falsePositive += 1
    else if (!prediction.label && sample.label) confusion.falseNegative += 1
    else confusion.trueNegative += 1
  }

  const correct = confusion.truePositive + confusion.trueNegative
  const predictedFavorable = confusion.truePositive + confusion.falsePositive
  const actualFavorable = confusion.truePositive + confusion.falseNegative

  return {
    k,
    trainSize: train.length,
    testSize: test.length,
    accuracy: test.length > 0 ? correct / test.length : 0,
    precision: predictedFavorable > 0 ? confusion.truePositive / predictedFavorable : 0,
    recall: actualFavorable > 0 ? confusion.truePositive / actualFavorable : 0,
    confusion,
  }
}
