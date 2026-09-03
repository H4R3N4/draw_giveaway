/**
 * Accès à l'API Graph de Facebook — côté serveur uniquement.
 *
 * Le jeton d'accès ne doit jamais atteindre le navigateur : il reste dans les
 * variables d'environnement du serveur, qui joue le rôle de relais.
 */

const GRAPH_VERSION = process.env.FB_GRAPH_VERSION || 'v21.0'
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`

/** Nombre de commentaires ramenés par appel — 100 est le maximum toléré. */
const PAGE_SIZE = 100

/** Garde-fou : au-delà, on arrête de paginer pour ne pas boucler sans fin. */
const MAX_PAGES = 50

export class FacebookError extends Error {
  constructor(message, status = 502, details) {
    super(message)
    this.name = 'FacebookError'
    this.status = status
    this.details = details
  }
}

/**
 * Extrait l'identifiant de publication d'une URL Facebook.
 *
 * L'API Graph attend la forme « {page-id}_{post-id} » ; selon la mise en forme
 * de l'URL, l'un des deux morceaux peut manquer et le jeton de Page complète
 * alors l'identifiant côté appelant.
 *
 * Formats couverts :
 *   /{page}/posts/{id}          /{page}/photos/a.xxx/{id}
 *   /permalink.php?story_fbid=&id=      /story.php?story_fbid=&id=
 *   /{page}/videos/{id}         /watch/?v={id}
 *   /share/p/{token}            (identifiant opaque : non résoluble)
 *   « {page}_{post} » ou un identifiant numérique déjà prêt
 */
export function parsePostUrl(entree) {
  const brut = String(entree || '').trim()
  if (!brut) throw new FacebookError('Lien de publication manquant', 400)

  // Identifiant déjà fourni sous la forme attendue par l'API.
  if (/^\d+_\d+$/.test(brut) || /^\d{5,}$/.test(brut)) {
    return { postId: brut, pageId: brut.includes('_') ? brut.split('_')[0] : null }
  }

  let url
  try {
    url = new URL(brut.startsWith('http') ? brut : `https://${brut}`)
  } catch {
    throw new FacebookError("Lien invalide — collez l'URL complète de la publication", 400)
  }

  if (!/(^|\.)(facebook\.com|fb\.com|fb\.watch|m\.facebook\.com)$/i.test(url.hostname)) {
    throw new FacebookError('Ce lien ne pointe pas vers Facebook', 400)
  }

  const params = url.searchParams
  const storyFbid = params.get('story_fbid') || params.get('fbid')
  const owner = params.get('id')
  if (storyFbid) {
    return {
      postId: owner ? `${owner}_${storyFbid}` : storyFbid,
      pageId: owner || null,
    }
  }

  const v = params.get('v')
  if (v) return { postId: v, pageId: null }

  const segments = url.pathname.split('/').filter(Boolean)

  // Les liens de partage courts encapsulent un jeton opaque, non convertible
  // en identifiant sans suivre la redirection côté Facebook.
  if (segments[0] === 'share') {
    throw new FacebookError(
      "Les liens de partage courts (facebook.com/share/…) ne contiennent pas l'identifiant de la publication. Ouvrez la publication sur Facebook et copiez l'URL affichée dans la barre d'adresse.",
      400,
    )
  }

  const motsCles = ['posts', 'videos', 'photos', 'reel', 'reels', 'activity']
  for (let i = segments.length - 1; i >= 0; i--) {
    if (!motsCles.includes(segments[i])) continue
    // Le dernier segment numérique après le mot-clé porte l'identifiant
    // (« /photos/a.123456/789 » place un préfixe d'album au milieu).
    const apres = segments.slice(i + 1).filter(s => /^\d+$/.test(s))
    const id = apres[apres.length - 1]
    if (!id) break
    const proprietaire = /^\d+$/.test(segments[i - 1] || '') ? segments[i - 1] : null
    return { postId: proprietaire ? `${proprietaire}_${id}` : id, pageId: proprietaire }
  }

  throw new FacebookError(
    "Identifiant de publication introuvable dans ce lien. Ouvrez la publication sur Facebook, puis copiez l'URL de la barre d'adresse (elle contient « /posts/… » ou « story_fbid=… »).",
    400,
  )
}

