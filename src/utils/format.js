import { AVATAR_COLORS } from '../constants'

/** Deux initiales au plus, générées à partir du nom saisi. */
export function getInitiales(nom) {
  if (!nom || !nom.trim()) return '?'
  return nom.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

/** Aplat stable pour un participant donné. */
export function avatarColor(id) {
  if (!id) return AVATAR_COLORS[0]
  let hash = 0
  for (const ch of id) hash = (hash + ch.charCodeAt(0)) % AVATAR_COLORS.length
  return AVATAR_COLORS[hash]
}

/** « 3 participants », « 1 participant » — accord automatique. */
export function plural(n, singulier, pluriel = `${singulier}s`) {
  return `${n} ${n > 1 ? pluriel : singulier}`
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
