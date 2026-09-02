import { useApp } from '../context/AppContext'
import { APP_TITLE } from '../constants'
import { IconGift, IconArrowLeft } from './ui/Icons'

export default function Navbar({ activeTab, tabs, onTabChange, onHome }) {
  const { participants, lots, historique } = useApp()

  const counts = {
    participants: participants.length,
    lots: lots.length,
    resultats: historique.length,
  }

  return (
    <header style={{ padding: '22px 32px 0', borderBottom: '2px solid var(--color-divider)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        <div style={{ width: 38, height: 38, background: 'var(--color-accent)', display: 'grid', placeItems: 'center', flex: 'none' }}>
          <IconGift size={20} stroke="var(--color-on-accent)" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 23, lineHeight: 1.05, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            {APP_TITLE}
          </div>
          <div style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            Gérez vos participants, lots et tirages
          </div>
        </div>
        <div style={{ marginLeft: 'auto', paddingBottom: 2 }}>
          <button className="btn btn-secondary" onClick={onHome}>
            <IconArrowLeft size={15} />
            Accueil
          </button>
        </div>
      </div>

      <nav style={{ maxWidth: 1120, margin: '22px auto 0', display: 'flex', gap: 36, flexWrap: 'wrap' }}>
        {tabs.map(tab => {
          const actif = activeTab === tab.id
          const badge = counts[tab.id]
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={actif ? 'page' : undefined}
              style={{
                appearance: 'none', background: 'transparent', border: 0,
                borderBottom: `3px solid ${actif ? 'var(--color-accent)' : 'transparent'}`,
                marginBottom: -2, padding: '0 0 13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 9,
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 13,
                letterSpacing: '0.09em', textTransform: 'uppercase',
                color: actif ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-text) 55%, transparent)',
              }}
            >
              {tab.label}
              {badge > 0 && (
                <span style={{ fontSize: 10, letterSpacing: '0.04em', padding: '1px 6px', background: 'var(--color-accent-200)', color: 'var(--color-accent-800)' }}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
