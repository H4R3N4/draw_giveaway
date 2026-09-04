import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AppContext = createContext(null)

const DONNEES_VIDES = { participants: [], lots: [], historique: [] }

/**
 * Récupère les anciennes clés à plat ("participants", "lots", "historique")
 * si elles existent encore, pour les transformer en premier giveaway. Ainsi
 * les utilisateurs qui avaient déjà des données avant l'introduction des
 * giveaways multiples ne perdent rien à la mise à jour.
 */
function migrerDonneesHeritees() {
  try {
    const participants = JSON.parse(localStorage.getItem('participants') || 'null')
    const lots = JSON.parse(localStorage.getItem('lots') || 'null')
    const historique = JSON.parse(localStorage.getItem('historique') || 'null')
    if (!participants && !lots && !historique) return null

    return {
      participants: participants || [],
      lots: lots || [],
      historique: historique || [],
    }
  } catch {
    return null
  }
}

export function AppProvider({ children }) {
  const [giveaways, setGiveaways] = useLocalStorage('giveaways', () => {
    const herite = migrerDonneesHeritees()
    if (!herite) return []
    return [{ id: crypto.randomUUID(), nom: 'Giveaway 1', dateCreation: new Date().toISOString() }]
  })

  const [donneesParGiveaway, setDonneesParGiveaway] = useLocalStorage('giveaways-donnees', () => {
    const herite = migrerDonneesHeritees()
    if (!herite || giveaways.length === 0) return {}
    return { [giveaways[0].id]: herite }
  })

  const [giveawayActifId, setGiveawayActifId] = useLocalStorage('giveaway-actif-id', () => giveaways[0]?.id ?? null)

  const giveawayActif = giveaways.find(g => g.id === giveawayActifId) || null
  const donnees = (giveawayActifId && donneesParGiveaway[giveawayActifId]) || DONNEES_VIDES
  const { participants, lots, historique } = donnees

  /** Applique une transformation aux données du giveaway actif uniquement. */
  function majDonneesActives(cle, transform) {
    if (!giveawayActifId) return
    setDonneesParGiveaway(prev => {
      const actuelles = prev[giveawayActifId] || DONNEES_VIDES
      return {
        ...prev,
        [giveawayActifId]: { ...actuelles, [cle]: transform(actuelles[cle] || []) },
      }
    })
  }

  // ── Giveaways ───────────────────────────────────────────────────────
  function creerGiveaway(nom) {
    const nouveau = { id: crypto.randomUUID(), nom: nom.trim(), dateCreation: new Date().toISOString() }
    setGiveaways(prev => [...prev, nouveau])
    setDonneesParGiveaway(prev => ({ ...prev, [nouveau.id]: { participants: [], lots: [], historique: [] } }))
    setGiveawayActifId(nouveau.id)
    return nouveau
  }

  function renommerGiveaway(id, nom) {
    setGiveaways(prev => prev.map(g => g.id === id ? { ...g, nom: nom.trim() } : g))
  }

  function supprimerGiveaway(id) {
    setGiveaways(prev => prev.filter(g => g.id !== id))
    setDonneesParGiveaway(prev => {
      const { [id]: _supprime, ...reste } = prev
      return reste
    })
    if (giveawayActifId === id) {
      const restants = giveaways.filter(g => g.id !== id)
      setGiveawayActifId(restants[0]?.id ?? null)
    }
  }

  function selectionnerGiveaway(id) {
    setGiveawayActifId(id)
  }

  // ── Participants ────────────────────────────────────────────────────
  function ajouterParticipant(data) {
    const nouveau = { id: crypto.randomUUID(), ...data, dateAjout: new Date().toISOString() }
    majDonneesActives('participants', prev => [...prev, nouveau])
  }

  /**
   * Ajout groupé (import Facebook) : un seul enregistrement pour toute la
   * fournée, et les personnes déjà connues — même identifiant Facebook ou même
   * nom — sont écartées pour éviter les doublons dans le tirage.
   * @returns {number} nombre de participants réellement ajoutés
   */
  function ajouterParticipants(liste) {
    let ajoutes = 0
    majDonneesActives('participants', prev => {
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
    majDonneesActives('participants', prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  function supprimerParticipant(id) {
    majDonneesActives('participants', prev => prev.filter(p => p.id !== id))
  }

  function reinitialiserParticipants() {
    majDonneesActives('participants', () => [])
  }

  // ── Lots ────────────────────────────────────────────────────────────
  function ajouterLot(data) {
    const nouveau = { id: crypto.randomUUID(), ...data }
    majDonneesActives('lots', prev => [...prev, nouveau])
  }

  function modifierLot(id, data) {
    majDonneesActives('lots', prev => prev.map(l => l.id === id ? { ...l, ...data } : l))
  }

  function supprimerLot(id) {
    majDonneesActives('lots', prev => prev.filter(l => l.id !== id))
  }

  function reinitialiserLots() {
    majDonneesActives('lots', () => [])
  }

  // ── Historique des tirages ─────────────────────────────────────────
  function sauvegarderResultat(gagnants) {
    const resultat = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      gagnants,
    }
    majDonneesActives('historique', prev => [resultat, ...prev])
  }

  function effacerHistorique() {
    majDonneesActives('historique', () => [])
  }

  return (
    <AppContext.Provider value={{
      giveaways, giveawayActif, giveawayActifId, donneesParGiveaway, creerGiveaway, renommerGiveaway, supprimerGiveaway, selectionnerGiveaway,
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
