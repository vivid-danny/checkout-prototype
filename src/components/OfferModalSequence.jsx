import { useEffect, useRef, useState } from 'react'
import OfferCard from './OfferCard'

const FADE_MS = 150 // must match .offer-modal-body transition
const EXIT_MS = 180 // must match .modal-overlay / .modal transition

// Seed 1's production-style offer gauntlet: the tester walks all four offers via "No Thanks".
// Deliberately NOT built on Modal.jsx — that fades its overlay and panel together and unmounts
// per instance, so four in a row would flicker the backdrop between every offer. Here one
// overlay stays mounted for the whole sequence and only the panel's contents cross-fade.
export default function OfferModalSequence({ offers, onComplete }) {
  const [index, setIndex] = useState(0)
  const [entered, setEntered] = useState(false)
  const [fading, setFading] = useState(false)
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    // Warm the cache so an advance never paints a half-loaded logo: the <img> node is reused
    // across offers, so changing src would otherwise drop the old bitmap while fetching.
    offers.forEach((offer) => {
      const img = new Image()
      img.src = offer.logo.src
    })
    // preventScroll matters — focusing a tabIndex={-1} node can scroll the page behind the
    // backdrop, which is the exact movement this component exists to avoid.
    panelRef.current?.focus({ preventScroll: true })
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timerRef.current)
    }
  }, [offers])

  // Guard swallows double-clicks, so an offer can never be skipped and only one timer is ever live.
  const handleDecline = () => {
    if (fading || exiting) return

    if (index === offers.length - 1) {
      setExiting(true)
      timerRef.current = setTimeout(onComplete, EXIT_MS)
      return
    }

    setFading(true)
    timerRef.current = setTimeout(() => {
      // React 18 batches these into ONE commit, so the new offer and the removed --fading class
      // land in the same paint, starting from the already-painted opacity: 0. Without batching
      // (React 17) the new content would flash at full opacity for a frame.
      setIndex((i) => i + 1)
      setFading(false)
    }, FADE_MS)
  }

  const open = entered && !exiting

  return (
    // No onClick on the overlay and no onKeyDown anywhere: backdrop clicks and Escape must NOT
    // dismiss, so the correct behavior is achieved by not attaching listeners. Don't "fix" this.
    // Out of scope by choice: focus trap, aria-hidden on background content, aria-live on swaps.
    <div className={`modal-overlay${open ? ' modal-overlay--open' : ''}`}>
      <div
        ref={panelRef}
        className={`modal${open ? ' modal--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Special offer"
        tabIndex={-1}
      >
        {/* Stable node — a key here would remount it, losing the opacity to transition from. */}
        <div className={`offer-modal-body${fading ? ' offer-modal-body--fading' : ''}`}>
          <OfferCard offer={offers[index]} onDecline={handleDecline} />
        </div>
      </div>
    </div>
  )
}
