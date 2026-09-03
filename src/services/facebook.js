/**
 * Client du relais Facebook.
 *
 * L'application ne parle jamais à Facebook directement : le jeton d'accès vit
 * uniquement dans le serveur (dossier server/), atteint ici via /api.
 */

async function appeler(chemin, params) {
  const url = new URL(chemin, window.location.origin)
  for (const [cle, valeur] of Object.entries(params || {})) {
    if (valeur !== '' && valeur != null) url.searchParams.set(cle, valeur)
  }

  let reponse
  try {
    reponse = await fetch(url, { headers: { Accept: 'application/json' } })
  } catch {
    throw new Error("Serveur d'import injoignable — lancez-le avec « npm run server ».")
  }

  const corps = await reponse.json().catch(() => null)
  if (!reponse.ok) {
    throw new Error(corps?.error || `Erreur ${reponse.status} lors de l'appel au serveur.`)
  }
  return corps
}

/** Indique si le serveur dispose d'un jeton — sert à prévenir avant l'import. */
export function getStatutFacebook() {
  return appeler('/api/facebook/status')
}

/**
 * Récupère les auteurs distincts des commentaires d'une publication.
 * @returns {Promise<{postId: string, auteurs: Array, stats: object, tronque: boolean}>}
 */
export function getCommentaires({ url, motCle = '', inclureReponses = true }) {
  return appeler('/api/facebook/comments', {
    url,
    motCle,
    reponses: inclureReponses ? '1' : '0',
  })
}
