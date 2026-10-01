import { Canvas } from '@react-three/fiber'
import { forwardRef, Suspense, useEffect, useImperativeHandle, useRef } from 'react'
import { CameraRig, type CameraRigHandle } from './CameraRig'
import { SceneContent } from './SceneContent'
import type { Scene3DData, SceneViewMode } from './types'
import './Scene3DCanvas.css'

interface Scene3DCanvasProps {
  data: Scene3DData
  viewMode: SceneViewMode
  technicalMode: boolean
  onFirstInteract?: () => void
}

export interface Scene3DCanvasHandle {
  resetView: () => void
}

/**
 * Punto de montaje de la escena 3D compartida. Se monta con `React.lazy`
 * desde el módulo que la use (ver `TechnicalPage`), para que las páginas
 * que no la visitan no paguen el coste de three.js/@react-three en su
 * bundle. Reutilizable tal cual por el futuro Simulador: solo cambia qué
 * `data`/`viewMode` recibe, no la escena en sí.
 */
export const Scene3DCanvas = forwardRef<Scene3DCanvasHandle, Scene3DCanvasProps>(function Scene3DCanvas(
  { data, viewMode, technicalMode, onFirstInteract },
  ref,
) {
  const cameraRigRef = useRef<CameraRigHandle>(null)

  useImperativeHandle(ref, () => ({
    resetView: () => cameraRigRef.current?.resetView(),
  }))

  useEffect(() => {
    const id = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 80)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <Canvas className="scene3d-canvas" dpr={[1, 2]} shadows="soft" gl={{ antialias: true }}>
      <color attach="background" args={['#0c0f14']} />
      <Suspense fallback={null}>
        <SceneContent data={data} viewMode={viewMode} technicalMode={technicalMode} />
      </Suspense>
      <CameraRig ref={cameraRigRef} data={data} viewMode={viewMode} onStart={onFirstInteract} />
    </Canvas>
  )
})
