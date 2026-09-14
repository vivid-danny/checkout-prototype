const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 4.75V8l2.25 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Header({ progress = 'Step 1 of 2', title, timerDisplay, message }) {
  return (
    <header className="header">
      <div className="header-inner">
        <img src="/logo.svg" alt="VividSeats" className="header-logo" />
        {message && (
          <div className="header-message">
            <ClockIcon />
            <span>{message}</span>
          </div>
        )}
        <div className="header-progress">
          {title ? (
            <span className="header-progress-step">{title}</span>
          ) : (
            <>
              <span className="header-progress-label">Checkout</span>
              <span className="header-progress-dot">•</span>
              <span className="header-progress-step">{progress}</span>
              {timerDisplay && (
                <span className="header-timer">⏱ {timerDisplay}</span>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
