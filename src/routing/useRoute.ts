import { useSyncExternalStore } from 'react'
import { ROUTE_CHANGE_EVENT } from './navigate'

function subscribe(callback: () => void): () => void {
  window.addEventListener('popstate', callback)
  window.addEventListener(ROUTE_CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener('popstate', callback)
    window.removeEventListener(ROUTE_CHANGE_EVENT, callback)
  }
}

function getSnapshot(): string {
  return window.location.pathname
}

/** Ruta actual (pathname), reactiva a navegación interna y a atrás/adelante del navegador. */
export function useRoute(): string {
  return useSyncExternalStore(subscribe, getSnapshot)
}
