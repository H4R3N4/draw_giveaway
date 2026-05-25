import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import LotForm from './LotForm'

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const IconImage = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
)

const RANK_LABELS = ['1er prix', '2ème prix', '3ème prix', '4ème prix', '5ème prix']

export default function LotList() {
  const { lots, ajouterLot, modifierLot, supprimerLot } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const totalGagnants = lots.reduce((acc, l) => acc + (parseInt(l.quantite, 10) || 0), 0)
  const valeurTotale = lots.reduce((acc, l) => acc + ((parseFloat(l.valeur) || 0) * (parseInt(l.quantite, 10) || 1)), 0)

  function handleSubmit(data) {
    if (editing) {
      modifierLot(editing.id, data)
      setEditing(null)
    } else {
      ajouterLot(data)
      setShowForm(false)
    }
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lots</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {lots.length} lot{lots.length !== 1 ? 's' : ''} — {totalGagnants} gagnant{totalGagnants !== 1 ? 's' : ''} potentiel{totalGagnants !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 active:scale-95 transition-all"
          style={{ boxShadow: '0 4px 12px rgba(124,58,237,.35)' }}
        >
          <IconPlus />
          Ajouter
        </button>
      </div>

      {/* Résumé stats */}
      {lots.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4 border border-slate-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Gagnants potentiels</p>
            <p className="text-3xl font-extrabold text-slate-900">{totalGagnants}</p>
            <p className="text-xs text-slate-500 mt-0.5">places à attribuer</p>
          </div>
          {valeurTotale > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-slate-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Valeur totale</p>
              <p className="text-3xl font-extrabold text-slate-900">{valeurTotale.toFixed(0)}</p>
              <p className="text-xs text-slate-500 mt-0.5">euros estimés</p>
            </div>
          )}
        </div>
      )}

      {/* Liste vide */}
      {lots.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
              <line x1="12" y1="22" x2="12" y2="7"/>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-700">Aucun lot</p>
          <p className="text-sm text-slate-400 mt-1">Ajoutez des lots à distribuer lors du tirage</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
          >
            Ajouter un lot
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {lots.map((lot, index) => (
            <div
              key={lot.id}
              className="bg-white border border-slate-100 rounded-2xl flex items-stretch overflow-hidden hover:border-violet-200 hover:shadow-md transition-all group"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}
            >
              {/* Image ou placeholder */}
              <div className="w-20 shrink-0 bg-slate-50 flex items-center justify-center border-r border-slate-100">
                {lot.image ? (
                  <img
                    src={lot.image}
                    alt={lot.nom}
                    className="w-full h-full object-cover"
                    style={{ maxHeight: 80 }}
                  />
                ) : (
                  <IconImage />
                )}
              </div>

              {/* Contenu */}
              <div className="flex-1 px-4 py-3.5 flex items-center gap-3 min-w-0">
                {/* Badge rang */}
                <div className="shrink-0">
                  <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {RANK_LABELS[index] || `${index + 1}ème`}
                  </span>
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{lot.nom}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {lot.description && (
                      <span className="text-slate-400 text-xs truncate">{lot.description}</span>
                    )}
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium shrink-0">
                      x{lot.quantite}
                    </span>
                    {lot.valeur > 0 && (
                      <span className="text-xs text-emerald-600 font-semibold shrink-0">
                        {parseFloat(lot.valeur).toFixed(2)} €
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => setEditing(lot)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                    title="Modifier"
                  >
                    <IconEdit />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(lot)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {(showForm || editing) && (
        <LotForm
          lot={editing}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" style={{ boxShadow: '0 25px 60px rgba(0,0,0,.15)' }}>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <IconTrash />
            </div>
            <h3 className="font-bold text-slate-900 text-center mb-1">Supprimer ce lot ?</h3>
            <p className="text-slate-500 text-sm text-center mb-5">
              <strong className="text-slate-700">{confirmDelete.nom}</strong> sera définitivement supprimé.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => { supprimerLot(confirmDelete.id); setConfirmDelete(null) }}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
