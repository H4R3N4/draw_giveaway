import { useState, useEffect } from 'react'

export default function ParticipantForm({ participant, onSubmit, onClose }) {
  const [form, setForm] = useState({ nom: '', email: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (participant) {
      // Compatibilité ancienne data avec prenom+nom séparés
      const nomAffiche = participant.nom
        ? (participant.prenom ? `${participant.prenom} ${participant.nom}` : participant.nom)
        : ''
      setForm({ nom: nomAffiche, email: participant.email || '' })
    }
  }, [participant])

  function validate() {
    const errs = {}
    if (!form.nom.trim()) errs.nom = 'Le nom est requis'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({ nom: form.nom.trim(), email: form.email.trim() })
  }

  const initiales = form.nom.trim()
    ? form.nom.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ boxShadow: '0 25px 60px rgba(0,0,0,.15)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5">
          <h2 className="text-lg font-bold text-slate-900">
            {participant ? 'Modifier le participant' : 'Ajouter un participant'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Avatar preview */}
        <div className="flex justify-center pb-5">
          <div className="w-16 h-16 rounded-full bg-violet-100 border-4 border-white shadow-md flex items-center justify-center text-violet-600 font-bold text-xl" style={{ boxShadow: '0 4px 14px rgba(124,58,237,.2)' }}>
            {initiales}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Nom complet */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Nom complet *
            </label>
            <input
              type="text"
              autoFocus
              value={form.nom}
              onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              placeholder="ex: Marie Dupont"
            />
            {errors.nom && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              {errors.nom}
            </p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Email <span className="normal-case font-normal text-slate-400">(optionnel)</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              placeholder="ex: marie@example.com"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
              style={{ boxShadow: '0 4px 12px rgba(124,58,237,.3)' }}
            >
              {participant ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
