// Logo URL from Figma — valid for 7 days from project creation
const LOGO_URL = 'https://www.figma.com/api/mcp/asset/c68490cf-0155-4869-a4ba-fc5f83b5f049'

export default function Header({ progress = 'Step 1 of 2' }) {
  return (
    <header className="header">
      <div className="header-inner">
        <img src={LOGO_URL} alt="VividSeats" className="header-logo" />
        <div className="header-progress">
          <span className="header-progress-label">Checkout</span>
          <span className="header-progress-dot">•</span>
          <span className="header-progress-step">{progress}</span>
        </div>
      </div>
    </header>
  )
}
