import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import ParticipantForm from './ParticipantForm'
import ConfirmDialog from '../ui/ConfirmDialog'
import { IconPlus, IconSearch, IconClose, IconEdit, IconTrash, IconUsers } from '../ui/Icons'
import { getInitiales, avatarColor, plural } from '../../utils/format'

export default function ParticipantList() {
  const { participants, ajouterParticipant, modifierParticipant, supprimerParticipant, reinitialiserParticipants } = useApp()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const filtered = participants.filter(p =>
    `${p.nom} ${p.email || ''}`.toLowerCase().includes(search.toLowerCase())
  )
  const avecEmail = participants.filter(p => p.email).length

  function handleSubmit(data) {
    if (editing) modifierParticipant(editing.id, data)
    else ajouterParticipant(data)
    setEditing(null)
    setShowForm(false)
  }

  return (
    <section>
      <div className="section-head">
        <div>
          <h2 style={{ margin: '0 0 2px' }}>Participants</h2>
          <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            {plural(participants.length, 'participant')} {participants.length > 1 ? 'enregistrés' : 'enregistré'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {participants.length > 0 && (
            <button className="btn btn-secondary" onClick={() => setConfirmReset(true)}>Réinitialiser</button>
          )}
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <IconPlus size={15} />
            Ajouter
          </button>
        </div>
      </div>

      {participants.length > 0 && (
        <div className="stat-grid">
          <div>
            <div className="kicker kicker-accent">Total</div>
            <div className="stat-value">{participants.length}</div>
          </div>
          <div>
            <div className="kicker">Avec email</div>
            <div className="stat-value">{avecEmail}</div>
          </div>
        </div>
      )}

      {participants.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0', borderBottom: '1px solid var(--color-divider)' }}>
          <span style={{ opacity: 0.5, flex: 'none', display: 'flex' }}><IconSearch /></span>
          <input
            className="input" type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un nom ou un email"
            style={{ border: 0, background: 'transparent', padding: 0, minHeight: 26, fontSize: 15 }}
          />
          {search && (
            <button className="btn btn-ghost" onClick={() => setSearch('')} style={{ flex: 'none' }} title="Effacer">
              <IconClose size={15} />
            </button>
          )}
        </div>
      )}

      {filtered.map(p => (
        <div className="row" key={p.id}>
          <div style={{ width: 42, height: 42, flex: 'none', display: 'grid', placeItems: 'center', background: avatarColor(p.id), color: 'var(--color-bg)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14, letterSpacing: '0.04em' }}>
            {getInitiales(p.nom)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="row-name" style={{ overflowWrap: 'anywhere' }}>{p.nom}</div>
            <div style={{ fontSize: 13, overflowWrap: 'anywhere', color: p.email ? 'color-mix(in srgb, var(--color-text) 55%, transparent)' : 'color-mix(in srgb, var(--color-text) 35%, transparent)' }}>
              {p.email || "Pas d'email"}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            <button className="btn btn-icon btn-secondary" onClick={() => setEditing(p)} title="Modifier">
              <IconEdit size={15} />
            </button>
            <button className="btn btn-icon btn-secondary" onClick={() => setConfirmDelete(p)} title="Supprimer">
              <IconTrash size={15} />
            </button>
          </div>
        </div>
      ))}

      {participants.length > 0 && filtered.length === 0 && (
        <div style={{ padding: '56px 0', fontSize: 14, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
          Aucun résultat pour « {search} »
        </div>
      )}

      {participants.length === 0 && (
        <div style={{ padding: '64px 0 24px', maxWidth: 420 }}>
          <IconUsers size={34} stroke="var(--color-accent)" />
          <h3 style={{ margin: '16px 0 6px' }}>Aucun participant</h3>
          <p style={{ fontSize: 14, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            Constituez d'abord la liste des personnes qui participent au tirage.
            Le nom est obligatoire, l'email facultatif.
          </p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>Ajouter un participant</button>
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
        <ConfirmDialog
          title="Supprimer ce participant ?"
          body={<><strong>{confirmDelete.nom}</strong> sera définitivement retiré de la liste.</>}
          onConfirm={() => { supprimerParticipant(confirmDelete.id); setConfirmDelete(null) }}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </section>
  )
}
