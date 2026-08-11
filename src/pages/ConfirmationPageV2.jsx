import Header from '../components/Header'
import Footer from '../components/Footer'
import OfferCarousel from '../components/OfferCarousel'
import { OFFERS } from '../data/offers'
import { formatAddress } from '../utils/address'

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

const FAQ_ITEMS = [
  'How will I get my tickets?',
  'How can I track my order status?',
  'What if I have any other questions?',
]

export default function ConfirmationPageV2({
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
      ? <>Tickets are ready by <strong>{ticketDetails.inHandBy}</strong> (likely sooner).</>
      : <>{ticketDetails.inHandDate}.</>
  )

  return (
    <div className="checkout-page">
      <Header title="Order Confirmation" />

      <section className="v2-hero">
        <div className="v2-hero-bg" aria-hidden="true">
          <img src="/hero-poly-large.svg" alt="" className="v2-hero-poly v2-hero-poly--large" />
          <img src="/hero-poly-small.svg" alt="" className="v2-hero-poly v2-hero-poly--small" />
        </div>
        <div className="v2-hero-inner">
          <div className="v2-hero-image" />
          <div className="v2-hero-content">
            <span className="v2-badge">
              <img src="/icon-check.svg" alt="" className="v2-badge-icon" />
              Order {orderNumber} Submitted
            </span>
            <div className="v2-hero-title-group">
              <h1 className="v2-hero-title">You're going to {event.name}!</h1>
              <p className="v2-hero-subtitle">
                {ticketDetails.quantity} Tickets in {ticketDetails.section} – get ready to have an amazing time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="checkout-main">
        <div className="v2-content">
          <div className="v2-panel">
            <div className="v2-panel-col">
              <p className="confirmation-heading">So what happens next?</p>
              <div className="confirmation-timeline-list v2-timeline">
                {timelineItems.map((content, i) => (
                  <div key={i} className="confirmation-timeline-item">
                    <span className="confirmation-timeline-dot" />
                    <p>{content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="v2-app-card">
              <div className="v2-app-content">
                <div className="v2-app-header">
                  <p className="confirmation-heading">
                    Get access to your tickets,<br />
                    <span className="v2-app-heading-accent">only in the app</span>
                  </p>
                  <p className="confirmation-subtext">Download the app to use your tickets and get order updates. Scan the QR code to get started.</p>
                </div>
                <div className="confirmation-app-buttons">
                  <img src="/app-store-badge.svg" alt="Download on the App Store" className="confirmation-app-badge" />
                  <img src="/google-play-badge.svg" alt="Get it on Google Play" className="confirmation-app-badge" />
                </div>
              </div>
              <img src="/confirmation-qr.svg" alt="QR code to download the Vivid Seats app" className="confirmation-app-qr" />
            </div>
          </div>

          <div className="v2-columns">
            <div className="checkout-left confirmation-left">
              <div className="confirmation-faq">
                <p className="confirmation-heading">FAQ</p>
                <div className="v2-faq-list">
                  {FAQ_ITEMS.map((question) => (
                    <div key={question} className="v2-faq-item">
                      <p className="v2-faq-question">{question}</p>
                      <span className="confirmation-faq-chevron" aria-hidden="true"><ChevronDown /></span>
                    </div>
                  ))}
                </div>
              </div>

              <OfferCarousel offers={OFFERS} heading="Offers just for you" />
            </div>

            <aside className="sidebar v2-sidebar">
              <p className="confirmation-heading">Order Summary</p>
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
                <div className="ticket-info-group">
                  <p className="ticket-info-title">{event.name}</p>
                  <p className="ticket-info-desc">{event.date}</p>
                </div>
                <div className="ticket-info-group">
                  <p className="ticket-info-title">{venueName}</p>
                  <p className="ticket-info-desc">{venueLocation}</p>
                </div>
                <div className="ticket-info-group">
                  <p className="ticket-info-title">{ticketDetails.section}</p>
                  <p className="ticket-info-desc">{ticketDetails.quantity} Tickets, ${pricing.tickets.unitPrice.toFixed(2)} each</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
