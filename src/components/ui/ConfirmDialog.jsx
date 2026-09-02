import { useEffect } from 'react'

/**
 * Boîte de confirmation partagée : même gabarit pour toutes les suppressions.
 */
export default function ConfirmDialog({ title, body, cta = 'Supprimer', onConfirm, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="dialog-backdrop" style={{ zIndex: 50 }} onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label={title}>
        <div className="dialog-title">{title}</div>
        <div className="dialog-body">{body}</div>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm}>{cta}</button>
        </div>
      </div>
    </div>
  )
}
