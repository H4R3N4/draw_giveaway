import { useState, useEffect, useRef } from 'react'
import { IconUpload } from '../ui/Icons'
import { DEVISES, DEVISE_PAR_DEFAUT } from '../../constants'

const TAILLE_MAX = 5 * 1024 * 1024

export default function LotForm({ lot, onSubmit, onClose }) {
  // La modale est montée à neuf à chaque ouverture : l'état initial suffit.
  const [form, setForm] = useState(() => ({
    nom: lot?.nom || '',
    description: lot?.description || '',
    quantite: lot?.quantite ?? 1,
    valeur: lot?.valeur || '',
    devise: lot?.devise || DEVISE_PAR_DEFAUT,
    image: lot?.image || '',
  }))
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > TAILLE_MAX) {
      setErrors(errs => ({ ...errs, image: 'Image trop lourde — 5 Mo maximum' }))
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = ev => {
      setForm(f => ({ ...f, image: ev.target.result }))
      setErrors(errs => ({ ...errs, image: undefined }))
    }
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setForm(f => ({ ...f, image: '' }))
    if (fileRef.current) fileRef.current.value = ''
  }

  function setQuantite(n) {
    setForm(f => ({ ...f, quantite: Math.max(1, n) }))
    setErrors(errs => ({ ...errs, quantite: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.nom.trim()) errs.nom = 'Le nom du lot est requis'
    const q = parseInt(form.quantite, 10)
    if (!q || q < 1) errs.quantite = 'Minimum 1'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({ ...form, nom: form.nom.trim(), description: form.description.trim(), quantite: q })
  }

  return (
    <div className="dialog-backdrop" style={{ zIndex: 40, overflow: 'auto' }} onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form className="dialog" onSubmit={handleSubmit} role="dialog" aria-modal="true" style={{ width: 'min(520px, 100%)', margin: 'auto' }}>
        <div className="dialog-title">{lot ? 'Modifier le lot' : 'Ajouter un lot'}</div>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

        {form.image ? (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 130, height: 130, flex: 'none', background: 'var(--color-neutral-200)', overflow: 'hidden' }}>
              <div style={{ width: 130, height: 130, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url("${form.image}")` }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
              <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()}>Changer l'image</button>
              <button type="button" className="btn btn-ghost" onClick={removeImage}>Supprimer l'image</button>
            </div>
          </div>
        ) : (
          <button
            type="button" onClick={() => fileRef.current?.click()}
            style={{ appearance: 'none', cursor: 'pointer', width: '100%', padding: 26, background: 'transparent', border: '2px dashed var(--color-divider)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, font: 'inherit', color: 'inherit' }}
          >
            <IconUpload size={22} stroke="var(--color-accent)" />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14 }}>Importer une photo du lot</span>
            <span style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>PNG, JPG, WEBP — max 5 Mo</span>
          </button>
        )}
        {errors.image && <div style={{ fontSize: 12, color: 'var(--color-accent-700)' }}>{errors.image}</div>}

        <div className="field">
          <label htmlFor="l-nom">Nom du lot *</label>
          <input
            id="l-nom" className="input" type="text" autoFocus
            value={form.nom}
            onChange={e => { setForm(f => ({ ...f, nom: e.target.value })); setErrors(errs => ({ ...errs, nom: undefined })) }}
            placeholder="Ex. Casque audio"
          />
          {errors.nom && <div style={{ fontSize: 12, color: 'var(--color-accent-700)', marginTop: 5 }}>{errors.nom}</div>}
        </div>

        <div className="field">
          <label htmlFor="l-desc">Description (facultatif)</label>
          <input
            id="l-desc" className="input" type="text"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Ex. Sans fil, réduction de bruit"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label htmlFor="l-qty">Quantité *</label>
            <div style={{ display: 'flex' }}>
              <button type="button" className="btn btn-secondary btn-icon" onClick={() => setQuantite(parseInt(form.quantite, 10) - 1)} aria-label="Diminuer">−</button>
              <input
                id="l-qty" className="input" type="number" min="1"
                value={form.quantite}
                onChange={e => setForm(f => ({ ...f, quantite: e.target.value }))}
                style={{ textAlign: 'center', borderLeft: 0, borderRight: 0 }}
              />
              <button type="button" className="btn btn-secondary btn-icon" onClick={() => setQuantite(parseInt(form.quantite, 10) + 1)} aria-label="Augmenter">+</button>
            </div>
            {errors.quantite && <div style={{ fontSize: 12, color: 'var(--color-accent-700)', marginTop: 5 }}>{errors.quantite}</div>}
          </div>

          <div className="field">
            <label htmlFor="l-valeur">Valeur (facultatif)</label>
            <div style={{ display: 'flex' }}>
              <input
                id="l-valeur" className="input" type="number" min="0" step="0.01"
                value={form.valeur}
                onChange={e => setForm(f => ({ ...f, valeur: e.target.value }))}
                placeholder="0"
                style={{ borderRight: 0 }}
              />
              <select
                className="input" aria-label="Devise"
                value={form.devise}
                onChange={e => setForm(f => ({ ...f, devise: e.target.value }))}
                style={{ flex: 'none', width: 84 }}
              >
                {Object.values(DEVISES).map(d => (
                  <option key={d.code} value={d.code}>{d.symbole}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary">{lot ? 'Enregistrer' : 'Ajouter'}</button>
        </div>
      </form>
    </div>
  )
}
