/** Formato numérico consistente para toda la interfaz del laboratorio. */
export function formatNumber(value: number, digits = 2): string {
  return value.toLocaleString('es-ES', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}
