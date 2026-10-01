import { useMemo, useState } from 'react'
import { DEFAULT_INITIAL_SPEED } from '../../../physics/constants'
import type { LaunchParams } from '../../../physics/types'
import { computeEfficacyIndex } from '../../../results/efficacyIndex'
import { computeToleranceReport } from '../../../results/marginAnalysis'
import { runSimulation } from '../../../results/runSimulation'

export interface ComparisonSlot {
  label: string
  initialSpeed: number
  launchAngleDeg: number
}

const SLOT_LABELS = ['A', 'B', 'C']
const DEFAULT_SLOTS: ComparisonSlot[] = [
  { label: 'A', initialSpeed: DEFAULT_INITIAL_SPEED, launchAngleDeg: 42 },
  { label: 'B', initialSpeed: DEFAULT_INITIAL_SPEED, launchAngleDeg: 55 },
]

type Context = Pick<LaunchParams, 'releaseHeight' | 'distanceToHoop' | 'hoopHeight' | 'gravity'>

/** Comparación de 2-3 lanzamientos: cada fila reutiliza `runSimulation`/`computeEfficacyIndex`/`computeToleranceReport`, nada de lógica nueva. */
export function useLaunchComparison(context: Context) {
  const [slots, setSlots] = useState<ComparisonSlot[]>(DEFAULT_SLOTS)

  function updateSlot(label: string, patch: Partial<Pick<ComparisonSlot, 'initialSpeed' | 'launchAngleDeg'>>) {
    setSlots((prev) => prev.map((slot) => (slot.label === label ? { ...slot, ...patch } : slot)))
  }

  function addSlot() {
    setSlots((prev) => {
      if (prev.length >= 3) return prev
      const label = SLOT_LABELS[prev.length]
      return [...prev, { label, initialSpeed: DEFAULT_INITIAL_SPEED, launchAngleDeg: 65 }]
    })
  }

  function removeSlot(label: string) {
    setSlots((prev) => (prev.length <= 2 ? prev : prev.filter((slot) => slot.label !== label)))
  }

  const details = useMemo(
    () =>
      slots.map((slot) => {
        const params: LaunchParams = { ...context, initialSpeed: slot.initialSpeed, launchAngleDeg: slot.launchAngleDeg }
        return {
          ...slot,
          params,
          simulation: runSimulation(params),
          efficacy: computeEfficacyIndex(params),
          tolerance: computeToleranceReport(params),
        }
      }),
    [slots, context],
  )

  return { slots, details, updateSlot, addSlot, removeSlot, canAdd: slots.length < 3, canRemove: slots.length > 2 }
}
