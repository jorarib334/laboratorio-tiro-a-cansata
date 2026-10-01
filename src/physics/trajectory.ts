import type { LaunchParams, TrajectoryPoint } from './types'

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

/** Descomposición de la velocidad inicial: Vx = V0·cos(θ), Vy = V0·sen(θ). */
export function decomposeVelocity(params: Pick<LaunchParams, 'initialSpeed' | 'launchAngleDeg'>): {
  vx: number
  vy: number
} {
  const angleRad = degToRad(params.launchAngleDeg)
  return {
    vx: params.initialSpeed * Math.cos(angleRad),
    vy: params.initialSpeed * Math.sin(angleRad),
  }
}

/**
 * Posición del balón en el instante t, según:
 * x(t) = V0·cos(θ)·t
 * y(t) = y0 + V0·sen(θ)·t − ½·g·t²
 */
export function positionAt(params: LaunchParams, t: number): { x: number; y: number } {
  const { vx, vy } = decomposeVelocity(params)
  return {
    x: vx * t,
    y: params.releaseHeight + vy * t - 0.5 * params.gravity * t * t,
  }
}

/** Velocidad del balón en el instante t: Vx es constante, Vy(t) = Vy0 − g·t. */
export function velocityAt(params: LaunchParams, t: number): { vx: number; vy: number } {
  const { vx, vy } = decomposeVelocity(params)
  return { vx, vy: vy - params.gravity * t }
}

/** Punto completo (posición + velocidad) en el instante t. */
export function trajectoryPointAt(params: LaunchParams, t: number): TrajectoryPoint {
  const position = positionAt(params, t)
  const velocity = velocityAt(params, t)
  return { t, x: position.x, y: position.y, vx: velocity.vx, vy: velocity.vy }
}

/** Muestrea la trayectoria entre t=0 y t=tMax en `steps` intervalos iguales. */
export function sampleTrajectory(params: LaunchParams, tMax: number, steps: number): TrajectoryPoint[] {
  const points: TrajectoryPoint[] = []
  for (let i = 0; i <= steps; i += 1) {
    const t = (tMax * i) / steps
    points.push(trajectoryPointAt(params, t))
  }
  return points
}
