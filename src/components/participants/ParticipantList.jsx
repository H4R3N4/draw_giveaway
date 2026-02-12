import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import ParticipantForm from './ParticipantForm'

export default function ParticipantList() {
  const { participants, ajouterParticipant, modifierParticipant, supprimerParticipant } = useApp()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = participants.filter(p =>
    `${p.prenom} ${p.nom} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  )

  function handleSubmit(data) {
    if (editing) {
      modifierParticipant(editing.id, data)
      setEditing(null)
    } else {
      ajouterParticipant(data)
      setShowForm(false)
    }
  }

  function handleDelete(id) {
    supprimerParticipant(id)
    setConfirmDelete(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Participants</h2>
          <p className="text-slate-500 text-sm mt-1">{participants.length} participant{participants.length !== 1 ? 's' : ''} enregistré{participants.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          <span className="text-lg leading-none">+</span> Ajouter
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un participant..."
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">👥</div>
          <p className="text-lg font-medium">
            {search ? 'Aucun résultat' : 'Aucun participant'}
          </p>
          <p className="text-sm mt-1">
            {search ? 'Essayez un autre terme de recherche.' : 'Ajoutez votre premier participant !'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                  {p.prenom[0]}{p.nom[0]}
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">{p.prenom} {p.nom}</p>
                  {p.email && <p className="text-slate-400 text-xs">{p.email}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(p)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm">
                  ✏️
                </button>
                <button
                  onClick={() => setConfirmDelete(p.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editing) && (
        <ParticipantForm
          participant={editing}
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
              <button onClick={() => handleDelete(confirmDelete)}
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
