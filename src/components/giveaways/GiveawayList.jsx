import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import GiveawayForm from './GiveawayForm'
import ConfirmDialog from '../ui/ConfirmDialog'
import { IconPlus, IconEdit, IconTrash, IconGift, IconArrowRight } from '../ui/Icons'
import { formatDate, plural } from '../../utils/format'

export default function GiveawayList({ onOpen }) {
  const { giveaways, donneesParGiveaway, creerGiveaway, renommerGiveaway, supprimerGiveaway } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  function handleSubmit(nom) {
    if (editing) renommerGiveaway(editing.id, nom)
    else {
      const nouveau = creerGiveaway(nom)
      onOpen(nouveau.id)
    }
    setEditing(null)
    setShowForm(false)
  }

  return (
    <section>
      <div className="section-head">
        <div>
          <h2 style={{ margin: '0 0 2px' }}>Giveaways</h2>
          <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            {plural(giveaways.length, 'giveaway', 'giveaways')}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <IconPlus size={15} />
          Nouveau giveaway
        </button>
      </div>

      {giveaways.map(giveaway => {
        const donnees = donneesParGiveaway[giveaway.id] || { participants: [], lots: [], historique: [] }
        return (
          <div
            className="row" key={giveaway.id}
            onClick={() => onOpen(giveaway.id)}
            style={{ gap: 18, padding: '16px 0', cursor: 'pointer' }}
          >
            <div style={{ width: 44, height: 44, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--color-accent)' }}>
              <IconGift size={18} stroke="var(--color-on-accent)" />
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, overflowWrap: 'anywhere' }}>{giveaway.nom}</div>
              <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
                {plural(donnees.participants.length, 'participant')} · {plural(donnees.lots.length, 'lot')} · {plural(donnees.historique.length, 'tirage')}
                {giveaway.dateCreation && ` · créé le ${formatDate(giveaway.dateCreation)}`}
              </div>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-icon btn-secondary" onClick={() => setEditing(giveaway)} title="Renommer">
                  <IconEdit size={15} />
                </button>
                <button className="btn btn-icon btn-secondary" onClick={() => setConfirmDelete(giveaway)} title="Supprimer">
                  <IconTrash size={15} />
                </button>
              </div>
              <button className="btn btn-secondary" onClick={() => onOpen(giveaway.id)}>
                Ouvrir
                <IconArrowRight size={13} />
              </button>
            </div>
          </div>
        )
      })}

      {giveaways.length === 0 && (
        <div style={{ padding: '64px 0 24px', maxWidth: 420 }}>
          <IconGift size={34} stroke="var(--color-accent)" width={1.8} />
          <h3 style={{ margin: '16px 0 6px' }}>Aucun giveaway</h3>
          <p style={{ fontSize: 14, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            Créez un giveaway pour commencer : chacun a ses propres participants, lots et tirages.
          </p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>Créer un giveaway</button>
        </div>
      )}

      {(showForm || editing) && (
        <GiveawayForm
          giveaway={editing}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Supprimer ce giveaway ?"
          body={<>
            <strong>{confirmDelete.nom}</strong> sera définitivement supprimé, avec
            {' '}{plural((donneesParGiveaway[confirmDelete.id]?.participants || []).length, 'participant')},
            {' '}{plural((donneesParGiveaway[confirmDelete.id]?.lots || []).length, 'lot')} et
            {' '}{plural((donneesParGiveaway[confirmDelete.id]?.historique || []).length, 'tirage')} associés.
          </>}
          onConfirm={() => { supprimerGiveaway(confirmDelete.id); setConfirmDelete(null) }}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </section>
  )
}
