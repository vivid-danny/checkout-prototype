import Modal from './Modal'

// Copy for the "you won't be timed" reassurance message. Defined once so the
// modal variant (headline + body) and the inline header variant (short line)
// stay in sync — they're two placements of the same message.
export const REASSURANCE_HEADLINE = 'Take your time — no checkout timer'
export const REASSURANCE_BODY =
  "Other sites put you on the clock and pressure you to rush. We don't. Your seats are held while you check out, so review everything at your own pace."
export const REASSURANCE_INLINE = 'No timer — take your time'

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
