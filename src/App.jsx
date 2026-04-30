import { useState, useRef } from 'react'
import CheckoutLayout from './components/CheckoutLayout'
import PrototypeControls from './components/PrototypeControls'
import LoginPage from './pages/LoginPage'
import ShippingPage from './pages/ShippingPage'
import PaymentPage from './pages/PaymentPage'

const ORDER = {
  event: {
    name: 'New York Knicks at Chicago Bulls',
    date: 'Wednesday January 15 at 7:00pm',
    venue: 'United Center, Chicago, IL',
  },
  pricing: {
    dealScore: 10,
    dealLabel: 'Fantastic Deal',
    tickets: { count: 2, unitPrice: 100 },
    fees: { count: 2, unitPrice: 25 },
    taxes: 0,
    total: 250,
  },
  ticketDetails: {
    section: 'Lower Level 105, Row 11',
    quantity: 2,
    perks: 'Front of Section, Unlimited Food & Beverage',
    delivery: 'Shipped via UPS',
    deliveryNote: 'Tickets delivered to your address',
    inHandDate: 'Tickets delivered by January 13, 2026',
  },
}

const PROGRESS = {
  login: 'Step 1 of 3',
  shipping: 'Step 2 of 3',
  payment: 'Step 3 of 3',
}

const EMPTY_FORM = {
  name: '', phone: '', addressLine1: '', city: '', postalCode: '', state: '', country: '',
}

export default function App() {
  const [page, setPage] = useState('login')
  const [email, setEmail] = useState('')
  const [shippingForm, setShippingForm] = useState(EMPTY_FORM)
  const [selectedShipping, setSelectedShipping] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [cardData, setCardData] = useState(null)
  const shippingRef = useRef(null)
  const paymentRef = useRef(null)

  const reset = () => {
    setPage('login')
    setEmail('')
    setShippingForm(EMPTY_FORM)
    setSelectedShipping(null)
    setSelectedPayment(null)
    setCardData(null)
  }

  const controls = {
    login: [],
    shipping: [
      { label: 'Fill Address Form', onClick: () => shippingRef.current?.fillAddress() },
    ],
    payment: [
      { label: 'Fill Credit Card', onClick: () => paymentRef.current?.fillCard() },
      { label: 'Fill Address', onClick: () => paymentRef.current?.fillAddress() },
    ],
  }

  return (
    <>
      <CheckoutLayout
        progress={PROGRESS[page]}
        event={ORDER.event}
        pricing={ORDER.pricing}
        ticketDetails={ORDER.ticketDetails}
        selectedShipping={page === 'payment' ? selectedShipping : null}
      >
        {page === 'login' && (
          <LoginPage
            email={email}
            onContinue={(e) => { setEmail(e); setPage('shipping') }}
          />
        )}
        {page === 'shipping' && (
          <ShippingPage
            ref={shippingRef}
            form={shippingForm}
            setForm={setShippingForm}
            selectedShipping={selectedShipping}
            setSelectedShipping={setSelectedShipping}
            onContinue={() => setPage('payment')}
          />
        )}
        {page === 'payment' && (
          <PaymentPage
            ref={paymentRef}
            email={email}
            shippingForm={shippingForm}
            cardData={cardData}
            setCardData={setCardData}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            onGoToLogin={() => setPage('login')}
            onGoToShipping={() => setPage('shipping')}
          />
        )}
      </CheckoutLayout>
      <PrototypeControls actions={controls[page]} onReset={reset} />
    </>
  )
}
