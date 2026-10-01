/** Muestreo uniforme entre `min` y `max` en `steps` puntos (incluyendo ambos extremos). Compartido por `parameterSweep.ts` y `grid.ts` para no duplicar esta iteración. */
export function linspace(min: number, max: number, steps: number): number[] {
  if (steps <= 1) return [min]
  const values: number[] = []
  for (let i = 0; i < steps; i += 1) {
    values.push(min + ((max - min) * i) / (steps - 1))
  }
  return values
}
