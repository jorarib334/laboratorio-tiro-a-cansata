/**
 * Enrutado mínimo sin librería: el proyecto ya tiene previstas seis páginas
 * (Física, Geometría, Simulador, Resultados, IA, 3D) pero por ahora solo
 * necesita distinguir dos, así que no se justifica añadir react-router.
 * `pushState` no dispara `popstate` por sí solo, así que se emite un evento
 * propio para que `useRoute` (mismo directorio) se entere del cambio.
 */
export const ROUTE_CHANGE_EVENT = 'lab:routechange'

export function navigate(path: string): void {
  if (window.location.pathname === path) return
  window.history.pushState(null, '', path)
  window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT))
}
