import { useState } from 'react'
import OfferCard from './OfferCard'

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function OfferCarousel({ offers, heading }) {
  const [index, setIndex] = useState(0)

  const atStart = index === 0
  const atEnd = index === offers.length - 1

  return (
    <div className="confirmation-promo v2-offers">
      <div className="confirmation-promo-header">
        <p className="confirmation-heading">{heading}</p>
        <div className="confirmation-promo-nav">
          <button
            type="button"
            className="confirmation-icon-btn"
            aria-label="Previous offer"
            disabled={atStart}
            aria-disabled={atStart}
            onClick={() => setIndex((i) => i - 1)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="confirmation-icon-btn"
            aria-label="Next offer"
            disabled={atEnd}
            aria-disabled={atEnd}
            onClick={() => setIndex((i) => i + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="confirmation-promo-card">
        <OfferCard offer={offers[index]} />
      </div>
    </div>
  )
}