async function graph(chemin, recherche, token) {
  const url = new URL(`${GRAPH_BASE}/${chemin}`)
  for (const [cle, valeur] of Object.entries(recherche)) url.searchParams.set(cle, valeur)
  url.searchParams.set('access_token', token)

  let reponse
  try {
    reponse = await fetch(url, { headers: { Accept: 'application/json' } })
  } catch (err) {
    throw new FacebookError(`Facebook injoignable : ${err.message}`, 502)
  }

  const corps = await reponse.json().catch(() => null)

  if (!reponse.ok || corps?.error) {
    const erreur = corps?.error || {}
    // Le message de Facebook est explicite (jeton expiré, permission absente,
    // publication inaccessible) : on le transmet tel quel à l'interface.
    throw new FacebookError(
      erreur.message || `Erreur Facebook (HTTP ${reponse.status})`,
      reponse.status === 400 || reponse.status === 403 ? 400 : 502,
      { code: erreur.code, type: erreur.type, subcode: erreur.error_subcode },
    )
  }

  return corps
}

/**
 * Récupère tous les commentaires d'une publication, en suivant la pagination.
 *
 * `filter=stream` inclut les réponses aux commentaires ; les participants sont
 * ensuite dédoublonnés sur l'identifiant d'auteur par l'appelant.
 */
export async function fetchComments(postId, token, { inclureReponses = true } = {}) {
  const commentaires = []
  let apres = null
  let pages = 0

  do {
    const recherche = {
      fields: 'id,message,created_time,from{id,name,picture}',
      limit: String(PAGE_SIZE),
      filter: inclureReponses ? 'stream' : 'toplevel',
      order: 'chronological',
    }
    if (apres) recherche.after = apres

    const page = await graph(`${postId}/comments`, recherche, token)
    for (const c of page.data || []) commentaires.push(c)

    apres = page.paging?.cursors?.after && page.paging?.next ? page.paging.cursors.after : null
    pages++
  } while (apres && pages < MAX_PAGES)

  return { commentaires, tronque: Boolean(apres) }
}

/**
 * Réduit les commentaires à la liste des auteurs distincts.
 *
 * `from` est absent lorsque l'application n'a pas la permission de voir
 * l'auteur (commentaire d'un profil personnel sans autorisation) : ces
 * commentaires sont comptés à part pour pouvoir l'expliquer à l'utilisateur.
 */
export function extraireAuteurs(commentaires, { motCle = '' } = {}) {
  const filtre = motCle.trim().toLowerCase()
  const parAuteur = new Map()
  let anonymes = 0
  let horsFiltre = 0

  for (const c of commentaires) {
    const message = c.message || ''
    if (filtre && !message.toLowerCase().includes(filtre)) { horsFiltre++; continue }

    const auteur = c.from
    if (!auteur?.id || !auteur?.name) { anonymes++; continue }

    const existant = parAuteur.get(auteur.id)
    if (existant) {
      existant.nbCommentaires++
      // On garde la trace du commentaire le plus ancien : il matérialise
      // l'ordre d'arrivée dans la publication.
      if (c.created_time && c.created_time < existant.date) {
        existant.date = c.created_time
        existant.message = message
      }
      continue
    }

    parAuteur.set(auteur.id, {
      facebookId: auteur.id,
      nom: auteur.name,
      photo: auteur.picture?.data?.url || '',
      message,
      date: c.created_time || '',
      nbCommentaires: 1,
    })
  }

  const auteurs = [...parAuteur.values()].sort((a, b) => a.date.localeCompare(b.date))
  return {
    auteurs,
    stats: {
      commentaires: commentaires.length,
      auteurs: auteurs.length,
      doublons: commentaires.length - auteurs.length - anonymes - horsFiltre,
      anonymes,
      horsFiltre,
    },
  }
}
