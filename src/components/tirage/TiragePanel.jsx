import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { effectuerTirage } from '../../utils/tirage'

const ANIMATION_DURATION = 3000 // ms
const TICK_START = 80 // ms entre changements au début
const TICK_END = 400 // ms entre changements à la fin

export default function TiragePanel({ onTirageComplete }) {
  const { participants, lots, sauvegarderResultat } = useApp()
  const [lotsSelectionnes, setLotsSelectionnes] = useState([])
  const [enCours, setEnCours] = useState(false)
  const [nomAffiche, setNomAffiche] = useState('')
  const [gagnants, setGagnants] = useState([])
  const [etape, setEtape] = useState('config') // 'config' | 'animation' | 'termine'
  const intervalRef = useRef(null)

  const peutLancer = participants.length > 0 && lotsSelectionnes.length > 0

  function toggleLot(id) {
    setLotsSelectionnes(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    )
  }

  function toggleTousLots() {
    if (lotsSelectionnes.length === lots.length) {
      setLotsSelectionnes([])
    } else {
      setLotsSelectionnes(lots.map(l => l.id))
    }
  }

  function lancerTirage() {
    const lotsChoisis = lots.filter(l => lotsSelectionnes.includes(l.id))
    const resultats = effectuerTirage(participants, lotsChoisis)
    setGagnants(resultats)
    setEtape('animation')
    setEnCours(true)

    // Animation : défilement des noms
    let elapsed = 0
    let tick = TICK_START

    function animate() {
      const randomP = participants[Math.floor(Math.random() * participants.length)]
      setNomAffiche(`${randomP.prenom} ${randomP.nom}`)

      elapsed += tick
      // Ralentissement progressif
      tick = TICK_START + Math.floor((TICK_END - TICK_START) * (elapsed / ANIMATION_DURATION))

      if (elapsed >= ANIMATION_DURATION) {
        clearInterval(intervalRef.current)
        setEnCours(false)
        setEtape('termine')
        sauvegarderResultat(resultats)
      } else {
        intervalRef.current = setTimeout(animate, tick)
      }
    }

    intervalRef.current = setTimeout(animate, tick)
  }

  function recommencer() {
    setEtape('config')
    setGagnants([])
    setNomAffiche('')
    setLotsSelectionnes([])
  }

  useEffect(() => {
    return () => clearTimeout(intervalRef.current)
  }, [])

  if (etape === 'animation') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-6 animate-bounce">🎰</div>
        <p className="text-slate-500 mb-4 text-sm font-medium uppercase tracking-wider">Tirage en cours...</p>
        <div className="bg-white border-2 border-indigo-200 rounded-2xl px-10 py-6 shadow-lg min-w-64">
          <p className="text-3xl font-bold text-indigo-600 transition-all duration-75">{nomAffiche || '...'}</p>
        </div>
        <div className="mt-8 flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  if (etape === 'termine') {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-slate-800">Tirage terminé !</h2>
          <p className="text-slate-500 text-sm mt-1">{gagnants.length} gagnant{gagnants.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="space-y-3 mb-8">
          {gagnants.map((g, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="text-2xl">🏆</div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{g.participant.prenom} {g.participant.nom}</p>
                {g.participant.email && <p className="text-slate-400 text-xs">{g.participant.email}</p>}
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  🎁 {g.lot.nom}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={recommencer}
            className="flex-1 px-4 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
            Nouveau tirage
          </button>
          <button onClick={onTirageComplete}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors">
            Voir les résultats →
          </button>
        </div>
      </div>
    )
  }

  // Étape config
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Tirage au sort</h2>
        <p className="text-slate-500 text-sm mt-1">Sélectionnez les lots et lancez le tirage</p>
      </div>

      {/* Infos participants */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👥</span>
          <div>
            <p className="font-medium text-slate-800 text-sm">
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </p>
            {participants.length === 0 && (
              <p className="text-amber-500 text-xs">Ajoutez des participants avant le tirage</p>
            )}
          </div>
        </div>
      </div>

      {/* Sélection des lots */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-700 text-sm">Lots à tirer</h3>
          {lots.length > 0 && (
            <button onClick={toggleTousLots} className="text-xs text-indigo-600 hover:underline">
              {lotsSelectionnes.length === lots.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          )}
        </div>

        {lots.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-white border border-dashed border-slate-300 rounded-xl">
            <p className="text-sm">Aucun lot disponible. Ajoutez des lots d'abord.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {lots.map(lot => (
              <label key={lot.id} className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                lotsSelectionnes.includes(lot.id)
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="checkbox"
                  checked={lotsSelectionnes.includes(lot.id)}
                  onChange={() => toggleLot(lot.id)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{lot.nom}</p>
                  {lot.description && <p className="text-xs text-slate-400">{lot.description}</p>}
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">x{lot.quantite}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Résumé */}
      {lotsSelectionnes.length > 0 && (
        <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-700">
          {lotsSelectionnes.reduce((acc, id) => {
            const l = lots.find(l => l.id === id)
            return acc + (parseInt(l?.quantite, 10) || 0)
          }, 0)} gagnant{lotsSelectionnes.reduce((acc, id) => {
            const l = lots.find(l => l.id === id)
            return acc + (parseInt(l?.quantite, 10) || 0)
          }, 0) !== 1 ? 's' : ''} seront tirés parmi {participants.length} participants
        </div>
      )}

      <button
        onClick={lancerTirage}
        disabled={!peutLancer}
        className={`w-full py-4 text-base font-semibold rounded-xl transition-all ${
          peutLancer
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}>
        🎰 Lancer le tirage
      </button>

      {!peutLancer && (
        <p className="text-center text-xs text-slate-400 mt-3">
          {participants.length === 0 ? 'Ajoutez des participants' : 'Sélectionnez au moins un lot'}
        </p>
      )}
    </div>
  )
}
