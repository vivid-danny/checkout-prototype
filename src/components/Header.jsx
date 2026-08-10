export default function Header({ progress = 'Step 1 of 2', title }) {
  return (
    <header className="header">
      <div className="header-inner">
        <img src="/logo.svg" alt="VividSeats" className="header-logo" />
        <div className="header-progress">
          {title ? (
            <span className="header-progress-step">{title}</span>
          ) : (
            <>
              <span className="header-progress-label">Checkout</span>
              <span className="header-progress-dot">•</span>
              <span className="header-progress-step">{progress}</span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
