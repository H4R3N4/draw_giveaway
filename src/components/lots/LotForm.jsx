import { useState, useEffect } from 'react'

export default function LotForm({ lot, onSubmit, onClose }) {
  const [form, setForm] = useState({ nom: '', description: '', quantite: 1, valeur: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (lot) {
      setForm({ nom: lot.nom, description: lot.description || '', quantite: lot.quantite, valeur: lot.valeur || '' })
    }
  }, [lot])

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {lot ? 'Modifier le lot' : 'Ajouter un lot'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom du lot *</label>
            <input
              type="text"
              value={form.nom}
              onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="ex: iPhone 15 Pro"
            />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="ex: 128GB, Noir"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantité *</label>
              <input
                type="number"
                min="1"
                value={form.quantite}
                onChange={e => setForm(f => ({ ...f, quantite: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.quantite && <p className="text-red-500 text-xs mt-1">{errors.quantite}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valeur (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.valeur}
                onChange={e => setForm(f => ({ ...f, valeur: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              Annuler
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              {lot ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
