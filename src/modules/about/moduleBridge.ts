export interface BridgeEntry {
  section: string
  title: string
  route: string
  moduleLabel: string
  accentVar: string
}

/**
 * Qué apartado de la memoria escrita corresponde a qué módulo interactivo de
 * este laboratorio — los apartados y numeración son los reales del índice
 * del trabajo (`public/memoria-tiro-a-canasta.pdf`), no una lista inventada.
 */
export const BRIDGE_ENTRIES: BridgeEntry[] = [
  {
    section: '3.2',
    title: 'Diseño del modelo físico del simulador',
    route: '/fisica',
    moduleLabel: 'Física',
    accentVar: '--color-physics',
  },
  {
    section: '3.3',
    title: 'Diseño del modelo geométrico',
    route: '/geometria',
    moduleLabel: 'Geometría',
    accentVar: '--color-geometry',
  },
  {
    section: '3.4',
    title: 'Diseño y representación mediante dibujo técnico',
    route: '/representacion-tecnica',
    moduleLabel: 'Representación técnica',
    accentVar: '--color-technical',
  },
  {
    section: '4',
    title: 'Resultados',
    route: '/resultados',
    moduleLabel: 'Resultados',
    accentVar: '--color-simulator',
  },
  {
    section: '3.5 – 3.6',
    title: 'Desarrollo asistido mediante IA e incorporación del modelo de aprendizaje automático',
    route: '/ia',
    moduleLabel: 'Inteligencia artificial',
    accentVar: '--color-ai',
  },
]
