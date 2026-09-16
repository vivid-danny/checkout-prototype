const ClockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.75" />
    <path d="M8 4.5V8l2.4 1.55" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// The shared treatment for the checkout countdown: the navbar clock and the static
// starting time inside the countdown explainer modal, so the two can't drift apart.
// `large` is the modal size, where the pill is the focal point rather than a status
// chip in the navbar.
export default function TimerPill({ label, large = false }) {
  return (
    <span className={`timer-pill${large ? ' timer-pill--lg' : ''}`}>
      <span className="timer-pill-badge">
        <ClockIcon />
      </span>
      <span className="timer-pill-text">{label}</span>
    </span>
  )
}
