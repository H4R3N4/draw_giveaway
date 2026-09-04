import { APP_TITLE } from '../constants'
import { IconGift, IconArrowRight } from './ui/Icons'
import captureParticipants from '../assets/capture participant.png'
import captureLots from '../assets/capture lots.png'
import captureTirage from '../assets/tirage.png'

/**
 * Les trois étapes du parcours, illustrées par de vraies captures de
 * l'application plutôt que par des vignettes abstraites : chacune occupe
 * sa propre section pleine hauteur.
 */
const STEPS = [
  {
    n: '01',
    image: captureParticipants,
    titre: 'Gérer les participants',
    texte: "Constituez la liste des personnes qui participent : le nom suffit, l'email reste facultatif. Chaque fiche reçoit ses initiales colorées, la recherche filtre la liste à la frappe, et l'import depuis Facebook récupère les commentaires d'une publication en écartant les doublons.",
  },
  {
    n: '02',
    image: captureLots,
    titre: 'Ajouter les lots',
    texte: "Décrivez les prix à gagner : photo, description, quantité et valeur en euro ou en ariary. La quantité fixe le nombre de gagnants pour ce lot, et le tableau de bord additionne la valeur totale en convertissant automatiquement les deux devises.",
  },
  {
    n: '03',
    image: captureTirage,
    titre: 'Laisser le sort désigner les gagnants',
    texte: "Cochez les lots mis en jeu et lancez le tirage. Les noms défilent puis ralentissent jusqu'à s'arrêter sur l'élu, un lot après l'autre — un gagnant ne peut pas être tiré deux fois. Chaque tirage est archivé avec sa date et son palmarès complet.",
  },
]

export default function Home({ onEnter }) {
  return (
    <div>
      {/* L'en-tête et l'accroche occupent ensemble exactement un écran. */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ borderBottom: '2px solid var(--color-divider)', flex: 'none' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 34, height: 34, background: 'var(--color-accent)', display: 'grid', placeItems: 'center', flex: 'none' }}>
              <IconGift size={18} stroke="var(--color-on-accent)" />
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 17, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {APP_TITLE}
            </div>
            {/* Sur petit écran, le bouton de l'accroche suffit — voir index.css. */}
            <div className="home-header-cta" style={{ marginLeft: 'auto' }}>
              <button className="btn btn-primary" onClick={onEnter} style={{ whiteSpace: 'nowrap' }}>
                Entrer dans la plateforme
              </button>
            </div>
          </div>
        </header>

        {/* — accroche, occupe le reste de l'écran — */}
        <section
          className="home-hero-bg"
          style={{
            flex: 1,
            display: 'flex', alignItems: 'center',
            borderBottom: '2px solid var(--color-divider)',
            backgroundColor: 'var(--color-bg)',
            backgroundImage: 'url("/hero.png")',
            backgroundSize: 'auto 90%',
            backgroundPosition: 'right -40px center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="home-hero" style={{ width: '100%', maxWidth: 1240, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,1fr)' }}>
            <div style={{ padding: '56px 48px 56px 0', minWidth: 0 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                Bienvenue dans
              </div>
              <h1 style={{ margin: '12px 0 0', fontSize: 'clamp(42px, 7.5vw, 76px)', lineHeight: 0.94, letterSpacing: '-0.035em', textTransform: 'uppercase', color: 'var(--color-accent-800)' }}>
                {APP_TITLE}
              </h1>
              <p style={{ margin: '20px 0 0', maxWidth: '44ch', fontSize: 17, lineHeight: 1.5, textWrap: 'pretty', color: 'color-mix(in srgb, var(--color-text) 75%, transparent)' }}>
                Une plateforme pour organiser vos tirages au sort de bout en bout : la liste
                des participants, les lots à gagner, le tirage aléatoire et l'archive complète
                de chaque gagnant.
              </p>
              <button className="btn btn-primary" onClick={onEnter} style={{ marginTop: 28, fontSize: 16, padding: '14px 26px', whiteSpace: 'nowrap' }}>
                Entrer dans la plateforme
                <IconArrowRight size={17} />
              </button>
            </div>
            <div className="home-hero-space" style={{ minWidth: 0 }} />
          </div>
        </section>
      </div>

      {/* — le tuto : une seule section, chaque étape sur une ligne horizontale — */}
      <section style={{ borderBottom: '2px solid var(--color-divider)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '64px 32px 72px' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
            Comment ça marche
          </div>
          <h2 style={{ margin: '10px 0 0', fontSize: 'clamp(28px, 3.4vw, 40px)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            Trois étapes, du premier<br />participant au dernier gagnant
          </h2>

          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="home-step-row"
              style={{
                marginTop: i === 0 ? 44 : 32, paddingTop: i === 0 ? 0 : 32,
                borderTop: i === 0 ? undefined : '1px solid var(--color-divider)',
                display: 'grid', gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 8fr)',
                gap: 40, alignItems: 'center',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--color-accent)' }}>{s.n}</div>
                <h3 style={{ margin: '8px 0 12px', fontSize: 'clamp(20px, 2.2vw, 26px)', lineHeight: 1.1, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                  {s.titre}
                </h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, textWrap: 'pretty', color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}>
                  {s.texte}
                </p>
              </div>

              <div style={{ minWidth: 0 }}>
                <img
                  src={s.image}
                  alt={`Capture d'écran : ${s.titre.toLowerCase()}`}
                  style={{
                    display: 'block', width: '100%', height: 'auto',
                    border: '1px solid var(--color-divider)',
                    boxShadow: '0 14px 40px -22px color-mix(in srgb, var(--color-accent-800) 45%, transparent)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* — clôture — */}
      <section>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '52px 32px 40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: 38, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Prêt à désigner<br />vos gagnants ?
          </h2>
          <button className="btn btn-primary" onClick={onEnter} style={{ fontSize: 17, padding: '16px 28px', whiteSpace: 'nowrap' }}>
            Entrer dans la plateforme
            <IconArrowRight size={18} />
          </button>
        </div>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px 20px', fontSize: 10, color: 'color-mix(in srgb, var(--color-text) 40%, transparent)' }}>
          copyright 2026. Giveaway giveaway. Nofidiana
        </div>
      </section>
    </div>
  )
}
