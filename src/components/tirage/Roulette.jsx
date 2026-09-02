import { useState, useEffect, useMemo, useRef } from 'react'
import { construirePiste } from '../../utils/tirage'

/** Hauteur d'une cellule de la piste, en pixels. */
const HAUTEUR_CELLULE = 76
/** Cellules visibles de part et d'autre du curseur central. */
const RAYON_VISIBLE = 2
/** Durée du défilement, du départ à l'arrêt sur le gagnant. */
const DUREE_DEFILEMENT = 4200
/** Pause après l'arrêt, avant de rendre la main (le nom reste affiché). */
const DUREE_REVELATION = 900

/**
 * Roulette de casino : la piste des participants défile verticalement et
 * s'arrête pile sur le gagnant, déjà tiré en arrière-plan par l'appelant.
 *
 * Le freinage suit une courbe quintique inversée : très rapide au départ,
 * puis un ralentissement de plus en plus marqué qui laisse voir les derniers
 * noms passer un à un avant l'arrêt.
 */
export default function Roulette({ participants, gagnant, onArret }) {
  const [offset, setOffset] = useState(0)
  const [arrete, setArrete] = useState(false)
  const frameRef = useRef(null)
  const timeoutRef = useRef(null)

  // La piste est construite une seule fois par gagnant : la recalculer en
  // cours de route ferait sauter le défilement.
  const { piste, indexGagnant } = useMemo(
    () => construirePiste(participants, gagnant),
    // Les participants en lice ne changent pas pendant un défilement ; seul
    // le gagnant identifie la piste à construire.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gagnant.id],
  )

  useEffect(() => {
    const depart = performance.now()
    const cible = indexGagnant

    function tick(maintenant) {
      const t = Math.min((maintenant - depart) / DUREE_DEFILEMENT, 1)
      // easeOutQuint — décélération franche sur la fin.
      const progression = 1 - Math.pow(1 - t, 5)
      setOffset(progression * cible)

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setOffset(cible)
        setArrete(true)
        timeoutRef.current = setTimeout(onArret, DUREE_REVELATION)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frameRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [indexGagnant, onArret])

  // Seules les cellules autour du curseur sont montées : la piste peut
  // compter des centaines de noms sans alourdir le rendu.
  const centre = Math.round(offset)
  const debut = Math.max(0, centre - RAYON_VISIBLE - 1)
  const fin = Math.min(piste.length - 1, centre + RAYON_VISIBLE + 1)
  const cellules = []
  for (let i = debut; i <= fin; i++) cellules.push({ index: i, participant: piste[i] })

  const hauteurFenetre = HAUTEUR_CELLULE * (RAYON_VISIBLE * 2 + 1)

  return (
    <div
      style={{
        position: 'relative',
        height: hauteurFenetre,
        overflow: 'hidden',
        background: 'var(--color-surface)',
        borderTop: '2px solid var(--color-divider)',
        borderBottom: '2px solid var(--color-divider)',
      }}
    >
      {/* Bande du curseur : la fenêtre où le nom s'immobilise. */}
      <div
        aria-hidden
        style={{
          position: 'absolute', left: 0, right: 0,
          top: RAYON_VISIBLE * HAUTEUR_CELLULE, height: HAUTEUR_CELLULE,
          borderTop: `2px solid ${arrete ? 'var(--color-gold)' : 'var(--color-accent)'}`,
          borderBottom: `2px solid ${arrete ? 'var(--color-gold)' : 'var(--color-accent)'}`,
          background: arrete
            ? 'color-mix(in srgb, var(--color-gold) 14%, transparent)'
            : 'color-mix(in srgb, var(--color-accent) 8%, transparent)',
          transition: 'background .25s, border-color .25s',
          pointerEvents: 'none', zIndex: 2,
        }}
      >
        {/* Repères latéraux, comme l'aiguille d'une roue de casino. */}
        <span style={{ position: 'absolute', left: 0, top: '50%', width: 14, height: 3, marginTop: -1.5, background: arrete ? 'var(--color-gold)' : 'var(--color-accent)' }} />
        <span style={{ position: 'absolute', right: 0, top: '50%', width: 14, height: 3, marginTop: -1.5, background: arrete ? 'var(--color-gold)' : 'var(--color-accent)' }} />
      </div>

      {/* Dégradés haut/bas : les noms qui arrivent et repartent s'estompent. */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: 'linear-gradient(var(--color-surface), transparent 34%, transparent 66%, var(--color-surface))',
        }}
      />

      {/* La piste elle-même, translatée pour amener le curseur sur `offset`. */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0,
          top: RAYON_VISIBLE * HAUTEUR_CELLULE,
          transform: `translateY(${-offset * HAUTEUR_CELLULE}px)`,
          willChange: 'transform',
        }}
      >
        {cellules.map(({ index, participant }) => {
          const distance = Math.abs(index - offset)
          const actif = arrete && index === indexGagnant
          return (
            <div
              key={index}
              style={{
                position: 'absolute', left: 0, right: 0,
                top: index * HAUTEUR_CELLULE, height: HAUTEUR_CELLULE,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 20px',
                // Le nom sous le curseur est net et plein ; les autres
                // s'effacent à mesure qu'ils s'en éloignent.
                opacity: Math.max(0.12, 1 - distance * 0.42),
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: actif ? 'clamp(28px, 5.4vw, 46px)' : 'clamp(22px, 4vw, 34px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                textAlign: 'center',
                color: actif ? 'var(--color-accent-700)' : 'var(--color-text)',
                overflowWrap: 'anywhere',
                transition: arrete ? 'font-size .25s, color .25s' : 'none',
              }}
            >
              {participant.nom}
            </div>
          )
        })}
      </div>
    </div>
  )
}
