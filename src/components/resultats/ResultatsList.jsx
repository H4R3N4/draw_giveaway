import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import ConfirmDialog from '../ui/ConfirmDialog'
import { IconImage, IconTrophy, IconCalendar } from '../ui/Icons'
import { formatDate, plural } from '../../utils/format'
import { formatMontant } from '../../utils/devise'
import { MEDALS } from '../../constants'

export default function ResultatsList({ onGoTirage }) {
  const { historique, effacerHistorique } = useApp()
  const [confirmerEffacer, setConfirmerEffacer] = useState(false)
  const [tousGagnants, setTousGagnants] = useState(false)
  const [deplie, setDeplie] = useState(null)

  if (historique.length === 0) {
    return (
      <section>
        <div className="section-head">
          <div>
            <h2 style={{ margin: '0 0 2px' }}>Résultats</h2>
            <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
              Aucun tirage dans l'historique
            </div>
          </div>
        </div>
        <div style={{ padding: '64px 0 24px', maxWidth: 440 }}>
          <IconTrophy size={34} stroke="var(--color-accent)" />
          <h3 style={{ margin: '16px 0 6px' }}>Aucun tirage effectué</h3>
          <p style={{ fontSize: 14, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            Rendez-vous dans l'onglet Tirage pour lancer votre premier tirage.
            Chaque tirage est archivé ici avec sa date et son palmarès.
          </p>
          <button className="btn btn-primary" onClick={onGoTirage}>Aller au tirage</button>
        </div>
      </section>
    )
  }

  const dernier = historique[0]
  const podium = dernier.gagnants.slice(0, 3)
  const reste = dernier.gagnants.slice(3)
  const anciens = historique.slice(1)

  return (
    <section>
      <div className="section-head">
        <div>
          <h2 style={{ margin: '0 0 2px' }}>Résultats</h2>
          <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            {plural(historique.length, 'tirage')} dans l'historique
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => setConfirmerEffacer(true)}>Effacer tout</button>
      </div>

      {/* — dernier tirage — */}
      <div style={{ padding: '24px 0 8px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div className="kicker kicker-accent" style={{ letterSpacing: '0.14em' }}>Dernier tirage</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 28, marginTop: 4 }}>
            {formatDate(dernier.date)}
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
          {plural(dernier.gagnants.length, 'gagnant')}
        </div>
      </div>

      <div className="podium" style={{ borderTop: '2px solid var(--color-divider)', borderBottom: '2px solid var(--color-divider)', display: 'grid', gridTemplateColumns: `repeat(${podium.length}, 1fr)` }}>
        {podium.map((g, i) => {
          const medaille = MEDALS[i] || MEDALS[2]
          return (
            <div key={i} style={{ padding: i === podium.length - 1 ? '22px 0 22px 20px' : '22px 20px 22px 0', borderRight: i < podium.length - 1 ? '1px solid var(--color-divider)' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 26, height: 26, display: 'grid', placeItems: 'center', background: medaille.bg, color: medaille.fg, fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 12 }}>
                  {i + 1}
                </div>
                <div className="kicker">{medaille.label}</div>
              </div>
              <div style={{ height: 120, marginTop: 14, background: 'var(--color-neutral-200)', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
                {g.lot.image
                  ? <div style={{ width: '100%', height: 120, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url("${g.lot.image}")` }} />
                  : <IconImage size={24} width={1.6} stroke="var(--color-neutral-500)" />}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 19, marginTop: 12, overflowWrap: 'anywhere' }}>
                {g.participant.nom}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 4 }}>
                <div style={{ fontSize: 13, overflowWrap: 'anywhere', color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{g.lot.nom}</div>
                <span className="tag tag-accent">
                  {parseFloat(g.lot.valeur) > 0 ? formatMontant(parseFloat(g.lot.valeur), g.lot.devise) : `×${g.lot.quantite}`}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {reste.length > 0 && (
        <div>
          <button className="btn btn-ghost" onClick={() => setTousGagnants(v => !v)} style={{ margin: '14px 0' }}>
            {tousGagnants
              ? 'Masquer les autres gagnants'
              : reste.length === 1 ? "Voir l'autre gagnant" : `Voir les ${reste.length} autres gagnants`}
          </button>
          {tousGagnants && reste.map((g, i) => (
            <div className="row" key={i} style={{ padding: '12px 0' }}>
              <div style={{ width: 26, fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 45%, transparent)' }}>
                {i + 4}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15, overflowWrap: 'anywhere' }}>{g.participant.nom}</div>
              <span className="tag tag-neutral" style={{ marginLeft: 'auto' }}>{g.lot.nom}</span>
            </div>
          ))}
        </div>
      )}

      {/* — tirages précédents — */}
      {anciens.length > 0 && (
        <div style={{ marginTop: 44 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 20 }}>Tirages précédents</h3>
          {anciens.map(tirage => {
            const ouvert = deplie === tirage.id
            return (
              <div key={tirage.id} style={{ borderTop: '1px solid var(--color-divider)' }}>
                <button
                  onClick={() => setDeplie(ouvert ? null : tirage.id)}
                  aria-expanded={ouvert}
                  style={{ width: '100%', appearance: 'none', background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', textAlign: 'left', font: 'inherit', color: 'inherit' }}
                >
                  <span style={{ opacity: 0.55, flex: 'none', display: 'flex' }}><IconCalendar /></span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15 }}>{formatDate(tirage.date)}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
                    {plural(tirage.gagnants.length, 'gagnant')}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                    {ouvert ? '−' : '+'}
                  </span>
                </button>

                {ouvert && (
                  <div style={{ padding: '0 0 16px' }}>
                    {tirage.gagnants.map((g, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0 10px 30px', borderTop: '1px solid var(--color-divider)' }}>
                        <div style={{ width: 22, fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 45%, transparent)' }}>
                          {i + 1}
                        </div>
                        <div style={{ width: 34, height: 34, flex: 'none', background: 'var(--color-neutral-200)', overflow: 'hidden' }}>
                          {g.lot.image && (
                            <div style={{ width: 34, height: 34, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url("${g.lot.image}")` }} />
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14, overflowWrap: 'anywhere' }}>{g.participant.nom}</div>
                          {g.participant.email && (
                            <div style={{ fontSize: 12, overflowWrap: 'anywhere', color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>{g.participant.email}</div>
                          )}
                        </div>
                        <span className="tag tag-accent" style={{ marginLeft: 'auto' }}>{g.lot.nom}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {confirmerEffacer && (
        <ConfirmDialog
          title="Effacer l'historique ?"
          body="Tous les résultats archivés seront définitivement supprimés."
          cta="Effacer"
          onConfirm={() => { effacerHistorique(); setConfirmerEffacer(false) }}
          onClose={() => setConfirmerEffacer(false)}
        />
      )}
    </section>
  )
}
