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

export default function ResultatsList() {
  const { historique, effacerHistorique } = useApp()
  const [confirmerEffacer, setConfirmerEffacer] = useState(false)
  const [expanded, setExpanded] = useState(historique[0]?.id ?? null)

  if (historique.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <div className="text-5xl mb-3">🏆</div>
        <p className="text-lg font-medium">Aucun tirage effectué</p>
        <p className="text-sm mt-1">Rendez-vous dans l'onglet Tirage pour lancer votre premier tirage !</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Résultats</h2>
          <p className="text-slate-500 text-sm mt-1">{historique.length} tirage{historique.length !== 1 ? 's' : ''} dans l'historique</p>
        </div>
        <button
          onClick={() => setConfirmerEffacer(true)}
          className="text-sm text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
          Effacer tout
        </button>
      </div>

      <div className="space-y-3">
        {historique.map(tirage => (
          <div key={tirage.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <button
              className="w-full text-left px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              onClick={() => setExpanded(expanded === tirage.id ? null : tirage.id)}>
              <div className="flex items-center gap-3">
                <span className="text-xl">🎲</span>
                <div>
                  <p className="font-medium text-slate-800 text-sm">{formatDate(tirage.date)}</p>
                  <p className="text-slate-400 text-xs">{tirage.gagnants.length} gagnant{tirage.gagnants.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <span className="text-slate-400 text-sm">{expanded === tirage.id ? '▲' : '▼'}</span>
            </button>

            {expanded === tirage.id && (
              <div className="border-t border-slate-100 divide-y divide-slate-50">
                {tirage.gagnants.map((g, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm truncate">
                        {g.participant.prenom} {g.participant.nom}
                      </p>
                      {g.participant.email && (
                        <p className="text-slate-400 text-xs truncate">{g.participant.email}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        🎁 {g.lot.nom}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {confirmerEffacer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-slate-800 mb-2">Effacer tout l'historique ?</h3>
            <p className="text-slate-500 text-sm mb-5">Cette action supprime définitivement tous les résultats.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmerEffacer(false)}
                className="flex-1 px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                Annuler
              </button>
              <button onClick={() => { effacerHistorique(); setConfirmerEffacer(false) }}
                className="flex-1 px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                Effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
