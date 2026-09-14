import { REASSURANCE_RAIL_TITLE, REASSURANCE_RAIL_BODY } from './ReassuranceModal'

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 4.5L6 7.5L9 4.5" stroke="#ce3197" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ClockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" stroke="#0951b6" strokeWidth="1.5" />
    <path d="M8 4.75V8l2.25 1.5" stroke="#0951b6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// The "no checkout timer" reassurance, placed directly under the order total
// where price anxiety peaks. A tinted surface with a nested white tile rather
// than a bordered card, so it recedes into the rail.
function RailReassurance() {
  return (
    <div className="rail-reassurance">
      <div className="rail-reassurance-tile">
        <ClockIcon />
      </div>
      <div className="rail-reassurance-copy">
        <p className="rail-reassurance-title">{REASSURANCE_RAIL_TITLE}</p>
        <p className="rail-reassurance-body">{REASSURANCE_RAIL_BODY}</p>
      </div>
    </div>
  )
}

const SHIPPING_OPTIONS = {
  basic: { label: 'UPS Basic Delivery', cost: 17.50 },
  overnight: { label: 'UPS Overnight Delivery', cost: 34.00 },
}

function PriceBreakdown({ pricing, shippingMethod, railReassurance }) {
  const { dealScore, dealLabel, tickets, fees, taxes } = pricing
  const shipping = shippingMethod ? SHIPPING_OPTIONS[shippingMethod] : null
  const total = tickets.unitPrice * tickets.count + fees.unitPrice * fees.count + taxes + (shipping ? shipping.cost : 0)

  return (
    <div className="price-breakdown">
      {dealScore != null && (
        <div className="deal-score-row">
          <div className="deal-score-badge">
            <span className="deal-score-value">{dealScore}.0</span>
          </div>
          <span className="deal-score-label">{dealLabel}</span>
        </div>
      )}

      <div className="price-row">
        <span className="price-row-label">Tickets</span>
        <span className="price-row-value">
          ${tickets.unitPrice.toFixed(2)} x {tickets.count}
        </span>
      </div>

      <div className="price-row">
        <span className="price-row-label">Fees</span>
        <span className="price-row-value">
          ${fees.unitPrice.toFixed(2)} x {fees.count}
        </span>
      </div>

      {shipping && (
        <div className="price-row">
          <span className="price-row-label">{shipping.label}</span>
          <span className="price-row-value">${shipping.cost.toFixed(2)}</span>
        </div>
      )}

      <div className="price-row">
        <span className="price-row-label">Taxes</span>
        <span className="price-row-value">${taxes.toFixed(2)}</span>
      </div>

      <button className="promo-link">
        <span>Add gift card or promo code</span>
        <ChevronDown />
      </button>

      <div className="price-row price-row--total">
        <span className="price-row-label">Total</span>
        <span className="price-row-value">${total.toFixed(2)}</span>
      </div>

      {railReassurance && <RailReassurance />}
    </div>
  )
}

export default function Sidebar({ event, pricing, ticketDetails, selectedShipping, ticketType, railReassurance = false }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-gallery">
        <div className="sidebar-event-image-placeholder" />
        <div className="sidebar-image-nav">
          <button className="sidebar-nav-btn sidebar-nav-btn--prev" aria-label="Previous image">
            <ChevronLeft />
          </button>
          <button className="sidebar-nav-btn sidebar-nav-btn--next" aria-label="Next image">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="sidebar-event-details">
        <p className="sidebar-event-name">{event.name}</p>
        <p className="sidebar-event-meta">{event.date}</p>
        <p className="sidebar-event-meta">{event.venue}</p>
      </div>

      <PriceBreakdown pricing={pricing} shippingMethod={selectedShipping} railReassurance={railReassurance} />

      <div className="sidebar-divider" />

      <div className="ticket-summary">
        <div className="ticket-info-group">
          <p className="ticket-info-title">{ticketDetails.section}</p>
          <p className="ticket-info-desc">{ticketDetails.quantity} Tickets</p>
        </div>
        <div className="ticket-info-group">
          <p className="ticket-info-title">Seat Perks</p>
          <p className="ticket-info-desc">{ticketDetails.perks}</p>
        </div>
        {ticketType !== 'e-ticket' && (
          <div className="ticket-info-group">
            <p className="ticket-info-title">{ticketDetails.delivery}</p>
            <p className="ticket-info-desc">{ticketDetails.deliveryNote}</p>
          </div>
        )}
        <div className="ticket-info-group">
          <p className="ticket-info-title">In Hand Date</p>
          <p className="ticket-info-desc">{ticketDetails.inHandDate}</p>
        </div>
      </div>

      <div className="sidebar-divider" />

      <div className="paypal-promo">
        <div className="paypal-message">
          <span className="paypal-wordmark">
            <span className="paypal-wordmark-pay">Pay</span>
            <span className="paypal-wordmark-pal">Pal</span>
          </span>
          <span className="paypal-amount">As low as $307.44/mo</span>
          <a href="#" className="paypal-learn-more">Learn more</a>
        </div>
        <p className="paypal-disclaimer">This Excludes Insurance.</p>
      </div>
    </aside>
  )
}
