export default function Header({ progress = 'Step 1 of 2' }) {
  return (
    <header className="header">
      <div className="header-inner">
        <img src="/logo.svg" alt="VividSeats" className="header-logo" />
        <div className="header-progress">
          <span className="header-progress-label">Checkout</span>
          <span className="header-progress-dot">•</span>
          <span className="header-progress-step">{progress}</span>
        </div>
      </div>
    </header>
  )
}
