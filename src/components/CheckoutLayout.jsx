import Header from './Header'
import BuyerGuaranteeBanner from './BuyerGuaranteeBanner'
import Footer from './Footer'
import Sidebar from './Sidebar'

// `responsive` opts a step into the mobile layout (see the RESPONSIVE section of
// index.css). It is opt-in per step so pages that have no mobile design yet keep
// the fixed 1440px desktop shell and render exactly as before.
export default function CheckoutLayout({ progress, event, pricing, ticketDetails, selectedShipping, ticketType, timerDisplay, headerMessage, railReassurance = false, responsive = false, children }) {
  return (
    <div className={responsive ? 'checkout-page checkout-page--responsive' : 'checkout-page'}>
      <Header progress={progress} timerDisplay={timerDisplay} message={headerMessage} />
      <BuyerGuaranteeBanner />
      <main className="checkout-main">
        <div className="checkout-container">
          <div className="checkout-left">
            {children}
          </div>
          <Sidebar
            event={event}
            pricing={pricing}
            ticketDetails={ticketDetails}
            selectedShipping={selectedShipping}
            ticketType={ticketType}
            railReassurance={railReassurance}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
