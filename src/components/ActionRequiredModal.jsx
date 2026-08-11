import { useEffect, useRef, useState } from 'react'

const EXIT_MS = 180

export default function ActionRequiredModal({ onClose }) {
  const [entered, setEntered] = useState(false)
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    panelRef.current?.focus({ preventScroll: true })
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timerRef.current)
    }
  }, [])

  const handleClose = () => {
    if (exiting) return
    setExiting(true)
    timerRef.current = setTimeout(onClose, EXIT_MS)
  }

  const open = entered && !exiting

  return (
    <div className={`modal-overlay${open ? ' modal-overlay--open' : ''}`}>
      <div
        ref={panelRef}
        className={`modal action-required-modal${open ? ' modal--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Action required"
        tabIndex={-1}
      >
        <div className="action-required-gif">
          <img src="/track.gif" alt="" aria-hidden="true" />
        </div>
        <div className="action-required-content">
          <h2 className="action-required-heading">Action Required!</h2>
          <p className="action-required-body">
            Download the app to track your tickets, receive order updates, earn rewards, &amp; so much more.
          </p>
          <p className="action-required-body">Scan the QR code to download now:</p>
          <img
            src="/action-required-qr.svg"
            alt="QR code to download the Vivid Seats app"
            className="action-required-qr"
          />
        </div>
        <button
          className="action-required-close"
          onClick={handleClose}
          aria-label="Close"
        >
          <img src="/icon-close-action.svg" alt="" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
