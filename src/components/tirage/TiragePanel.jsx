import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { effectuerTirage } from '../../utils/tirage'

const ANIMATION_DURATION = 3500
const TICK_START = 60
const TICK_END = 450

const IconPlay = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 3l14 9-14 9V3z"/>
  </svg>
)
const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5.95"/>
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

export default function TiragePanel({ onTirageComplete }) {
  const { participants, lots, sauvegarderResultat } = useApp()
  const [lotsSelectionnes, setLotsSelectionnes] = useState([])
  const [nomAffiche, setNomAffiche] = useState('')
  const [gagnants, setGagnants] = useState([])
  const [etape, setEtape] = useState('config')
  const timeoutRef = useRef(null)

  const peutLancer = participants.length > 0 && lotsSelectionnes.length > 0

  function toggleLot(id) {
    setLotsSelectionnes(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    )
  }

  function toggleTousLots() {
    setLotsSelectionnes(
      lotsSelectionnes.length === lots.length ? [] : lots.map(l => l.id)
    )
  }

  function lancerTirage() {
    const lotsChoisis = lots.filter(l => lotsSelectionnes.includes(l.id))
    const resultats = effectuerTirage(participants, lotsChoisis)
    setGagnants(resultats)
    setEtape('animation')

    let elapsed = 0
    let tick = TICK_START

    function animate() {
      const randomP = participants[Math.floor(Math.random() * participants.length)]
      setNomAffiche(randomP.nom)
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

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  // ── Écran animation ──────────────────────────────────────────
  if (etape === 'animation') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            Tirage en cours
          </p>
          <div
            className="bg-white rounded-3xl px-12 py-8 border border-violet-100"
            style={{ boxShadow: '0 8px 40px rgba(124,58,237,.15)', minWidth: 280 }}
          >
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-3">
              Participant sélectionné
            </p>
            <p
              key={nomAffiche}
              className="text-3xl font-extrabold text-slate-900 transition-none"
              style={{ minHeight: 44 }}
            >
              {nomAffiche || '...'}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-400">
          {participants.length} participants en lice
        </p>
      </div>
    )
  }

  // ── Écran résultats immédiats ─────────────────────────────────
  if (etape === 'termine') {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            Tirage terminé
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {gagnants.length} gagnant{gagnants.length !== 1 ? 's' : ''} !
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Les résultats ont été sauvegardés dans l'historique
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {gagnants.map((g, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex items-stretch"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}
            >
              {/* Image lot */}
              {g.lot.image && (
                <div className="w-16 shrink-0 bg-slate-50 border-r border-slate-100">
                  <img src={g.lot.image} alt={g.lot.nom} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 px-4 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm">{g.participant.nom}</p>
                  {g.participant.email && (
                    <p className="text-slate-400 text-xs truncate">{g.participant.email}</p>
                  )}
                </div>
                <div className="shrink-0">
                  <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
                    {g.lot.nom}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={recommencer}
            className="flex items-center justify-center gap-2 flex-1 px-4 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <IconRefresh />
            Nouveau tirage
          </button>
          <button
            onClick={onTirageComplete}
            className="flex items-center justify-center gap-2 flex-1 px-4 py-3.5 text-sm font-semibold text-white bg-violet-600 rounded-2xl hover:bg-violet-700 transition-colors"
            style={{ boxShadow: '0 4px 12px rgba(124,58,237,.3)' }}
          >
            Voir les résultats
            <IconArrow />
          </button>
        </div>
      </div>
    )
  }

  // ── Écran configuration ──────────────────────────────────────
  const totalGagnantsChoisis = lotsSelectionnes.reduce((acc, id) => {
    const l = lots.find(l => l.id === id)
    return acc + (parseInt(l?.quantite, 10) || 0)
  }, 0)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Tirage au sort</h2>
        <p className="text-slate-500 text-sm mt-0.5">Sélectionnez les lots et lancez le tirage</p>
      </div>

      {/* Carte participants */}
      <div
        className="bg-white rounded-2xl p-5 mb-5 border border-slate-100"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
              Participants inscrits
            </p>
            <p className="text-3xl font-extrabold text-slate-900">{participants.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
        </div>
        {participants.length === 0 && (
          <p className="text-amber-500 text-xs font-medium mt-2">
            Ajoutez des participants avant de lancer le tirage
          </p>
        )}
      </div>

      {/* Sélection des lots */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            Lots à tirer
          </h3>
          {lots.length > 0 && (
            <button
              onClick={toggleTousLots}
              className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
            >
              {lotsSelectionnes.length === lots.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          )}
        </div>

        {lots.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-10 text-center text-slate-400">
            <p className="text-sm font-medium">Aucun lot disponible</p>
            <p className="text-xs mt-1">Ajoutez des lots dans l'onglet Lots</p>
          </div>
        ) : (
          <div className="space-y-2">
            {lots.map(lot => {
              const selected = lotsSelectionnes.includes(lot.id)
              return (
                <label
                  key={lot.id}
                  className={`flex items-center gap-3 rounded-2xl border cursor-pointer transition-all overflow-hidden ${
                    selected
                      ? 'border-violet-300 bg-violet-50'
                      : 'border-slate-100 bg-white hover:border-violet-200'
                  }`}
                  style={{ boxShadow: selected ? '0 2px 8px rgba(124,58,237,.1)' : '0 1px 4px rgba(0,0,0,.04)' }}
                >
                  {/* Image */}
                  {lot.image && (
                    <div className="w-14 h-14 shrink-0 border-r border-slate-100">
                      <img src={lot.image} alt={lot.nom} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 px-3 py-3 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleLot(lot.id)}
                      className="w-4 h-4 rounded accent-violet-600 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{lot.nom}</p>
                      {lot.description && (
                        <p className="text-xs text-slate-400 truncate">{lot.description}</p>
                      )}
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      selected ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      x{lot.quantite}
                    </span>
                  </div>
                </label>
              )
            })}
          </div>
        )}
      </div>

      {/* Résumé sélection */}
      {lotsSelectionnes.length > 0 && (
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mb-5">
          <p className="text-sm text-violet-700">
            <strong className="font-bold">{totalGagnantsChoisis} gagnant{totalGagnantsChoisis !== 1 ? 's' : ''}</strong> seront désignés parmi{' '}
            <strong className="font-bold">{participants.length} participants</strong>
          </p>
        </div>
      )}

      {/* Bouton lancer */}
      <button
        onClick={lancerTirage}
        disabled={!peutLancer}
        className={`w-full py-4 text-base font-bold rounded-2xl transition-all flex items-center justify-center gap-3 ${
          peutLancer
            ? 'text-white bg-violet-600 hover:bg-violet-700 active:scale-[.98]'
            : 'text-slate-400 bg-slate-100 cursor-not-allowed'
        }`}
        style={peutLancer ? { boxShadow: '0 6px 20px rgba(124,58,237,.4)' } : {}}
      >
        <IconPlay />
        Lancer le tirage
      </button>

      {!peutLancer && (
        <p className="text-center text-xs text-slate-400 mt-3">
          {participants.length === 0
            ? 'Ajoutez des participants pour continuer'
            : 'Sélectionnez au moins un lot pour continuer'}
        </p>
      )}
    </div>
  )
}
