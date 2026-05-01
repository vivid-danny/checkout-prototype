import Header from './Header'
import BuyerGuaranteeBanner from './BuyerGuaranteeBanner'
import Footer from './Footer'
import Sidebar from './Sidebar'

export default function CheckoutLayout({ progress, event, pricing, ticketDetails, selectedShipping, ticketType, children }) {
  return (
    <div className="checkout-page">
      <Header progress={progress} />
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
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
