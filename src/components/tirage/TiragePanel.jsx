import { useState, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { construirePlaces, tirerUnGagnant } from '../../utils/tirage'
import Roulette from './Roulette'
import { IconArrowRight, IconCheck } from '../ui/Icons'
import { plural } from '../../utils/format'

export default function TiragePanel({ onTirageComplete }) {
  const { participants, lots, sauvegarderResultat } = useApp()
  const [lotsSelectionnes, setLotsSelectionnes] = useState([])
  const [etape, setEtape] = useState('config')
  /** Les places à pourvoir, une par gagnant à désigner. */
  const [places, setPlaces] = useState([])
  /** Index de la place en cours de tirage. */
  const [placeCourante, setPlaceCourante] = useState(0)
  /** Gagnants déjà désignés, dans l'ordre de tirage. */
  const [gagnants, setGagnants] = useState([])
  /** Le gagnant de la place courante, tiré avant l'animation. */
  const [gagnantEnCours, setGagnantEnCours] = useState(null)
  /** 'roulette' pendant le défilement, 'revele' quand le nom est acquis. */
  const [phase, setPhase] = useState('roulette')

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

  /** Participants encore en lice : un gagnant ne peut pas être retiré deux fois. */
  function participantsRestants(dejaGagnants) {
    const pris = new Set(dejaGagnants.map(g => g.participant.id))
    return participants.filter(p => !pris.has(p.id))
  }

  function lancerTirage() {
    const lotsChoisis = lots.filter(l => lotsSelectionnes.includes(l.id))
    const filePlaces = construirePlaces(lotsChoisis, participants.length)
    if (filePlaces.length === 0) return

    // Le gagnant est tiré maintenant, en arrière-plan : l'animation ne fait
    // que révéler un résultat déjà décidé.
    setPlaces(filePlaces)
    setPlaceCourante(0)
    setGagnants([])
    setGagnantEnCours(tirerUnGagnant(participants))
    setPhase('roulette')
    setEtape('animation')
  }

  /** La roulette s'est arrêtée : on acquiert le gagnant et on marque une pause. */
  const surArretRoulette = useCallback(() => {
    setPhase('revele')
  }, [])

  /** Passe à la place suivante, ou clôt le tirage s'il n'en reste plus. */
  function placeSuivante() {
    const place = places[placeCourante]
    const acquis = [...gagnants, { participant: gagnantEnCours, lot: place.lot }]
    const suivante = placeCourante + 1
    const restants = participantsRestants(acquis)

    if (suivante >= places.length || restants.length === 0) {
      setGagnants(acquis)
      sauvegarderResultat(acquis)
      setEtape('termine')
      return
    }

    setGagnants(acquis)
    setPlaceCourante(suivante)
    setGagnantEnCours(tirerUnGagnant(restants))
    setPhase('roulette')
  }

  function recommencer() {
    setEtape('config')
    setPlaces([])
    setPlaceCourante(0)
    setGagnants([])
    setGagnantEnCours(null)
    setPhase('roulette')
    setLotsSelectionnes([])
  }

  // ── Tirage en cours — une place à la fois ──────────────────────────
  if (etape === 'animation') {
    const place = places[placeCourante]
    const enLice = participantsRestants(gagnants)
    const derniere = placeCourante + 1 >= places.length || enLice.length <= 1

    return (
      <section style={{ padding: '28px 0' }}>
        {/* Quelle place est en jeu, et où l'on en est dans la série. */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', paddingBottom: 14 }}>
          <div>
            <div className="kicker kicker-accent" style={{ letterSpacing: '0.14em' }}>
              Tirage {placeCourante + 1} sur {places.length}
            </div>
            <h2 style={{ margin: '6px 0 2px', fontSize: 32, overflowWrap: 'anywhere' }}>{place.lot.nom}</h2>
            <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
              {place.quantiteLot > 1
                ? `Place ${place.rangDansLot} sur ${place.quantiteLot} · ${plural(enLice.length, 'participant')} en lice`
                : `${plural(enLice.length, 'participant')} en lice`}
            </div>
          </div>
          {place.lot.image && (
            <div style={{ width: 64, height: 64, flex: 'none', background: 'var(--color-neutral-200)', overflow: 'hidden' }}>
              <div style={{ width: 64, height: 64, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url("${place.lot.image}")` }} />
            </div>
          )}
        </div>

        {/* Progression de la série : une barre par place à pourvoir. */}
        <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
          {places.map((_, i) => (
            <span
              key={i}
              style={{
                flex: 1, height: 4,
                background: i < placeCourante
                  ? 'var(--color-gold)'
                  : i === placeCourante ? 'var(--color-accent)' : 'var(--color-divider)',
              }}
            />
          ))}
        </div>

        <Roulette
          key={placeCourante}
          participants={enLice}
          gagnant={gagnantEnCours}
          onArret={surArretRoulette}
        />

        {/* Sous la roulette : l'attente pendant le défilement, puis la
            confirmation du gagnant et le passage à la place suivante. */}
        <div style={{ minHeight: 92, marginTop: 20 }}>
          {phase === 'roulette' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 0.15, 0.3, 0.45].map(d => (
                  <span key={d} style={{ width: 9, height: 9, background: 'var(--color-accent)', animation: `blink 1s infinite ${d}s` }} />
                ))}
              </div>
              <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
                Tirage en cours…
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', animation: 'rise .3s both' }}>
              <div>
                <div className="kicker" style={{ letterSpacing: '0.14em', color: 'var(--color-gold-dark)' }}>Gagnant désigné</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20, overflowWrap: 'anywhere' }}>
                  {gagnantEnCours.nom}
                </div>
                {gagnantEnCours.email && (
                  <div style={{ fontSize: 12, overflowWrap: 'anywhere', color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
                    {gagnantEnCours.email}
                  </div>
                )}
              </div>
              <button
                className="btn btn-primary" onClick={placeSuivante}
                style={{ fontSize: 15, padding: '12px 22px', whiteSpace: 'nowrap', marginLeft: 'auto' }}
              >
                {derniere ? 'Terminer le tirage' : 'Tirage suivant'}
                <IconArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Les gagnants déjà désignés restent visibles pendant la série. */}
        {gagnants.length > 0 && (
          <div style={{ marginTop: 8, paddingTop: 16, borderTop: '2px solid var(--color-divider)' }}>
            <div className="kicker" style={{ marginBottom: 8 }}>Déjà désignés</div>
            {gagnants.map((g, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--color-divider)', fontSize: 14 }}>
                <span style={{ width: 22, height: 22, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--color-gold)', color: 'var(--color-gold-ink)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 11 }}>
                  {i + 1}
                </span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, overflowWrap: 'anywhere' }}>{g.participant.nom}</span>
                <span className="tag tag-neutral" style={{ marginLeft: 'auto' }}>{g.lot.nom}</span>
              </div>
            ))}
          </div>
        )}
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
              : `${plural(Math.min(placesEnJeu, participants.length), 'gagnant')} ${Math.min(placesEnJeu, participants.length) > 1 ? 'seront désignés un par un' : 'sera désigné'} parmi ${plural(participants.length, 'participant')}.`}
        </div>
      </div>
    </section>
  )
}
