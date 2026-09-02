import { APP_TITLE } from '../constants'
import { IconGift, IconArrowRight } from './ui/Icons'

/**
 * Vignettes des trois étapes : compositions plates dessinées avec les jetons
 * du système (aplats, angles droits) plutôt que des photographies.
 */
const STEP_ART = {
  participants: (
    <svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="300" height="190" fill="var(--color-surface)" />
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(34 ${30 + i * 46})`}>
          <rect width="34" height="34" fill={i === 0 ? 'var(--color-accent)' : 'var(--color-neutral-400)'} />
          <rect x="48" y="6" width={140 - i * 26} height="9" fill="var(--color-neutral-600)" />
          <rect x="48" y="21" width={96 - i * 18} height="7" fill="var(--color-neutral-400)" />
        </g>
      ))}
      <rect x="34" y="168" width="232" height="2" fill="var(--color-divider)" />
    </svg>
  ),
  lots: (
    <svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="300" height="190" fill="var(--color-surface)" />
      {/* paquet de gauche */}
      <rect x="46" y="104" width="66" height="54" fill="var(--color-neutral-400)" />
      <rect x="42" y="92" width="74" height="13" fill="var(--color-neutral-600)" />
      <rect x="74" y="92" width="10" height="66" fill="var(--color-surface)" />
      {/* paquet central, mis en avant */}
      <rect x="132" y="84" width="86" height="74" fill="var(--color-accent)" />
      <rect x="127" y="69" width="96" height="16" fill="var(--color-accent-700)" />
      <rect x="168" y="69" width="14" height="89" fill="var(--color-surface)" />
      <path d="M175 69 L151 53 L175 53 Z" fill="var(--color-accent-700)" />
      <path d="M175 69 L199 53 L175 53 Z" fill="var(--color-accent-700)" />
      {/* paquet de droite */}
      <rect x="234" y="120" width="48" height="38" fill="var(--color-neutral-600)" />
      <rect x="230" y="110" width="56" height="11" fill="var(--color-neutral-800)" />
      <rect x="253" y="110" width="8" height="48" fill="var(--color-surface)" />
      <rect x="34" y="158" width="238" height="2" fill="var(--color-divider)" />
    </svg>
  ),
  tirage: (
    <svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="300" height="190" fill="var(--color-surface)" />
      <rect x="40" y="122" width="60" height="36" fill="var(--color-neutral-400)" />
      <rect x="112" y="86" width="60" height="72" fill="var(--color-accent)" />
      <rect x="184" y="108" width="60" height="50" fill="var(--color-neutral-600)" />
      <path d="M142 34l7.4 15 16.6 2.4-12 11.7 2.8 16.5-14.8-7.8-14.8 7.8 2.8-16.5-12-11.7 16.6-2.4z" fill="var(--color-accent)" />
      <rect x="40" y="168" width="204" height="2" fill="var(--color-divider)" />
    </svg>
  ),
}

const STEPS = [
  {
    n: '01', art: 'participants', titre: 'Gérer les participants',
    texte: "Nom obligatoire, email facultatif. Recherche instantanée, initiales générées, modification et suppression confirmées.",
  },
  {
    n: '02', art: 'lots', titre: 'Ajouter les lots',
    texte: "Photo, description, quantité et valeur. La quantité fixe le nombre de gagnants ; le total des places est calculé pour vous.",
  },
  {
    n: '03', art: 'tirage', titre: 'Laisser le sort désigner les gagnants',
    texte: "Cochez les lots mis en jeu, lancez le tirage, laissez-le ralentir. Les gagnants sont archivés avec leur date et leur palmarès.",
  },
]

export default function Home({ onEnter }) {
  return (
    <div>
      <header style={{ borderBottom: '2px solid var(--color-divider)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 34, height: 34, background: 'var(--color-accent)', display: 'grid', placeItems: 'center', flex: 'none' }}>
            <IconGift size={18} stroke="var(--color-on-accent)" />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 17, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {APP_TITLE}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-primary" onClick={onEnter} style={{ whiteSpace: 'nowrap' }}>
              Entrer dans la plateforme
            </button>
          </div>
        </div>
      </header>

      {/* — accroche — */}
      <section
        className="home-hero-bg"
        style={{
          borderBottom: '2px solid var(--color-divider)',
          backgroundColor: 'var(--color-bg)',
          backgroundImage: 'url("/hero.png")',
          backgroundSize: 'auto 108%',
          backgroundPosition: 'right -40px center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="home-hero" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,1fr)' }}>
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
          </div>
          <div className="home-hero-space" style={{ minWidth: 0, minHeight: 600 }} />
        </div>
      </section>

      {/* — les trois étapes — */}
      <section style={{ borderBottom: '2px solid var(--color-divider)' }}>
        <div className="home-steps" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }}>
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              style={{
                padding: i === 0 ? '40px 28px 40px 0' : i === 1 ? '40px 28px' : '40px 0 40px 28px',
                borderRight: i < 2 ? '1px solid var(--color-divider)' : undefined,
              }}
            >
              <div style={{ height: 190, minWidth: 0, marginBottom: 20, background: 'var(--color-surface)', overflow: 'hidden' }}>
                {STEP_ART[s.art]}
              </div>
              <div style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--color-accent)' }}>{s.n}</div>
              <h3 style={{ margin: '6px 0' }}>{s.titre}</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'color-mix(in srgb, var(--color-text) 65%, transparent)' }}>{s.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* — clôture — */}
      <section>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '52px 32px 72px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: 38, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Prêt à désigner<br />vos gagnants ?
          </h2>
          <button className="btn btn-primary" onClick={onEnter} style={{ fontSize: 17, padding: '16px 28px', whiteSpace: 'nowrap' }}>
            Entrer dans la plateforme
            <IconArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}
