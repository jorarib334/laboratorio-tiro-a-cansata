import type { Scene3DData, SceneViewMode } from './types'

export interface CameraPreset {
  position: [number, number, number]
  target: [number, number, number]
  /** `up` distinto de (0,1,0) solo hace falta para planta (cámara mirando hacia abajo). */
  up: [number, number, number]
  zoom: number
}

/**
 * Convención diédrica: alzado = plano X-Y (distancia y altura, donde se ve
 * el arco de la trayectoria), perfil = plano Z-Y (ancho y altura) y planta
 * = plano X-Z (distancia y ancho) — vistas ortogonales entre sí. Como el
 * modelo físico no tiene componente lateral (z=0 en toda la trayectoria),
 * planta y perfil muestran la trayectoria como una línea recta: no es un
 * error, es lo que le corresponde honestamente a un tiro sin desviación
 * lateral en esas proyecciones.
 */
export function buildCameraPresets(data: Scene3DData): Record<SceneViewMode, CameraPreset> {
  const center: [number, number, number] = [data.hoopPosition.x / 2, data.hoopPosition.y * 0.6, 0]
  const distance = 8

  return {
    orbital: {
      position: [center[0] - distance * 0.55, center[1] + distance * 0.55, distance * 0.75],
      target: center,
      up: [0, 1, 0],
      zoom: 95,
    },
    alzado: {
      position: [center[0], center[1], distance],
      target: center,
      up: [0, 1, 0],
      zoom: 105,
    },
    planta: {
      position: [center[0], center[1] + distance, 0.0001],
      target: center,
      up: [0, 0, -1],
      zoom: 105,
    },
    perfil: {
      position: [distance, center[1], center[2]],
      target: center,
      up: [0, 1, 0],
      zoom: 105,
    },
  }
}

export const VIEW_MODE_LABELS: Record<SceneViewMode, string> = {
  orbital: '3D',
  alzado: 'Alzado',
  planta: 'Planta',
  perfil: 'Perfil',
}

export const VIEW_MODE_DESCRIPTIONS: Record<SceneViewMode, string> = {
  orbital: 'Vista libre: gira, acerca y desplaza la cámara con el ratón.',
  alzado: 'Proyección frontal del lanzamiento.',
  planta: 'Proyección horizontal del lanzamiento.',
  perfil: 'Proyección lateral del lanzamiento.',
}
