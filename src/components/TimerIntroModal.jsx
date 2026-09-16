import Modal from './Modal'
import TimerPill from './TimerPill'
import { formatMMSS } from '../hooks/useCountdown'

// Copy for the countdown explainer. Nothing is actually held for the user, so the
// framing is the live-marketplace reality: after the window closes we re-check that
// the tickets are still there at this price. Kept to a headline, the clock pill and
// one sentence, since this sits between the user and the checkout form. The headline
// frames the window as room to work rather than a deadline; the body carries the
// reason, and the duration is read off the pill rather than spelled out in prose.
export const TIMER_INTRO_HEADLINE = 'Secure your tickets with time to spare'
export const TIMER_INTRO_BODY =
  'Vivid Seats is a live marketplace and ticket availability can change quickly. When the timer runs out we re-check that your tickets are still available at this price.'
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
