import { APP_TITLE } from '../../constants'
import { IconGift } from './Icons'

/**
 * Écran d'attente affiché le temps que les illustrations de l'application
 * soient en cache, pour que l'interface apparaisse d'un seul tenant.
 */
export default function EcranChargement({ chargees, total }) {
  const progression = total > 0 ? chargees / total : 1

  return (
    <div
      role="status" aria-live="polite"
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 22,
        padding: 32, background: 'var(--color-bg)',
      }}
    >
      <div style={{ width: 54, height: 54, background: 'var(--color-accent)', display: 'grid', placeItems: 'center' }}>
        <IconGift size={28} stroke="var(--color-on-accent)" />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 26, lineHeight: 1.05, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
          {APP_TITLE}
        </div>
        <div style={{ fontSize: 13, marginTop: 6, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
          Chargement…
        </div>
      </div>

      <div style={{ width: 'min(260px, 100%)', height: 4, background: 'var(--color-divider)' }}>
        <div
          style={{
            width: `${progression * 100}%`, height: '100%',
            background: 'var(--color-accent)', transition: 'width .25s',
          }}
        />
      </div>
    </div>
  )
}
