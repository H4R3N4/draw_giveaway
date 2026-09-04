import { useState, useEffect } from 'react'

/**
 * Précharge une liste d'images et signale quand elles sont toutes prêtes.
 *
 * Une image en échec (fichier manquant, réseau coupé) compte comme terminée :
 * l'interface ne doit jamais rester bloquée sur l'écran de chargement à cause
 * d'une illustration.
 *
 * @param {string[]} sources - URLs des images à précharger
 * @returns {{ pret: boolean, chargees: number, total: number }}
 */
export function usePrechargementImages(sources) {
  const [chargees, setChargees] = useState(0)
  const [pret, setPret] = useState(sources.length === 0)

  useEffect(() => {
    if (sources.length === 0) {
      setPret(true)
      return
    }

    let annule = false
    let restantes = sources.length

    function uneDeMoins() {
      if (annule) return
      restantes -= 1
      setChargees(sources.length - restantes)
      if (restantes === 0) setPret(true)
    }

    const images = sources.map(src => {
      const img = new Image()
      img.onload = uneDeMoins
      img.onerror = uneDeMoins
      img.src = src
      return img
    })

    return () => {
      annule = true
      // Couper les handlers évite une mise à jour d'état après démontage.
      for (const img of images) {
        img.onload = null
        img.onerror = null
      }
    }
    // La liste d'images de l'application est fixe : on ne précharge qu'une fois.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { pret, chargees, total: sources.length }
}
