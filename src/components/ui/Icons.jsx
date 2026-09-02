/**
 * Jeu d'icônes du système : trait de 2, extrémités carrées, dessiné en ligne.
 * Les angles droits reprennent le rayon nul des jetons de design.
 */

function Icon({ size = 16, width = 2, children, stroke = 'currentColor', ...rest }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth={width} strokeLinecap="square" {...rest}
    >
      {children}
    </svg>
  )
}

export const IconGift = (p) => (
  <Icon {...p}>
    <path d="M20 12v10H4V12" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </Icon>
)

export const IconArrowRight = (p) => (
  <Icon width={2.4} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
)

export const IconArrowLeft = (p) => (
  <Icon width={2.2} {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></Icon>
)

export const IconPlus = (p) => (
  <Icon width={2.4} {...p}><path d="M12 5v14M5 12h14" /></Icon>
)

export const IconSearch = (p) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
)

export const IconClose = (p) => (
  <Icon width={2.2} {...p}><path d="M18 6 6 18M6 6l12 12" /></Icon>
)

export const IconEdit = (p) => (
  <Icon {...p}>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Icon>
)

export const IconTrash = (p) => (
  <Icon {...p}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></Icon>
)

export const IconCheck = (p) => (
  <Icon width={3.4} {...p}><path d="m4 12 5 6L20 6" /></Icon>
)

export const IconImage = (p) => (
  <Icon width={1.8} {...p}>
    <path d="M3 3h18v18H3z" /><path d="m3 16 5-5 4 4 3-3 6 6" />
    <circle cx="8.5" cy="8.5" r="1.5" />
  </Icon>
)

export const IconUpload = (p) => (
  <Icon {...p}><path d="M12 19V5M5 12l7-7 7 7" /></Icon>
)

export const IconUsers = (p) => (
  <Icon width={1.8} {...p}>
    <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </Icon>
)

export const IconTrophy = (p) => (
  <Icon width={1.8} {...p}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" />
  </Icon>
)

export const IconCalendar = (p) => (
  <Icon width={1.8} {...p}>
    <path d="M3 5h18v16H3z" /><path d="M3 10h18M8 3v4M16 3v4" />
  </Icon>
)
