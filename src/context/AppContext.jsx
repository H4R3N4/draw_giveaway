import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [participants, setParticipants] = useLocalStorage('participants', [])
  const [lots, setLots] = useLocalStorage('lots', [])
  const [historique, setHistorique] = useLocalStorage('historique', [])

  function ajouterParticipant(data) {
    const nouveau = { id: crypto.randomUUID(), ...data, dateAjout: new Date().toISOString() }
    setParticipants(prev => [...prev, nouveau])
  }

  function modifierParticipant(id, data) {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  function supprimerParticipant(id) {
    setParticipants(prev => prev.filter(p => p.id !== id))
  }

  function reinitialiserParticipants() {
    setParticipants([])
  }

  function ajouterLot(data) {
    const nouveau = { id: crypto.randomUUID(), ...data }
    setLots(prev => [...prev, nouveau])
  }

  function modifierLot(id, data) {
    setLots(prev => prev.map(l => l.id === id ? { ...l, ...data } : l))
  }

  function supprimerLot(id) {
    setLots(prev => prev.filter(l => l.id !== id))
  }

  function reinitialiserLots() {
    setLots([])
  }

  function sauvegarderResultat(gagnants) {
    const resultat = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      gagnants,
    }
    setHistorique(prev => [resultat, ...prev])
  }

  function effacerHistorique() {
    setHistorique([])
  }

  return (
    <AppContext.Provider value={{
      participants, ajouterParticipant, modifierParticipant, supprimerParticipant, reinitialiserParticipants,
      lots, ajouterLot, modifierLot, supprimerLot, reinitialiserLots,
      historique, sauvegarderResultat, effacerHistorique,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
