import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { effectuerTirage } from '../../utils/tirage'
import { IconArrowRight, IconCheck } from '../ui/Icons'
import { plural } from '../../utils/format'

const ANIMATION_DURATION = 3500
const TICK_START = 60
const TICK_END = 450

export default function TiragePanel({ onTirageComplete }) {
  const { participants, lots, sauvegarderResultat } = useApp()
  const [lotsSelectionnes, setLotsSelectionnes] = useState([])
  const [nomAffiche, setNomAffiche] = useState('')
  const [gagnants, setGagnants] = useState([])
  const [etape, setEtape] = useState('config')
  const timeoutRef = useRef(null)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const peutLancer = participants.length > 0 && lotsSelectionnes.length > 0
  const placesEnJeu = lotsSelectionnes.reduce((acc, id) => {
    const l = lots.find(l => l.id === id)
    return acc + (parseInt(l?.quantite, 10) || 0)
  }, 0)

  function toggleLot(id) {
    setLotsSelectionnes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function toggleTousLots() {
    setLotsSelectionnes(lotsSelectionnes.length === lots.length ? [] : lots.map(l => l.id))
  }

  function lancerTirage() {
    const lotsChoisis = lots.filter(l => lotsSelectionnes.includes(l.id))
    const resultats = effectuerTirage(participants, lotsChoisis)
    setGagnants(resultats)
    setEtape('animation')

    let elapsed = 0
    let tick = TICK_START

    function animate() {
      setNomAffiche(participants[Math.floor(Math.random() * participants.length)].nom)
      elapsed += tick
      tick = TICK_START + Math.floor((TICK_END - TICK_START) * (elapsed / ANIMATION_DURATION))
      if (elapsed >= ANIMATION_DURATION) {
        setEtape('termine')
        sauvegarderResultat(resultats)
      } else {
        timeoutRef.current = setTimeout(animate, tick)
      }
    }
    timeoutRef.current = setTimeout(animate, tick)
  }

  function recommencer() {
    setEtape('config')
    setGagnants([])
    setNomAffiche('')
    setLotsSelectionnes([])
  }

  // ── Tirage en cours ────────────────────────────────────────────────
  if (etape === 'animation') {
    return (
      <section style={{ padding: '60px 0' }}>
        <div className="kicker kicker-accent" style={{ letterSpacing: '0.14em' }}>Participant sélectionné</div>
        <div style={{ borderTop: '2px solid var(--color-divider)', borderBottom: '2px solid var(--color-divider)', marginTop: 12, padding: '52px 0', minHeight: 180, display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(36px, 7vw, 64px)', lineHeight: 1.02, letterSpacing: '-0.03em', overflowWrap: 'anywhere' }}>
            {nomAffiche || '…'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 0.15, 0.3, 0.45].map(d => (
              <span key={d} style={{ width: 9, height: 9, background: 'var(--color-accent)', animation: `blink 1s infinite ${d}s` }} />
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            {plural(participants.length, 'participant')} en lice
          </div>
        </div>
      </section>
    )
  }

  // ── Résultats immédiats ────────────────────────────────────────────
  if (etape === 'termine') {
    return (
      <section>
        <div className="section-head">
          <div>
            <div className="kicker kicker-accent" style={{ letterSpacing: '0.14em' }}>Tirage terminé</div>
            <h2 style={{ margin: '6px 0 2px', fontSize: 40 }}>
              {plural(gagnants.length, 'gagnant')} !
            </h2>
            <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
              Les résultats ont été sauvegardés dans l'historique.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={recommencer}>Nouveau tirage</button>
            <button className="btn btn-primary" onClick={onTirageComplete}>Voir les résultats</button>
          </div>
        </div>

        {gagnants.map((g, i) => (
          <div className="row" key={i} style={{ animation: `rise .3s ${i * 0.05}s both` }}>
            <div style={{ width: 30, height: 30, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--color-accent)', color: 'var(--color-on-accent)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 13 }}>
              {i + 1}
            </div>
            <div style={{ width: 46, height: 46, flex: 'none', background: 'var(--color-neutral-200)', overflow: 'hidden' }}>
              {g.lot.image && (
                <div style={{ width: 46, height: 46, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url("${g.lot.image}")` }} />
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 17, overflowWrap: 'anywhere' }}>{g.participant.nom}</div>
              {g.participant.email && (
                <div style={{ fontSize: 12, overflowWrap: 'anywhere', color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{g.participant.email}</div>
              )}
            </div>
            <span className="tag tag-accent" style={{ marginLeft: 'auto' }}>{g.lot.nom}</span>
          </div>
        ))}
      </section>
    )
  }

  // ── Configuration ──────────────────────────────────────────────────
  return (
    <section>
      <div className="stat-grid rule-top">
        <div>
          <div className="kicker">Participants inscrits</div>
          <div className="stat-value" style={{ fontSize: 54, lineHeight: 1.05 }}>{participants.length}</div>
          {participants.length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--color-accent-700)', borderLeft: '3px solid var(--color-accent)', paddingLeft: 10, marginTop: 8 }}>
              Ajoutez des participants avant de lancer le tirage.
            </div>
          )}
        </div>
        <div>
          <div className="kicker">Places mises en jeu</div>
          <div className="stat-value" style={{ fontSize: 54, lineHeight: 1.05, color: 'var(--color-accent)' }}>{placesEnJeu}</div>
          <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)', marginTop: 8 }}>
            {lotsSelectionnes.length > 0
              ? `${plural(lotsSelectionnes.length, 'lot')} ${lotsSelectionnes.length > 1 ? 'sélectionnés' : 'sélectionné'}`
              : 'Aucun lot sélectionné'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, padding: '26px 0 12px' }}>
        <h3 style={{ margin: 0 }}>Lots à tirer</h3>
        {lots.length > 0 && (
          <button className="btn btn-ghost" onClick={toggleTousLots}>
            {lotsSelectionnes.length === lots.length ? 'Tout désélectionner' : 'Tout sélectionner'}
          </button>
        )}
      </div>

      {lots.map(lot => {
        const coche = lotsSelectionnes.includes(lot.id)
        return (
          <button
            key={lot.id}
            type="button"
            onClick={() => toggleLot(lot.id)}
            aria-pressed={coche}
            style={{
              appearance: 'none', font: 'inherit', color: 'inherit', textAlign: 'left', width: '100%',
              display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', marginBottom: 2, cursor: 'pointer',
              background: coche ? 'var(--color-accent-100)' : 'var(--color-surface)',
              border: 0, borderLeft: `3px solid ${coche ? 'var(--color-accent)' : 'var(--color-divider)'}`,
            }}
          >
            <div style={{ width: 18, height: 18, flex: 'none', border: `2px solid ${coche ? 'var(--color-accent)' : 'var(--color-divider)'}`, background: coche ? 'var(--color-accent)' : 'transparent', display: 'grid', placeItems: 'center' }}>
              <IconCheck size={12} stroke={coche ? 'var(--color-bg)' : 'transparent'} />
            </div>
            <div style={{ width: 48, height: 48, flex: 'none', background: 'var(--color-neutral-200)', overflow: 'hidden' }}>
              {lot.image && (
                <div style={{ width: 48, height: 48, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url("${lot.image}")` }} />
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16, overflowWrap: 'anywhere' }}>{lot.nom}</div>
              {lot.description && (
                <div style={{ fontSize: 12, overflowWrap: 'anywhere', color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{lot.description}</div>
              )}
            </div>
            <span className="tag tag-neutral" style={{ marginLeft: 'auto' }}>×{lot.quantite}</span>
          </button>
        )
      })}

      {lots.length === 0 && (
        <div style={{ padding: 22, background: 'var(--color-surface)', fontSize: 14 }}>
          <strong>Aucun lot disponible.</strong> Ajoutez des lots dans l'onglet Lots.
        </div>
      )}

      <div style={{ marginTop: 28, paddingTop: 20, borderTop: '2px solid var(--color-divider)', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary" disabled={!peutLancer} onClick={lancerTirage}
          style={{ fontSize: 16, padding: '14px 26px', whiteSpace: 'nowrap' }}
        >
          Lancer le tirage
          <IconArrowRight size={17} />
        </button>
        <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
          {participants.length === 0
            ? 'Ajoutez des participants pour continuer.'
            : lotsSelectionnes.length === 0
              ? 'Sélectionnez au moins un lot pour continuer.'
              : `${plural(placesEnJeu, 'gagnant')} ${placesEnJeu > 1 ? 'seront désignés' : 'sera désigné'} parmi ${plural(participants.length, 'participant')}.`}
        </div>
      </div>
    </section>
  )
}
