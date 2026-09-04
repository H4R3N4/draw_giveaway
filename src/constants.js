export const APP_TITLE = 'Giveaway giveaway'

/** Aplats des pastilles d'initiales — dégradé de violets ponctué d'or. */
export const AVATAR_COLORS = [
  '#341879',
  '#48269B',
  '#6B3FD4',
  '#9A6FE6',
  '#B67C08',
  '#E4A017',
]

export const RANK_LABELS = ['1er prix', '2e prix', '3e prix', '4e prix', '5e prix']

/** Devises disponibles pour la valeur des lots. */
export const DEVISES = {
  EUR: { code: 'EUR', label: 'Euro', symbole: '€' },
  MGA: { code: 'MGA', label: 'Ariary', symbole: 'Ar' },
}

export const DEVISE_PAR_DEFAUT = 'EUR'

/**
 * Taux fixe utilisé pour convertir les valeurs des lots entre devises et les
 * additionner dans le tableau de bord. À ajuster ici si le taux de change
 * évolue — l'application ne fait aucun appel réseau pour le récupérer.
 */
export const TAUX_EUR_VERS_MGA = 4800

export const MEDALS = [
  { label: 'Or', bg: 'var(--color-gold)', fg: 'var(--color-gold-ink)' },
  { label: 'Argent', bg: 'var(--color-accent)', fg: 'var(--color-on-accent)' },
  { label: 'Bronze', bg: 'var(--color-neutral-500)', fg: 'var(--color-on-accent)' },
]
