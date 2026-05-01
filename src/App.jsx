import { useState, useRef } from 'react'
import CheckoutLayout from './components/CheckoutLayout'
import PrototypeControls from './components/PrototypeControls'
import LoginPage from './pages/LoginPage'
import ShippingPage from './pages/ShippingPage'
import PaymentPage from './pages/PaymentPage'
import { USER_PROFILES } from './data/users'

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
  'hard-stock': { login: 'Step 1 of 3', shipping: 'Step 2 of 3', payment: 'Step 3 of 3' },
  'e-ticket':   { login: 'Step 1 of 2', payment: 'Step 2 of 2' },
}

const EMPTY_FORM = {
  name: '', phone: '', addressLine1: '', city: '', postalCode: '', state: '', country: '',
}

export default function App() {
  const [activeUser, setActiveUser] = useState('new')
  const [ticketType, setTicketType] = useState('hard-stock')
  const [page, setPage] = useState('login')
  const [email, setEmail] = useState('')
  const [shippingForm, setShippingForm] = useState(EMPTY_FORM)
  const [selectedShipping, setSelectedShipping] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [cardData, setCardData] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [savedCards, setSavedCards] = useState([])
  const paymentRef = useRef(null)

  const reset = () => {
    setPage('login')
    setEmail('')
    setShippingForm(EMPTY_FORM)
    setSelectedShipping(null)
    setSelectedPayment(null)
    setCardData(null)
    setAddresses([])
    setSavedCards([])
  }

  const handleUserChange = (userId) => {
    setActiveUser(userId)
    reset()
  }

  const handleTicketTypeChange = (type) => {
    setTicketType(type)
    reset()
  }

  const handleLoginContinue = (e) => {
    const profile = USER_PROFILES[activeUser]
    setEmail(e)
    setAddresses([...profile.savedAddresses])
    setSavedCards([...profile.savedCards])
    if (ticketType === 'e-ticket') {
      if (profile.savedCards.length > 0) {
        setCardData({ ...profile.savedCards[0] })
        setSelectedPayment('credit-card')
      }
      setPage('payment')
    } else {
      if (profile.savedAddresses.length > 0) {
        setShippingForm({ ...profile.savedAddresses[0] })
      } else {
        setShippingForm(EMPTY_FORM)
      }
      setPage('shipping')
    }
  }

  const handleAddAddress = (addr) => {
    setAddresses(prev => [...prev, addr])
  }

  const handleAddCard = (card) => {
    setSavedCards(prev => [...prev, card])
    setCardData(card)
  }

  const fillData = USER_PROFILES[activeUser].fillData

  const controls = {
    login: [],
    shipping: [
      {
        label: 'Fill Address Form',
        onClick: () => {
          setShippingForm({ ...fillData.address })
          setSelectedShipping('basic')
        },
      },
    ],
    payment: [
      { label: 'Fill Credit Card', onClick: () => paymentRef.current?.fillCard() },
      { label: 'Fill Address', onClick: () => paymentRef.current?.fillAddress() },
    ],
  }

  const users = Object.entries(USER_PROFILES).map(([id, p]) => ({ id, label: p.label }))

  return (
    <>
      <CheckoutLayout
        progress={PROGRESS[ticketType][page]}
        event={ORDER.event}
        pricing={ORDER.pricing}
        ticketDetails={ORDER.ticketDetails}
        selectedShipping={page === 'payment' ? selectedShipping : null}
        ticketType={ticketType}
      >
        {page === 'login' && (
          <LoginPage
            email={email}
            onContinue={handleLoginContinue}
          />
        )}
        {page === 'shipping' && (
          <ShippingPage
            form={shippingForm}
            setForm={setShippingForm}
            addresses={addresses}
            onAddAddress={handleAddAddress}
            selectedShipping={selectedShipping}
            setSelectedShipping={setSelectedShipping}
            onContinue={() => {
              if (savedCards.length > 0 && !selectedPayment) {
                setCardData({ ...savedCards[0], billingForm: { ...shippingForm } })
                setSelectedPayment('credit-card')
              }
              setPage('payment')
            }}
          />
        )}
        {page === 'payment' && (
          <PaymentPage
            ref={paymentRef}
            email={email}
            shippingForm={shippingForm}
            cardData={cardData}
            setCardData={setCardData}
            addresses={addresses}
            onAddAddress={handleAddAddress}
            savedCards={savedCards}
            onAddCard={handleAddCard}
            fillData={fillData}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            onGoToLogin={() => setPage('login')}
            onGoToShipping={() => setPage('shipping')}
            ticketType={ticketType}
          />
        )}
      </CheckoutLayout>
      <PrototypeControls
        actions={controls[page]}
        onReset={reset}
        users={users}
        activeUser={activeUser}
        onUserChange={handleUserChange}
        ticketType={ticketType}
        onTicketTypeChange={handleTicketTypeChange}
      />
    </>
  )
}
