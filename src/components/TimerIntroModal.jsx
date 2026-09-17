import Modal from './Modal'
import TimerPill from './TimerPill'
import { formatMMSS } from '../hooks/useCountdown'

// Copy for the countdown explainer. Nothing is actually held for the user, so the
// framing is the live-marketplace reality: after the window closes we re-check that
// the tickets are still there at this price. Kept to a headline, the clock pill and
// three short sentences, since this sits between the user and the checkout form. The
// headline frames the window as room to work rather than a deadline; the body carries
// the reason and then closes the loop on what expiry actually means (the timer just
// restarts if nobody bought the seats), because "we re-check" alone left testers
// asking what happens next. Duration is read off the pill rather than named in prose.
export const TIMER_INTRO_HEADLINE = 'Secure your tickets with time to spare'
export const TIMER_INTRO_BODY =
  "Availability changes fast on a live marketplace. When the timer ends we'll re-check if your seats are still available. If no one has purchased them, the timer will simply restart."
export const TIMER_INTRO_CTA = 'Got it, start checkout'

// Shown once on the first post-login step to give the header countdown a reason
// to exist. Thin wrapper around the shared Modal so it inherits the standard
// look/animation. The clock here is static: the flow starts the real countdown
// when this closes, so every dismissal path (button, close, backdrop) is the same.
export default function TimerIntroModal({ minutes, onClose }) {
  return (
    <Modal
      title={TIMER_INTRO_HEADLINE}
      onClose={onClose}
      onSubmit={onClose}
      submitLabel={TIMER_INTRO_CTA}
      className="modal--centered"
    >
      <div className="timer-intro-clock">
        <TimerPill label={formatMMSS(minutes * 60)} large />
      </div>
      <p className="reassurance-body">{TIMER_INTRO_BODY}</p>
    </Modal>
  )
}
