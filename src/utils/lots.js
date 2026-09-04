/**
 * Place un lot à un rang donné en décalant les autres : comme une insertion
 * dans une liste ordonnée, un seul lot occupe chaque rang à la fois.
 *
 * `ancienRang` est le rang que le lot déplacé occupait avant ce changement
 * (absent pour un lot tout juste créé) : les lots qui le suivaient reculent
 * d'une place pour combler ce vide, puis tout ce qui se trouve au rang visé
 * ou après avance d'une place pour la lui céder.
 */
export function reorganiserRangs(lots, lotId, nouveauRang, ancienRang) {
  let resultat = lots
  if (ancienRang != null) {
    resultat = resultat.map(l =>
      l.id !== lotId && l.rang != null && l.rang > ancienRang ? { ...l, rang: l.rang - 1 } : l
    )
  }
  return resultat.map(l =>
    l.id !== lotId && l.rang != null && l.rang >= nouveauRang ? { ...l, rang: l.rang + 1 } : l
  )
}
