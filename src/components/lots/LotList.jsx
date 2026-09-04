import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import LotForm from './LotForm'
import ConfirmDialog from '../ui/ConfirmDialog'
import { IconPlus, IconEdit, IconTrash, IconImage, IconGift } from '../ui/Icons'
import { plural } from '../../utils/format'
import { formatMontant, valeurTotale } from '../../utils/devise'
import { labelRang } from '../../constants'

export default function LotList() {
  const { lots, ajouterLot, modifierLot, supprimerLot } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Les lots s'affichent dans l'ordre de leur prix (1er prix en tête), les
  // lots sans rang explicite (anciennes fiches) restant en fin de liste.
  const lotsTries = [...lots].sort((a, b) => (a.rang ?? Infinity) - (b.rang ?? Infinity))

  const totalPlaces = lots.reduce((acc, l) => acc + (parseInt(l.quantite, 10) || 0), 0)
  const totalEUR = valeurTotale(lots, 'EUR')
  const totalMGA = valeurTotale(lots, 'MGA')

  function handleSubmit(data) {
    if (editing) modifierLot(editing.id, data)
    else ajouterLot(data)
    setEditing(null)
    setShowForm(false)
  }

  return (
    <section>
      <div className="section-head">
        <div>
          <h2 style={{ margin: '0 0 2px' }}>Lots</h2>
          <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            {plural(lots.length, 'lot')} — {plural(totalPlaces, 'gagnant')} {totalPlaces > 1 ? 'potentiels' : 'potentiel'}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <IconPlus size={15} />
          Ajouter
        </button>
      </div>

      {lots.length > 0 && (
        <div className="stat-grid">
          <div>
            <div className="kicker kicker-accent">Gagnants potentiels</div>
            <div className="stat-value">{totalPlaces}</div>
          </div>
          <div>
            <div className="kicker">Valeur totale</div>
            {totalEUR > 0 ? (
              <>
                <div className="stat-value">{formatMontant(totalEUR, 'EUR')}</div>
                <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)', marginTop: 2 }}>
                  soit {formatMontant(totalMGA, 'MGA')}
                </div>
              </>
            ) : (
              <div className="stat-value">—</div>
            )}
          </div>
        </div>
      )}

      {lotsTries.map(lot => (
        <div className="row" key={lot.id} style={{ gap: 18, padding: '16px 0' }}>
          <div style={{ width: 74, height: 74, flex: 'none', background: 'var(--color-neutral-200)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
            {lot.image
              ? <div style={{ width: 74, height: 74, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url("${lot.image}")` }} />
              : <IconImage size={22} stroke="var(--color-neutral-500)" />}
          </div>

          <div style={{ minWidth: 0 }}>
            <div className="kicker kicker-accent" style={{ marginBottom: 2 }}>
              {lot.rang ? labelRang(lot.rang) : 'Non classé'}
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, overflowWrap: 'anywhere' }}>{lot.nom}</div>
            {lot.description && (
              <div style={{ fontSize: 13, overflowWrap: 'anywhere', color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{lot.description}</div>
            )}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="tag tag-neutral">×{lot.quantite}</span>
            {parseFloat(lot.valeur) > 0 && (
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15, whiteSpace: 'nowrap' }}>
                {formatMontant(parseFloat(lot.valeur), lot.devise)}
              </span>
            )}
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-icon btn-secondary" onClick={() => setEditing(lot)} title="Modifier">
                <IconEdit size={15} />
              </button>
              <button className="btn btn-icon btn-secondary" onClick={() => setConfirmDelete(lot)} title="Supprimer">
                <IconTrash size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {lots.length === 0 && (
        <div style={{ padding: '64px 0 24px', maxWidth: 420 }}>
          <IconGift size={34} stroke="var(--color-accent)" width={1.8} />
          <h3 style={{ margin: '16px 0 6px' }}>Aucun lot</h3>
          <p style={{ fontSize: 14, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            Décrivez les prix à gagner : nom, photo, quantité et valeur.
            La quantité définit le nombre de gagnants pour ce lot.
          </p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>Ajouter un lot</button>
        </div>
      )}

      {(showForm || editing) && (
        <LotForm
          lot={editing}
          lots={lots}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Supprimer ce lot ?"
          body={<><strong>{confirmDelete.nom}</strong> sera définitivement retiré des lots.</>}
          onConfirm={() => { supprimerLot(confirmDelete.id); setConfirmDelete(null) }}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </section>
  )
}
