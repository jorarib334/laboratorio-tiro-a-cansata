import { CameraControls, OrthographicCamera } from '@react-three/drei'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { buildCameraPresets } from './viewPresets'
import type { Scene3DData, SceneViewMode } from './types'

interface CameraRigProps {
  data: Scene3DData
  viewMode: SceneViewMode
  onStart?: () => void
}

export interface CameraRigHandle {
  resetView: () => void
}

/**
 * Una única cámara ortográfica para toda la escena (libre 3D incluida):
 * evita el salto de proyección al cambiar entre la vista libre y las tres
 * proyecciones fijas, y encaja con la lectura de "instrumento de Dibujo
 * Técnico" en vez de una fotografía. `CameraControls` (drei) hace las
 * transiciones suaves entre posiciones y bloquea la rotación fuera de la
 * vista libre — nunca se ocultan elementos para simular un cambio de vista,
 * la cámara se mueve de verdad.
 */
export const CameraRig = forwardRef<CameraRigHandle, CameraRigProps>(function CameraRig({ data, viewMode, onStart }, ref) {
  const controlsRef = useRef<CameraControls | null>(null)
  const presets = useMemo(() => buildCameraPresets(data), [data])
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const applyPreset = useCallback(
    (mode: SceneViewMode, animate: boolean) => {
      const controls = controlsRef.current
      if (!controls) return
      const preset = presets[mode]
      const shouldAnimate = animate && !prefersReducedMotion
      controls.camera.up.set(...preset.up)
      // `zoomTo` (no asignar `camera.zoom` a mano) para que el estado interno
      // de CameraControls no se desincronice del zoom aplicado con la rueda
      // del ratón — si no, "Vista inicial" podía revertirse al zoom manual
      // anterior en el siguiente frame.
      controls.zoomTo(preset.zoom, shouldAnimate)
      controls.setLookAt(...preset.position, ...preset.target, shouldAnimate)
      const canRotate = mode === 'orbital'
      controls.azimuthRotateSpeed = canRotate ? 1 : 0
      controls.polarRotateSpeed = canRotate ? 1 : 0
    },
    [presets, prefersReducedMotion],
  )

  useEffect(() => {
    applyPreset(viewMode, true)
  }, [viewMode, applyPreset])

  useImperativeHandle(ref, () => ({
    resetView: () => applyPreset(viewMode, true),
  }))

  return (
    <>
      <OrthographicCamera makeDefault position={presets.orbital.position} up={presets.orbital.up} zoom={presets.orbital.zoom} near={0.1} far={100} />
      <CameraControls ref={controlsRef} minZoom={40} maxZoom={220} dollyToCursor={false} onStart={onStart} />
    </>
  )
})
