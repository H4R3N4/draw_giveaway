import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import ParticipantForm from './ParticipantForm'

function getInitiales(nom) {
  if (!nom) return '?'
  return nom.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const AVATAR_COLORS = [
  ['#ede9fe', '#7c3aed'], ['#dbeafe', '#2563eb'], ['#dcfce7', '#16a34a'],
  ['#fef3c7', '#d97706'], ['#fce7f3', '#db2777'], ['#e0f2fe', '#0284c7'],
]

function avatarColor(id) {
  const hash = id ? id.charCodeAt(0) % AVATAR_COLORS.length : 0
  return AVATAR_COLORS[hash]
}

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
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

export default function ParticipantList() {
  const { participants, ajouterParticipant, modifierParticipant, supprimerParticipant } = useApp()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = participants.filter(p =>
    `${p.nom} ${p.email || ''}`.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Participants</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {participants.length} participant{participants.length !== 1 ? 's' : ''} enregistré{participants.length !== 1 ? 's' : ''}
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

      {/* Stats */}
      {participants.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4 border border-slate-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Total</p>
            <p className="text-3xl font-extrabold text-slate-900">{participants.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">participant{participants.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Avec email</p>
            <p className="text-3xl font-extrabold text-slate-900">
              {participants.filter(p => p.email).length}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">contact{participants.filter(p => p.email).length !== 1 ? 's' : ''} renseigné{participants.filter(p => p.email).length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="relative mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <IconSearch />
        </span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un participant..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-700">
            {search ? 'Aucun résultat' : 'Aucun participant'}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {search ? `Aucun résultat pour "${search}"` : 'Ajoutez votre premier participant pour commencer'}
          </p>
          {!search && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
            >
              Ajouter un participant
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(p => {
            const [bg, fg] = avatarColor(p.id)
            const initiales = getInitiales(p.nom)
            return (
              <div
                key={p.id}
                className="bg-white border border-slate-100 rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:border-violet-200 hover:shadow-md transition-all group"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ backgroundColor: bg, color: fg }}
                >
                  {initiales}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{p.nom}</p>
                  {p.email
                    ? <p className="text-slate-400 text-xs truncate mt-0.5">{p.email}</p>
                    : <p className="text-slate-300 text-xs mt-0.5">Pas d'email</p>
                  }
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditing(p)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                    title="Modifier"
                  >
                    <IconEdit />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(p)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal formulaire */}
      {(showForm || editing) && (
        <ParticipantForm
          participant={editing}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" style={{ boxShadow: '0 25px 60px rgba(0,0,0,.15)' }}>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <IconTrash />
            </div>
            <h3 className="font-bold text-slate-900 text-center mb-1">Supprimer ce participant ?</h3>
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
                onClick={() => { supprimerParticipant(confirmDelete.id); setConfirmDelete(null) }}
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
