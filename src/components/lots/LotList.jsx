import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import LotForm from './LotForm'

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Lots</h2>
          <p className="text-slate-500 text-sm mt-1">{lots.length} lot{lots.length !== 1 ? 's' : ''} · {totalGagnants} gagnant{totalGagnants !== 1 ? 's' : ''} potentiel{totalGagnants !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          <span className="text-lg leading-none">+</span> Ajouter
        </button>
      </div>

      {valeurTotale > 0 && (
        <div className="mb-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-700">
          Valeur totale estimée : <strong>{valeurTotale.toFixed(2)} €</strong>
        </div>
      )}

      {lots.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">🎁</div>
          <p className="text-lg font-medium">Aucun lot</p>
          <p className="text-sm mt-1">Ajoutez des lots à attribuer lors du tirage !</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lots.map((lot, index) => (
            <div key={lot.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">{lot.nom}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {lot.description && <span className="text-slate-400 text-xs">{lot.description}</span>}
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                      x{lot.quantite}
                    </span>
                    {lot.valeur && (
                      <span className="text-xs text-green-600 font-medium">{parseFloat(lot.valeur).toFixed(2)} €</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(lot)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm">
                  ✏️
                </button>
                <button
                  onClick={() => setConfirmDelete(lot.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editing) && (
        <LotForm
          lot={editing}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-slate-800 mb-2">Confirmer la suppression</h3>
            <p className="text-slate-500 text-sm mb-5">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                Annuler
              </button>
              <button onClick={() => { supprimerLot(confirmDelete); setConfirmDelete(null) }}
                className="flex-1 px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
