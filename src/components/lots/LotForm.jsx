import { useState, useEffect, useRef } from 'react'

const IconUpload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

export default function LotForm({ lot, onSubmit, onClose }) {
  const [form, setForm] = useState({ nom: '', description: '', quantite: 1, valeur: '', image: '' })
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    if (lot) {
      setForm({
        nom: lot.nom,
        description: lot.description || '',
        quantite: lot.quantite,
        valeur: lot.valeur || '',
        image: lot.image || '',
      })
      setImagePreview(lot.image || '')
    }
  }, [lot])

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target.result)
      setForm(f => ({ ...f, image: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setImagePreview('')
    setForm(f => ({ ...f, image: '' }))
    if (fileRef.current) fileRef.current.value = ''
  }

  function validate() {
    const errs = {}
    if (!form.nom.trim()) errs.nom = 'Le nom est requis'
    if (!form.quantite || form.quantite < 1) errs.quantite = 'La quantité doit être ≥ 1'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({ ...form, quantite: parseInt(form.quantite, 10) })
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,.15)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 sticky top-0 bg-white z-10 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {lot ? 'Modifier le lot' : 'Ajouter un lot'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Zone upload image */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Image du lot
            </label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50" style={{ height: 160 }}>
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                  >
                    Supprimer l'image
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded-xl py-8 flex flex-col items-center gap-2 text-slate-400 hover:border-violet-300 hover:text-violet-500 transition-colors bg-slate-50 hover:bg-violet-50"
              >
                <IconUpload />
                <span className="text-sm font-medium">Cliquer pour importer une image</span>
                <span className="text-xs">PNG, JPG, WEBP — max 5 Mo</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-2 text-xs text-violet-600 hover:underline"
              >
                Changer l'image
              </button>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Nom du lot *
            </label>
            <input
              type="text"
              autoFocus
              value={form.nom}
              onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              placeholder="ex: iPhone 15 Pro"
            />
            {errors.nom && <p className="text-red-500 text-xs mt-1.5">{errors.nom}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Description <span className="normal-case font-normal text-slate-400">(optionnelle)</span>
            </label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              placeholder="ex: 128 Go, Titanium Naturel"
            />
          </div>

          {/* Quantité + Valeur */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Quantité *
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, quantite: Math.max(1, parseInt(f.quantite, 10) - 1) }))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-lg transition-colors shrink-0"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={form.quantite}
                  onChange={e => setForm(f => ({ ...f, quantite: e.target.value }))}
                  className="w-full text-center border border-slate-200 rounded-xl px-2 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, quantite: parseInt(f.quantite, 10) + 1 }))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-lg transition-colors shrink-0"
                >
                  +
                </button>
              </div>
              {errors.quantite && <p className="text-red-500 text-xs mt-1.5">{errors.quantite}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Valeur (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.valeur}
                onChange={e => setForm(f => ({ ...f, valeur: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors"
              style={{ boxShadow: '0 4px 12px rgba(124,58,237,.3)' }}
            >
              {lot ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
