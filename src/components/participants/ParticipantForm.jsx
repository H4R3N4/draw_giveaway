import { useState, useEffect } from 'react'
import { getInitiales } from '../../utils/format'

export default function ParticipantForm({ participant, onSubmit, onClose }) {
  // La modale est montée à neuf à chaque ouverture : l'état initial suffit.
  const [form, setForm] = useState(() => {
    // Compatibilité avec les anciennes données (prénom + nom séparés).
    const nomAffiche = participant?.nom
      ? (participant.prenom ? `${participant.prenom} ${participant.nom}` : participant.nom)
      : ''
    return { nom: nomAffiche, email: participant?.email || '' }
  })
  const [erreur, setErreur] = useState(false)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nom.trim()) { setErreur(true); return }
    onSubmit({ nom: form.nom.trim(), email: form.email.trim() })
  }

  return (
    <div className="dialog-backdrop" style={{ zIndex: 40 }} onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form className="dialog" onSubmit={handleSubmit} role="dialog" aria-modal="true">
        <div className="dialog-title">
          {participant ? 'Modifier le participant' : 'Ajouter un participant'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderTop: '2px solid var(--color-divider)', borderBottom: '2px solid var(--color-divider)' }}>
          <div style={{ width: 52, height: 52, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--color-text)', color: 'var(--color-bg)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 17 }}>
            {getInitiales(form.nom)}
          </div>
          <div style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            Les initiales sont générées automatiquement à partir du nom saisi.
          </div>
        </div>

        <div className="field">
          <label htmlFor="p-nom">Nom complet *</label>
          <input
            id="p-nom" className="input" type="text" autoFocus
            value={form.nom}
            onChange={e => { setForm(f => ({ ...f, nom: e.target.value })); setErreur(false) }}
            placeholder="Ex. Camille Rousseau"
          />
          {erreur && (
            <div style={{ fontSize: 12, color: 'var(--color-accent-700)', marginTop: 5 }}>Le nom est requis</div>
          )}
        </div>

        <div className="field">
          <label htmlFor="p-email">Email (facultatif)</label>
          <input
            id="p-email" className="input" type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="camille@exemple.fr"
          />
        </div>

        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary">
            {participant ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  )
}
