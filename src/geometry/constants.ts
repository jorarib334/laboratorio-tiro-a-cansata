/**
 * Radios reglamentarios reales (mismo criterio que la altura del aro y la
 * distancia de tiro libre ya usadas en Física: medidas oficiales, no
 * inventadas).
 *
 * - Balón: circunferencia reglamentaria FIBA talla 7 ≈ 749-780 mm de
 *   circunferencia → radio ≈ 0,12 m.
 * - Aro: diámetro interior reglamentario de 45,72 cm (18 pulgadas) → radio
 *   0,2286 m.
 */
export const BALL_RADIUS = 0.12
export const HOOP_RADIUS = 0.2286

export const OFFSET_LIMITS = {
  dx: { min: -0.4, max: 0.4, step: 0.005 },
  dy: { min: -0.4, max: 0.4, step: 0.005 },
} as const
