// Content only — no frame, no heading. The consumer supplies the container, so this drops
// straight into a carousel card or a modal body without anything to un-style.
export default function OfferCard({ offer }) {
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
        <button type="button" className="confirmation-promo-btn confirmation-promo-btn--secondary">No Thanks</button>
      </div>
    </>
  )
}
