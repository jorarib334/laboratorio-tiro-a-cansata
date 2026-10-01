/**
 * Contrato de la escena 3D compartida (Three.js + React Three Fiber).
 * Vive fuera de cualquier módulo concreto porque la usan tanto
 * Representación Técnica como, más adelante, el Simulador — sin duplicar
 * la implementación (ver docs/bitacora-ia.md).
 */

/** Punto de la trayectoria en el sistema de coordenadas 3D de la escena (metros). */
export interface TrajectoryPoint3D {
  t: number
  x: number
  y: number
  z: number
}

/** Las cuatro vistas: libre orbital, y las tres proyecciones diédricas. */
export type SceneViewMode = 'orbital' | 'alzado' | 'planta' | 'perfil'

/**
 * Datos de entrada de la escena — ya calculados fuera de aquí (ver
 * `trajectoryAdapter.ts`, que reutiliza `src/physics/`). La escena 3D
 * nunca recalcula física ni geometría, solo la representa.
 */
export interface Scene3DData {
  trajectory: TrajectoryPoint3D[]
  /** Duración total del vuelo (s) — permite animar el balón sobre la misma trayectoria. */
  flightTime: number
  ballPosition: { x: number; y: number; z: number }
  hoopPosition: { x: number; y: number; z: number }
  hoopRadius: number
  ballRadius: number
  releaseHeight: number
}
