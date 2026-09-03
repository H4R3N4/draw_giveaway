import { useState, useEffect } from 'react'
import { getCommentaires, getStatutFacebook } from '../../services/facebook'
import { getInitiales, avatarColor, plural } from '../../utils/format'
import { IconCheck } from '../ui/Icons'

/**
 * Import des participants depuis les commentaires d'une publication Facebook.
 *
 * L'utilisateur colle le lien de la publication ; le relais serveur interroge
 * l'API Graph et renvoie les auteurs distincts, qu'on présente cochés pour
 * validation avant l'ajout. Les personnes déjà enregistrées sont signalées et
 * décochées afin de ne pas créer de doublon.
 */
export default function FacebookImport({ participants, onImport, onClose }) {
  const [lien, setLien] = useState('')
  const [motCle, setMotCle] = useState('')
  const [inclureReponses, setInclureReponses] = useState(true)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')
  const [resultat, setResultat] = useState(null)
  const [selection, setSelection] = useState(() => new Set())
  const [sansJeton, setSansJeton] = useState(false)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prévenir tout de suite si le serveur n'a pas de jeton : l'utilisateur voit
  // l'avertissement avant de perdre du temps à coller un lien.
  useEffect(() => {
    let annule = false
    getStatutFacebook()
      .then(s => { if (!annule) setSansJeton(!s.tokenConfigure) })
      .catch(() => { if (!annule) setSansJeton(true) })
    return () => { annule = true }
  }, [])

  /** Un participant déjà présent, repéré par son identifiant Facebook ou son nom. */
  function dejaPresent(auteur) {
    const nom = auteur.nom.trim().toLowerCase()
    return participants.some(p =>
      (p.facebookId && p.facebookId === auteur.facebookId) ||
      (p.nom || '').trim().toLowerCase() === nom
    )
  }

  async function rechercher(e) {
    e.preventDefault()
    if (!lien.trim()) { setErreur('Collez le lien de la publication Facebook.'); return }

    setChargement(true)
    setErreur('')
    setResultat(null)
    try {
      const data = await getCommentaires({ url: lien.trim(), motCle, inclureReponses })
      setResultat(data)
      // Par défaut on coche les nouveaux venus seulement.
      setSelection(new Set(data.auteurs.filter(a => !dejaPresent(a)).map(a => a.facebookId)))
    } catch (err) {
      setErreur(err.message)
    } finally {
      setChargement(false)
    }
  }

  function basculer(id) {
    setSelection(prev => {
      const suivant = new Set(prev)
      if (suivant.has(id)) suivant.delete(id)
      else suivant.add(id)
      return suivant
    })
  }

  const auteurs = resultat?.auteurs || []
  const nouveaux = auteurs.filter(a => !dejaPresent(a))

  function toutBasculer() {
    setSelection(prev =>
      prev.size === auteurs.length ? new Set() : new Set(auteurs.map(a => a.facebookId))
    )
  }

  function valider() {
    const choisis = auteurs.filter(a => selection.has(a.facebookId))
    if (!choisis.length) return
    onImport(choisis.map(a => ({
      nom: a.nom,
      email: '',
      facebookId: a.facebookId,
      source: 'facebook',
      sourceUrl: lien.trim(),
      sourcePostId: resultat.postId,
      nbCommentaires: a.nbCommentaires,
    })))
  }

  const styleAide = { fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }

  return (
    <div
      className="dialog-backdrop" style={{ zIndex: 40, overflow: 'auto' }}
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <form
        className="dialog" onSubmit={rechercher} role="dialog" aria-modal="true"
        style={{ width: 'min(620px, 100%)', margin: 'auto' }}
      >
        <div className="dialog-title">Importer depuis une publication Facebook</div>

        {sansJeton && (
          <div style={{ padding: 12, background: 'color-mix(in srgb, var(--color-gold) 22%, transparent)', borderLeft: '3px solid var(--color-gold-dark)', fontSize: 13 }}>
            <strong>Serveur d'import non configuré.</strong> Renseignez un jeton de Page
            Facebook dans le fichier <code>.env</code> (voir <code>.env.example</code>),
            puis lancez <code>npm run server</code>.
          </div>
        )}

        <div className="field">
          <label htmlFor="fb-lien">Lien de la publication *</label>
          <input
            id="fb-lien" className="input" type="text" autoFocus
            value={lien}
            onChange={e => { setLien(e.target.value); setErreur('') }}
            placeholder="https://www.facebook.com/MaPage/posts/123456789"
          />
          <div style={{ ...styleAide, marginTop: 5 }}>
            La publication doit appartenir à une Page dont vous êtes administrateur.
            Copiez l'URL depuis la barre d'adresse : les liens courts /share/ ne
            contiennent pas l'identifiant de la publication.
          </div>
        </div>

        <div className="field">
          <label htmlFor="fb-motcle">Mot-clé exigé dans le commentaire (facultatif)</label>
          <input
            id="fb-motcle" className="input" type="text"
            value={motCle}
            onChange={e => setMotCle(e.target.value)}
            placeholder="Ex. je participe"
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
          <input
            type="checkbox" checked={inclureReponses}
            onChange={e => setInclureReponses(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--color-accent)' }}
          />
          Inclure les réponses aux commentaires
        </label>

        {erreur && (
          <div style={{ fontSize: 13, color: 'var(--color-accent-700)', borderLeft: '3px solid var(--color-accent-700)', paddingLeft: 10 }}>
            {erreur}
          </div>
        )}

        {resultat && (
          <div style={{ borderTop: '2px solid var(--color-divider)', paddingTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15 }}>
                {plural(auteurs.length, 'auteur')} {auteurs.length > 1 ? 'distincts' : 'distinct'}
              </div>
              <div style={styleAide}>
                {plural(resultat.stats.commentaires, 'commentaire')} analysé{resultat.stats.commentaires > 1 ? 's' : ''}
                {resultat.stats.horsFiltre > 0 && ` · ${resultat.stats.horsFiltre} hors mot-clé`}
                {resultat.stats.anonymes > 0 && ` · ${resultat.stats.anonymes} auteur(s) masqué(s)`}
                {nouveaux.length !== auteurs.length && ` · ${auteurs.length - nouveaux.length} déjà dans la liste`}
              </div>
            </div>

            {resultat.tronque && (
              <div style={{ ...styleAide, marginTop: 6 }}>
                Publication très commentée : seuls les premiers commentaires ont été récupérés.
              </div>
            )}

            {auteurs.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <button type="button" className="btn btn-ghost" onClick={toutBasculer}>
                  {selection.size === auteurs.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                </button>
                <span style={styleAide}>{selection.size} sélectionné{selection.size > 1 ? 's' : ''}</span>
              </div>
            )}

            <div style={{ maxHeight: 260, overflow: 'auto' }}>
              {auteurs.map(a => {
                const present = dejaPresent(a)
                const coche = selection.has(a.facebookId)
                return (
                  <label
                    key={a.facebookId} className="row"
                    style={{ cursor: 'pointer', opacity: present && !coche ? 0.55 : 1 }}
                  >
                    <input
                      type="checkbox" checked={coche}
                      onChange={() => basculer(a.facebookId)}
                      style={{ width: 16, height: 16, flex: 'none', accentColor: 'var(--color-accent)' }}
                    />
                    <div style={{ width: 34, height: 34, flex: 'none', display: 'grid', placeItems: 'center', background: avatarColor(a.facebookId), color: 'var(--color-bg)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 12 }}>
                      {getInitiales(a.nom)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14, overflowWrap: 'anywhere' }}>
                        {a.nom}
                      </div>
                      <div style={{ ...styleAide, overflowWrap: 'anywhere' }}>
                        {present
                          ? 'Déjà dans la liste'
                          : a.nbCommentaires > 1
                            ? plural(a.nbCommentaires, 'commentaire')
                            : (a.message ? a.message.slice(0, 70) : 'Commentaire sans texte')}
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>

            {auteurs.length === 0 && (
              <div style={{ padding: '28px 0', fontSize: 14, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
                Aucun auteur retenu{motCle ? ` avec le mot-clé « ${motCle} »` : ''}.
              </div>
            )}
          </div>
        )}

        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-secondary" disabled={chargement}>
            {chargement ? 'Analyse…' : (resultat ? 'Relancer l’analyse' : 'Analyser les commentaires')}
          </button>
          {resultat && (
            <button type="button" className="btn btn-primary" onClick={valider} disabled={selection.size === 0}>
              <IconCheck size={14} />
              Ajouter ({selection.size})
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
