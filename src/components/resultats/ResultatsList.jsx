import { useState } from 'react'
import { useApp } from '../../context/AppContext'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const IconChevron = ({ open }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const MEDAL_COLORS = [
  { bg: '#fef9c3', text: '#a16207', label: 'Or' },
  { bg: '#f1f5f9', text: '#475569', label: 'Argent' },
  { bg: '#fef3c7', text: '#92400e', label: 'Bronze' },
]

export default function ResultatsList() {
  const { historique, effacerHistorique } = useApp()
  const [confirmerEffacer, setConfirmerEffacer] = useState(false)
  const [expanded, setExpanded] = useState(historique[0]?.id ?? null)

  if (historique.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        </div>
        <p className="text-lg font-bold text-slate-700">Aucun tirage effectué</p>
        <p className="text-sm text-slate-400 mt-1.5">
          Rendez-vous dans l'onglet Tirage pour lancer votre premier tirage
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Résultats</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {historique.length} tirage{historique.length !== 1 ? 's' : ''} dans l'historique
          </p>
        </div>
        <button
          onClick={() => setConfirmerEffacer(true)}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-500 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
        >
          <IconTrash />
          Effacer tout
        </button>
      </div>

      {/* Dernier tirage mis en avant */}
      {historique.length > 0 && (() => {
        const last = historique[0]
        const top3 = last.gagnants.slice(0, 3)
        return (
          <div
            className="bg-white rounded-3xl border border-slate-100 overflow-hidden mb-4"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,.07)' }}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">
                <IconCalendar />
                Dernier tirage
              </div>
              <p className="text-sm font-medium text-slate-700">{formatDate(last.date)}</p>
              <p className="text-xs text-slate-400 mt-0.5">{last.gagnants.length} gagnant{last.gagnants.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Podium top 3 */}
            {top3.length > 0 && (
              <div className="px-5 py-5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">
                  Palmarès
                </p>
                <div className="space-y-3">
                  {top3.map((g, i) => {
                    const medal = MEDAL_COLORS[i] || MEDAL_COLORS[2]
                    return (
                      <div key={i} className="flex items-center gap-3">
                        {/* Médaille */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
                          style={{ backgroundColor: medal.bg, color: medal.text }}
                        >
                          {i + 1}
                        </div>

                        {/* Image lot */}
                        {g.lot.image ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                            <img src={g.lot.image} alt={g.lot.nom} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
                              <line x1="12" y1="22" x2="12" y2="7"/>
                            </svg>
                          </div>
                        )}

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{g.participant.nom}</p>
                          <p className="text-xs text-slate-400 truncate">{g.lot.nom}</p>
                        </div>

                        {/* Badge lot */}
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                          style={{ backgroundColor: medal.bg, color: medal.text }}
                        >
                          {g.lot.valeur ? `${parseFloat(g.lot.valeur).toFixed(0)} €` : `x${g.lot.quantite}`}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {last.gagnants.length > 3 && (
                  <button
                    onClick={() => setExpanded(expanded === last.id ? null : last.id)}
                    className="mt-4 w-full py-2.5 text-xs font-semibold text-violet-600 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {expanded === last.id ? 'Masquer' : `Voir les ${last.gagnants.length - 3} autres gagnants`}
                    <IconChevron open={expanded === last.id} />
                  </button>
                )}
              </div>
            )}

            {/* Autres gagnants dépliables */}
            {expanded === last.id && last.gagnants.length > 3 && (
              <div className="border-t border-slate-50 divide-y divide-slate-50">
                {last.gagnants.slice(3).map((g, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold shrink-0">
                      {i + 4}
                    </div>
                    {g.lot.image && (
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                        <img src={g.lot.image} alt={g.lot.nom} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{g.participant.nom}</p>
                      <p className="text-xs text-slate-400 truncate">{g.lot.nom}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })()}

      {/* Historique précédent */}
      {historique.length > 1 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Historique</p>
          <div className="space-y-2">
            {historique.slice(1).map(tirage => (
              <div
                key={tirage.id}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}
              >
                <button
                  className="w-full text-left px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  onClick={() => setExpanded(expanded === tirage.id ? null : tirage.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <IconCalendar />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{formatDate(tirage.date)}</p>
                      <p className="text-slate-400 text-xs">{tirage.gagnants.length} gagnant{tirage.gagnants.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <span className="text-slate-400">
                    <IconChevron open={expanded === tirage.id} />
                  </span>
                </button>

                {expanded === tirage.id && (
                  <div className="border-t border-slate-50 divide-y divide-slate-50">
                    {tirage.gagnants.map((g, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        {g.lot.image && (
                          <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                            <img src={g.lot.image} alt={g.lot.nom} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{g.participant.nom}</p>
                          {g.participant.email && (
                            <p className="text-slate-400 text-xs truncate">{g.participant.email}</p>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full shrink-0">
                          {g.lot.nom}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal confirmation effacement */}
      {confirmerEffacer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" style={{ boxShadow: '0 25px 60px rgba(0,0,0,.15)' }}>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <IconTrash />
            </div>
            <h3 className="font-bold text-slate-900 text-center mb-1">Effacer l'historique ?</h3>
            <p className="text-slate-500 text-sm text-center mb-5">
              Tous les résultats seront définitivement supprimés.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmerEffacer(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => { effacerHistorique(); setConfirmerEffacer(false) }}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
              >
                Effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
