import { DEVISES, DEVISE_PAR_DEFAUT, TAUX_EUR_VERS_MGA } from '../constants'

/** Convertit un montant d'une devise vers une autre via le taux fixe EUR/Ariary. */
export function convertir(montant, deDevise, versDevise) {
  if (deDevise === versDevise) return montant
  if (deDevise === 'EUR' && versDevise === 'MGA') return montant * TAUX_EUR_VERS_MGA
  if (deDevise === 'MGA' && versDevise === 'EUR') return montant / TAUX_EUR_VERS_MGA
  return montant
}

/** « 120 € » ou « 576 000 Ar » — arrondi à l'entier, pas de décimales inutiles. */
export function formatMontant(montant, devise = DEVISE_PAR_DEFAUT) {
  const symbole = DEVISES[devise]?.symbole ?? devise
  return `${Math.round(montant).toLocaleString('fr-FR')} ${symbole}`
}

/**
 * Additionne la valeur des lots (valeur × quantité) en les convertissant
 * toutes vers une même devise cible.
 */
export function valeurTotale(lots, versDevise) {
  return lots.reduce((acc, l) => {
    const valeur = parseFloat(l.valeur) || 0
    const quantite = parseInt(l.quantite, 10) || 1
    return acc + convertir(valeur, l.devise || DEVISE_PAR_DEFAUT, versDevise) * quantite
  }, 0)
}
