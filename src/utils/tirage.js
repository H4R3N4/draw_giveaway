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
 * Effectue le tirage au sort.
 * @param {Array} participants - Liste des participants
 * @param {Array} lots - Liste des lots sélectionnés (avec quantite)
 * @returns {Array} gagnants - [{ participant, lot }]
 */
export function effectuerTirage(participants, lots) {
  const participantsMelanges = shuffleArray(participants)
  const gagnants = []
  let index = 0

  for (const lot of lots) {
    const quantite = parseInt(lot.quantite, 10) || 1
    for (let i = 0; i < quantite; i++) {
      if (index >= participantsMelanges.length) break
      gagnants.push({
        participant: participantsMelanges[index],
        lot,
      })
      index++
    }
  }

  return gagnants
}
