import { useState } from 'react'
import type { SceneViewMode } from '../../../scene3d/types'

export function useViewMode(initial: SceneViewMode = 'orbital') {
  const [viewMode, setViewMode] = useState<SceneViewMode>(initial)
  return { viewMode, setViewMode }
}
