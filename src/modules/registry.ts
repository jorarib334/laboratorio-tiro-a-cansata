import type { LabModule } from './types'

export const labModules: LabModule[] = [
  {
    id: 'physics',
    name: 'Física',
    summary: 'El balón sigue una trayectoria parabólica.',
    detail:
      'Modela la velocidad inicial, el ángulo de lanzamiento y la altura de liberación para calcular la trayectoria completa del tiro.',
    status: 'disponible',
    statusLabel: 'Disponible',
    accentVar: '--color-physics',
    route: '/fisica',
  },
  {
    id: 'geometry',
    name: 'Geometría',
    summary: 'No todo lanzamiento que llega al aro entra en él.',
    detail:
      'Analiza el ángulo de entrada y la ventana efectiva de enceste a partir de la posición relativa entre el balón y el aro.',
    status: 'disponible',
    statusLabel: 'Disponible',
    accentVar: '--color-geometry',
    route: '/geometria',
  },
  {
    id: 'technical',
    name: 'Representación técnica',
    summary: 'Un mismo lanzamiento, en alzado, planta y perfil.',
    detail:
      'El mismo modelo 3D del jugador, el balón, el aro y la trayectoria, con sus proyecciones y un modo técnico que revela la construcción geométrica.',
    status: 'disponible',
    statusLabel: 'Disponible',
    accentVar: '--color-technical',
    route: '/representacion-tecnica',
  },
  {
    id: 'results',
    name: 'Resultados',
    summary: 'Miles de lanzamientos simulados, en un mapa.',
    detail:
      'Mapas de eficacia y tolerancia, comparación de lanzamientos y observaciones calculadas sobre cómo influyen V₀, θ, y₀ y d en el resultado.',
    status: 'disponible',
    statusLabel: 'Disponible',
    accentVar: '--color-simulator',
    route: '/resultados',
  },
  {
    id: 'ai',
    name: 'Inteligencia artificial',
    summary: 'Un modelo aprende los patrones del modelo físico.',
    detail:
      'Un k-NN entrenado con los datos que genera el propio simulador clasifica configuraciones nuevas y se compara honestamente con el modelo físico.',
    status: 'disponible',
    statusLabel: 'Disponible',
    accentVar: '--color-ai',
    route: '/ia',
  },
]
