import Header from '../components/Header'
import Footer from '../components/Footer'
import { formatAddress } from '../utils/address'

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
    <path d="M3 4.5L6 7.5L9 4.5" stroke="#717488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PAYMENT_LABELS = {
  'credit-card': 'Credit Card',
  'apple-pay': 'Apple Pay',
  paypal: 'PayPal',
  klarna: 'Klarna',
  bnpl: 'Buy Now, Pay Later by PayPal',
}

// Promotional offers are hidden pending a design revisit — flip to true to restore.
const SHOW_PROMOS = false

const FAQ_ITEMS = [
  'How will I get my tickets?',
  'How can I track my order status?',
  'What if I have any other questions?',
]

export default function ConfirmationPage({
  email,
  shippingForm,
  selectedPayment,
  cardData,
  event,
  pricing,
  ticketDetails,
  orderNumber,
  ticketType,
}) {
  const isShipped = ticketType !== 'e-ticket'

  const paymentLabel = selectedPayment === 'credit-card' && cardData
    ? `****${cardData.lastFour}, Expires: ${cardData.expiry}`
    : PAYMENT_LABELS[selectedPayment] || 'Not selected'

  const orderTotal = pricing.tickets.unitPrice * pricing.tickets.count
    + pricing.fees.unitPrice * pricing.fees.count
    + pricing.taxes

  const [venueName, ...cityParts] = event.venue.split(', ')
  const venueLocation = cityParts.join(', ')

  const timelineItems = []
  if (isShipped) {
    timelineItems.push(<>Our team handles the remaining logistics.</>)
  }
  timelineItems.push(
    <>Download the <span className="confirmation-highlight">Vivid Seats app</span> to get order updates.</>
  )
  timelineItems.push(
    <><span className="confirmation-highlight">Buy parking</span> if you're planning on driving.</>
  )
  timelineItems.push(
    isShipped
      ? <>Tickets are ready by {ticketDetails.inHandBy} (likely sooner).</>
      : <>{ticketDetails.inHandDate}.</>
  )

  return (
    <div className="checkout-page">
      <Header title="Order Confirmation" />
      <main className="checkout-main">
        <div className="checkout-container">
          <div className="checkout-left confirmation-left">
            <h1 className="confirmation-title">Your order is in!</h1>

            <div className="confirmation-timeline">
              <div className="confirmation-timeline-header">
                <p className="confirmation-heading">It's time to experience it live. Get ready to see {event.name}.</p>
                <p className="confirmation-subtext">So what happens next?</p>
              </div>
              <div className="confirmation-timeline-list">
                {timelineItems.map((content, i) => (
                  <div key={i} className={`confirmation-timeline-item${i === 0 ? ' confirmation-timeline-item--active' : ''}`}>
                    <span className="confirmation-timeline-dot" />
                    <p>{content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="confirmation-app-card">
              <div className="confirmation-app-content">
                <div className="confirmation-app-header">
                  <p className="confirmation-heading">Get access to your tickets, only in the app</p>
                  <p className="confirmation-subtext">Download the app to track your tickets and receive order updates. Scan the QR code to get started.</p>
                </div>
                <div className="confirmation-app-buttons">
                  <img src="/app-store-badge.svg" alt="Download on the App Store" className="confirmation-app-badge" />
                  <img src="/google-play-badge.svg" alt="Get it on Google Play" className="confirmation-app-badge" />
                </div>
              </div>
              <img src="/confirmation-qr.svg" alt="QR code to download the Vivid Seats app" className="confirmation-app-qr" />
            </div>

            {SHOW_PROMOS && (
            <div className="confirmation-promo">
              <div className="confirmation-promo-header">
                <p className="confirmation-heading">Promotional offers just for you</p>
                <div className="confirmation-promo-nav">
                  <button className="confirmation-icon-btn" aria-label="Previous offer"><ChevronLeft /></button>
                  <button className="confirmation-icon-btn" aria-label="Next offer"><ChevronRight /></button>
                </div>
              </div>
              <div className="confirmation-promo-card">
                <div className="confirmation-promo-content">
                  <div className="confirmation-promo-text">
                    <p className="confirmation-promo-headline">Get over 100 million songs on Apple Music free for 1 month!</p>
                    <p className="confirmation-promo-body">You'll never hear a commercial and you can download anything for offline listening.</p>
                  </div>
                  <img src="/apple-music-logo.png" alt="Apple Music" className="confirmation-promo-logo" />
                </div>
                <div className="confirmation-promo-cta">
                  <button className="confirmation-promo-btn confirmation-promo-btn--primary">Join Now</button>
                  <button className="confirmation-promo-btn confirmation-promo-btn--secondary">No Thanks</button>
                </div>
              </div>
            </div>
            )}

            <div className="confirmation-divider" />

            <div className="confirmation-faq">
              <p className="confirmation-heading">FAQ</p>
              <div className="confirmation-faq-list">
                {FAQ_ITEMS.map((question) => (
                  <div key={question} className="confirmation-faq-item">
                    <p className="confirmation-faq-question">{question}</p>
                    <span className="confirmation-faq-chevron" aria-hidden="true"><ChevronDown /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="sidebar">
            <div className="sidebar-gallery">
              <div className="sidebar-event-image-placeholder" />
              <div className="confirmation-gallery-nav">
                <button className="sidebar-nav-btn sidebar-nav-btn--prev" aria-label="Previous image">
                  <ChevronLeft />
                </button>
                <button className="sidebar-nav-btn sidebar-nav-btn--next" aria-label="Next image">
                  <ChevronRight />
                </button>
              </div>
            </div>

            <p className="confirmation-heading">Order Summary</p>
            <div className="sidebar-divider" />

            <div className="ticket-summary">
              <div className="ticket-info-group">
                <p className="ticket-info-title">Order Number</p>
                <p className="ticket-info-desc">{orderNumber}</p>
              </div>
              <div className="ticket-info-group">
                <p className="ticket-info-title">Email</p>
                <p className="ticket-info-desc">{email}</p>
              </div>
              <div className="ticket-info-group">
                <p className="ticket-info-title">Order Total</p>
                <p className="ticket-info-desc">${orderTotal.toFixed(2)}</p>
              </div>
              <div className="ticket-info-group">
                <p className="ticket-info-title">Payment</p>
                <p className="ticket-info-desc">{paymentLabel}</p>
              </div>
              {isShipped && (
                <div className="ticket-info-group">
                  <p className="ticket-info-title">Shipping Address</p>
                  <p className="ticket-info-desc">{formatAddress(shippingForm)}</p>
                </div>
              )}
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-event-details">
              <p className="sidebar-event-name">{event.name}</p>
              <p className="sidebar-event-meta">{event.date}</p>
            </div>
            <div className="sidebar-event-details">
              <p className="sidebar-event-name">{venueName}</p>
              <p className="sidebar-event-meta">{venueLocation}</p>
            </div>

            <div className="ticket-summary">
              <div className="ticket-info-group">
                <p className="ticket-info-title">{ticketDetails.section}</p>
                <p className="ticket-info-desc">{ticketDetails.quantity} Tickets, ${pricing.tickets.unitPrice.toFixed(2)} each</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
