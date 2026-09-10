import Modal from './Modal'

// Copy for the "you won't be timed" reassurance message. Defined once so the
// modal variant (headline + body) and the right-rail card (title + short body)
// stay in sync. They're two placements of the same message.
export const REASSURANCE_HEADLINE = 'Take your time, no checkout timer'
export const REASSURANCE_BODY =
  "No timers here. Review your tickets carefully and proceed when you're ready. If they sell out while you're in checkout, we'll give you a heads up so you can adjust your options."
export const REASSURANCE_RAIL_TITLE = 'Take your time'
export const REASSURANCE_RAIL_BODY =
  'No checkout timer. We will tell you if anything about your tickets changes.'

// A shown-once, dismissible modal at the start of checkout. Thin wrapper around
// the shared Modal so it inherits the standard look/animation. The single
// button just dismisses (same as close/backdrop).
export default function ReassuranceModal({ onClose }) {
  return (
    <Modal
      title={REASSURANCE_HEADLINE}
      onClose={onClose}
      onSubmit={onClose}
      submitLabel="Got it, continue"
    >
      <p className="reassurance-body">{REASSURANCE_BODY}</p>
    </Modal>
  )
}
