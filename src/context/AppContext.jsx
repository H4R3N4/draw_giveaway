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

  /**
   * Ajout groupé (import Facebook) : un seul enregistrement pour toute la
   * fournée, et les personnes déjà connues — même identifiant Facebook ou même
   * nom — sont écartées pour éviter les doublons dans le tirage.
   * @returns {number} nombre de participants réellement ajoutés
   */
  function ajouterParticipants(liste) {
    let ajoutes = 0
    setParticipants(prev => {
      const idsConnus = new Set(prev.filter(p => p.facebookId).map(p => p.facebookId))
      // Les anciennes fiches peuvent ne pas avoir de nom renseigné.
      const nomsConnus = new Set(prev.map(p => (p.nom || '').trim().toLowerCase()).filter(Boolean))
      const nouveaux = []

      for (const data of liste) {
        const nom = (data.nom || '').trim()
        if (!nom) continue
        if (data.facebookId && idsConnus.has(data.facebookId)) continue
        if (nomsConnus.has(nom.toLowerCase())) continue

        if (data.facebookId) idsConnus.add(data.facebookId)
        nomsConnus.add(nom.toLowerCase())
        nouveaux.push({ id: crypto.randomUUID(), ...data, nom, dateAjout: new Date().toISOString() })
      }

      ajoutes = nouveaux.length
      return [...prev, ...nouveaux]
    })
    return ajoutes
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
      participants, ajouterParticipant, ajouterParticipants, modifierParticipant, supprimerParticipant, reinitialiserParticipants,
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
