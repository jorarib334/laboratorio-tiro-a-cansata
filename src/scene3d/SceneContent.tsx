import { Environment } from '@react-three/drei'
import { AnimatedBall3D } from './AnimatedBall3D'
import { AxesReference3D } from './AxesReference3D'
import { Court3D } from './Court3D'
import { Hoop3D } from './Hoop3D'
import { Player3D } from './Player3D'
import { ProjectionLines3D } from './ProjectionLines3D'
import { TrajectoryLine3D } from './TrajectoryLine3D'
import type { Scene3DData, SceneViewMode } from './types'

interface SceneContentProps {
  data: Scene3DData
  viewMode: SceneViewMode
  technicalMode: boolean
}

/**
 * Contenido de la escena, independiente de la cámara (ver `CameraRig`).
 * Cada pieza es su propio componente para poder reutilizarlas por
 * separado (p. ej. el Simulador podría querer solo `Ball3D`+`TrajectoryLine3D`).
 * Iluminación de tres puntos + niebla sutil para dar profundidad +
 * `Environment` para reflejos moderados en el aro/tablero/pista — "modo
 * técnico" sustituye los materiales realistas por uno plano compartido en
 * cada pieza y fuerza las referencias de construcción a quedar siempre
 * visibles, sobre el mismo modelo (no uno nuevo).
 */
export function SceneContent({ data, viewMode, technicalMode }: SceneContentProps) {
  const showProjections = technicalMode || viewMode !== 'orbital'
  const shadowSpan = Math.max(data.hoopPosition.x, 2) * 1.1

  return (
    <>
      <fog attach="fog" args={['#0c0f14', 6, 22]} />

      <ambientLight intensity={technicalMode ? 0.9 : 0.5} />
      <directionalLight position={[3.5, 7.5, 5]} intensity={1.25} castShadow shadow-mapSize={[2048, 2048]}>
        <orthographicCamera attach="shadow-camera" args={[-shadowSpan, shadowSpan, shadowSpan, -shadowSpan, 0.5, 20]} />
      </directionalLight>
      <directionalLight position={[-5, 4, -3]} intensity={0.35} />
      <directionalLight position={[0, 2.5, -6]} intensity={0.3} color="#3fa9ff" />
      <pointLight position={[data.hoopPosition.x, data.hoopPosition.y + 1, 1.5]} intensity={0.4} color="#ffb178" distance={4} />

      {!technicalMode && <Environment preset="warehouse" environmentIntensity={0.45} />}

      <Court3D span={data.hoopPosition.x} technicalMode={technicalMode} />

      <Player3D position={[-0.4, 0, 0]} technicalMode={technicalMode} />
      <AnimatedBall3D flightTime={data.flightTime} radius={data.ballRadius} fallbackPosition={data.ballPosition} technicalMode={technicalMode} />
      <Hoop3D position={[data.hoopPosition.x, data.hoopPosition.y, data.hoopPosition.z]} radius={data.hoopRadius} technicalMode={technicalMode} />
      <TrajectoryLine3D points={data.trajectory} />
      <ProjectionLines3D point={data.ballPosition} active={showProjections} />
      {technicalMode && <AxesReference3D length={Math.max(data.hoopPosition.x * 0.3, 1)} />}
    </>
  )
}
