export type ModuleStatus = 'disponible' | 'en-estudio'

export interface LabModule {
  id: 'physics' | 'geometry' | 'technical' | 'results' | 'ai'
  name: string
  summary: string
  detail: string
  status: ModuleStatus
  statusLabel: string
  accentVar: '--color-physics' | '--color-geometry' | '--color-technical' | '--color-simulator' | '--color-ai'
  /** Ruta del módulo, cuando ya tiene página propia. */
  route?: string
}
