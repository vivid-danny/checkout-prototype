// Content only — no frame, no heading. The consumer supplies the container, so this drops
// straight into a carousel card or a modal body without anything to un-style.
// onDecline is optional: seed 1's modal sequence advances on it, while seed 2's carousel passes
// nothing, so there both buttons stay inert and only the arrows navigate.
export default function OfferCard({ offer, onDecline }) {
  return (
    <>
      <div className="confirmation-promo-content">
        <div className="confirmation-promo-text">
          <p className="confirmation-promo-headline">{offer.headline}</p>
          <p className="confirmation-promo-body">{offer.body}</p>
        </div>
        <img
          src={offer.logo.src}
          alt={offer.logo.alt}
          width={offer.logo.width}
          height={offer.logo.height}
          className="confirmation-promo-logo"
        />
      </div>
      <div className="confirmation-promo-cta">
        <button type="button" className="confirmation-promo-btn confirmation-promo-btn--primary">{offer.primaryCta}</button>
        <button type="button" className="confirmation-promo-btn confirmation-promo-btn--secondary" onClick={onDecline}>No Thanks</button>
      </div>
    </>
  )
}
