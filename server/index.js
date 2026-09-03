/**
 * Petit relais HTTP entre l'application et l'API Graph de Facebook.
 *
 * Il n'existe que pour garder le jeton d'accès hors du navigateur : aucune
 * donnée n'est stockée ici, la liste des participants reste dans le
 * localStorage du client.
 *
 * Démarrage :  npm run server     (ou npm run dev:full pour Vite + serveur)
 * Configuration : copier .env.example en .env et y placer le jeton.
 */

import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { parsePostUrl, fetchComments, extraireAuteurs, FacebookError } from './facebook.js'

const racine = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Lecture minimale du .env : évite une dépendance pour trois lignes. */
function chargerEnv() {
  try {
    const contenu = readFileSync(join(racine, '.env'), 'utf8')
    for (const ligne of contenu.split(/\r?\n/)) {
      const m = ligne.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      const valeur = m[2].replace(/^["']|["']$/g, '')
      if (process.env[m[1]] === undefined) process.env[m[1]] = valeur
    }
  } catch {
    // Pas de .env : le jeton peut venir de l'environnement du shell.
  }
}

chargerEnv()

const PORT = Number(process.env.PORT || 5174)
const TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || ''

/** Seules ces origines peuvent appeler le relais (le serveur Vite en dev). */
const ORIGINES = (process.env.ALLOWED_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',').map(o => o.trim()).filter(Boolean)

function json(res, status, corps) {
  const donnees = JSON.stringify(corps)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(donnees),
    'Cache-Control': 'no-store',
  })
  res.end(donnees)
}

function appliquerCors(req, res) {
  const origine = req.headers.origin
  if (origine && ORIGINES.includes(origine)) {
    res.setHeader('Access-Control-Allow-Origin', origine)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

async function traiterCommentaires(url) {
  if (!TOKEN) {
    throw new FacebookError(
      "Le serveur n'a pas de jeton d'accès Facebook. Renseignez FB_PAGE_ACCESS_TOKEN dans le fichier .env, puis redémarrez le serveur.",
      503,
    )
  }

  const lien = url.searchParams.get('url') || url.searchParams.get('postId')
  const motCle = url.searchParams.get('motCle') || ''
  const inclureReponses = url.searchParams.get('reponses') !== '0'

  const { postId } = parsePostUrl(lien)
  const { commentaires, tronque } = await fetchComments(postId, TOKEN, { inclureReponses })
  const { auteurs, stats } = extraireAuteurs(commentaires, { motCle })

  return { postId, auteurs, stats, tronque }
}

const serveur = createServer(async (req, res) => {
  appliquerCors(req, res)

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
  if (req.method !== 'GET') return json(res, 405, { error: 'Méthode non autorisée' })

  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (url.pathname === '/api/facebook/status') {
    return json(res, 200, { tokenConfigure: Boolean(TOKEN) })
  }

  if (url.pathname === '/api/facebook/comments') {
    try {
      return json(res, 200, await traiterCommentaires(url))
    } catch (err) {
      if (err instanceof FacebookError) {
        return json(res, err.status, { error: err.message, details: err.details })
      }
      console.error('[facebook]', err)
      return json(res, 500, { error: 'Erreur interne du serveur' })
    }
  }

  return json(res, 404, { error: 'Route inconnue' })
})

serveur.listen(PORT, () => {
  console.log(`[serveur] relais Facebook sur http://localhost:${PORT}`)
  if (!TOKEN) {
    console.warn("[serveur] FB_PAGE_ACCESS_TOKEN absent — l'import Facebook répondra une erreur explicite.")
  }
})
