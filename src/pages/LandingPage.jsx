import { Link } from 'react-router-dom'
import { VARIANTS } from '../experiments/registry'

// Index of every checkout experiment, generated from the variant registry.
// Testers can browse from here, or the per-variant URLs can be shared directly.
export default function LandingPage() {
  const groups = VARIANTS.reduce((acc, variant) => {
    (acc[variant.group] ??= []).push(variant)
    return acc
  }, {})

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1 className="landing-title">Checkout Prototype Experiments</h1>
        <p className="landing-subtitle">
          Pick a variation to walk through. Each one has its own shareable URL for user testing.
        </p>
      </header>

      <main className="landing-main">
        {Object.entries(groups).map(([group, variants]) => (
          <section key={group} className="landing-group">
            <h2 className="landing-group-title">{group}</h2>
            <div className="landing-cards">
              {variants.map((variant) => (
                <Link
                  key={variant.id}
                  to={`/${variant.id}/checkout/login`}
                  className="landing-card"
                >
                  <span className="landing-card-name">{variant.name}</span>
                  <span className="landing-card-desc">{variant.description}</span>
                  <span className="landing-card-url">/{variant.id}/checkout</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
