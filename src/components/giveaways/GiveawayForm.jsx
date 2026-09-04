import { useState, useEffect } from 'react'

export default function GiveawayForm({ giveaway, onSubmit, onClose }) {
  const [nom, setNom] = useState(giveaway?.nom || '')
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e) {
    e.preventDefault()
    if (!nom.trim()) { setErreur('Le nom du giveaway est requis'); return }
    onSubmit(nom.trim())
  }

  return (
    <div className="dialog-backdrop" style={{ zIndex: 40 }} onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form className="dialog" onSubmit={handleSubmit} role="dialog" aria-modal="true" style={{ width: 'min(440px, 100%)', margin: 'auto' }}>
        <div className="dialog-title">{giveaway ? 'Renommer le giveaway' : 'Nouveau giveaway'}</div>

        <div className="field">
          <label htmlFor="g-nom">Nom *</label>
          <input
            id="g-nom" className="input" type="text" autoFocus
            value={nom}
            onChange={e => { setNom(e.target.value); setErreur('') }}
            placeholder="Ex. Concours de Noël"
          />
          {erreur && <div style={{ fontSize: 12, color: 'var(--color-accent-700)', marginTop: 5 }}>{erreur}</div>}
        </div>

        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary">{giveaway ? 'Enregistrer' : 'Créer'}</button>
        </div>
      </form>
    </div>
  )
}
