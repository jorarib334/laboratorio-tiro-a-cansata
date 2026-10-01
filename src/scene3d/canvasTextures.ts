import * as THREE from 'three'

/**
 * Texturas generadas por código (Canvas nativo del navegador) en vez de
 * activos externos: no hay imágenes aportadas para el balón/la pista y no
 * se añade ninguna dependencia para conseguirlas. Cada función crea el
 * canvas una sola vez (se cachea vía `useMemo` en el componente que la usa).
 */

/** Balón: grano "pebble" + costuras curvas sobre un mapeo equirectangular. */
export function createBasketballTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#d1531f'
  ctx.fillRect(0, 0, 512, 256)

  // Grano del cuero
  ctx.fillStyle = 'rgba(20, 10, 5, 0.16)'
  for (let i = 0; i < 2600; i += 1) {
    const x = Math.random() * 512
    const y = Math.random() * 256
    const r = 0.5 + Math.random() * 0.6
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Sombreado suave hacia los polos (variación de tono, no geometría)
  const poleShade = ctx.createLinearGradient(0, 0, 0, 256)
  poleShade.addColorStop(0, 'rgba(0,0,0,0.18)')
  poleShade.addColorStop(0.5, 'rgba(0,0,0,0)')
  poleShade.addColorStop(1, 'rgba(0,0,0,0.18)')
  ctx.fillStyle = poleShade
  ctx.fillRect(0, 0, 512, 256)

  // Costuras
  ctx.strokeStyle = '#1c140d'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.moveTo(0, 128)
  ctx.lineTo(512, 128)
  ctx.stroke()
  ;[128, 384].forEach((x) => {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 256)
    ctx.stroke()
  })

  ctx.beginPath()
  ctx.moveTo(0, 64)
  ctx.quadraticCurveTo(128, 8, 256, 64)
  ctx.quadraticCurveTo(384, 120, 512, 64)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, 192)
  ctx.quadraticCurveTo(128, 248, 256, 192)
  ctx.quadraticCurveTo(384, 136, 512, 192)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

/** Suelo: parqué cálido con vetas y juntas de tablón. */
export function createCourtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  const base = ctx.createLinearGradient(0, 0, 512, 512)
  base.addColorStop(0, '#3a2a1a')
  base.addColorStop(1, '#2a1e13')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 512)

  // Vetas de madera
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'
  ctx.lineWidth = 1
  for (let y = 0; y < 512; y += 3) {
    ctx.beginPath()
    ctx.moveTo(0, y + Math.sin(y * 0.15) * 2)
    ctx.lineTo(512, y + Math.cos(y * 0.1) * 2)
    ctx.stroke()
  }

  // Juntas de tablón (parqué)
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'
  ctx.lineWidth = 2
  for (let x = 0; x <= 512; x += 64) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 512)
    ctx.stroke()
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(512, y)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
