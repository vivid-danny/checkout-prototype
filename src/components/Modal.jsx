import { useEffect, useState } from 'react'

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function Modal({ title, onClose, onSubmit, submitLabel, children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setOpen(true))
  }, [])

  const handleClose = () => {
    setOpen(false)
    setTimeout(onClose, 180)
  }

  return (
    <div className={`modal-overlay${open ? ' modal-overlay--open' : ''}`} onClick={handleClose}>
      <div className={`modal${open ? ' modal--open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <p className="modal-title">{title}</p>
          <button className="modal-close" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-scroll-body">
          {children}
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onSubmit}>{submitLabel}</button>
        </div>
      </div>
    </div>
  )
}
