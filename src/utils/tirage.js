/**
 * Mélange un tableau (Fisher-Yates) et retourne une copie mélangée
 */
function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Développe les lots sélectionnés en une file de places à tirer, une par
 * gagnant à désigner. Le tirage se fait ensuite place par place, en
 * commençant par le lot au rang le plus bas (ex. 3e prix) pour finir sur le
 * 1er prix — comme dans une cérémonie qui garde le meilleur pour la fin.
 * Les lots sans rang explicite passent en dernier, dans leur ordre d'origine.
 * @param {Array} lots - Lots sélectionnés (avec quantite, rang optionnel)
 * @param {number} maxPlaces - Plafond (nombre de participants disponibles)
 * @returns {Array} places - [{ lot, rangDansLot, quantiteLot }]
 */
export function construirePlaces(lots, maxPlaces) {
  const lotsOrdreDecroissant = [...lots].sort((a, b) => (b.rang ?? -Infinity) - (a.rang ?? -Infinity))

  const places = []
  for (const lot of lotsOrdreDecroissant) {
    const quantite = parseInt(lot.quantite, 10) || 1
    for (let i = 0; i < quantite; i++) {
      if (places.length >= maxPlaces) return places
      places.push({ lot, rangDansLot: i + 1, quantiteLot: quantite })
    }
  }
  return places
}

/**
 * Tire un gagnant au hasard parmi les participants encore en lice.
 * @param {Array} participantsRestants
 * @returns {Object|null} le participant tiré
 */
export function tirerUnGagnant(participantsRestants) {
  if (participantsRestants.length === 0) return null
  return participantsRestants[Math.floor(Math.random() * participantsRestants.length)]
}

/**
 * Construit la bande défilante de la roulette : une piste de noms qui se
 * termine exactement sur le gagnant.
 *
 * La piste répète la liste des participants (dans un ordre mélangé mais stable
 * d'un tour à l'autre pour que le défilement paraisse continu), puis pose le
 * gagnant en position finale. L'animation n'a plus qu'à translater la piste
 * jusqu'à cet index pour s'arrêter pile sur lui.
 *
 * @param {Array} participants - Tous les participants en lice
 * @param {Object} gagnant - Le participant déjà tiré en arrière-plan
 * @param {number} tours - Nombre de passages complets de la liste
 * @returns {{ piste: Array, indexGagnant: number }}
 */
export function construirePiste(participants, gagnant, tours = 4) {
  // Un minimum de cellules garantit un défilement crédible même avec 2 ou
  // 3 participants : on répète la liste jusqu'à atteindre ce seuil.
  const CELLULES_MIN = 28
  const boucles = Math.max(tours, Math.ceil(CELLULES_MIN / Math.max(participants.length, 1)))

  const piste = []
  for (let t = 0; t < boucles; t++) {
    for (const p of shuffleArray(participants)) piste.push(p)
  }
  // Le gagnant clôt la piste : c'est la cellule sur laquelle on s'arrête.
  piste.push(gagnant)

  return { piste, indexGagnant: piste.length - 1 }
}
