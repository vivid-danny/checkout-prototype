import { useState, useRef } from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom'
import CheckoutLayout from './components/CheckoutLayout'
import PrototypeControls from './components/PrototypeControls'
import LoginPage from './pages/LoginPage'
import ShippingPage from './pages/ShippingPage'
import PaymentPage from './pages/PaymentPage'
import { USER_PROFILES } from './data/users'

const EVENT = {
  name: 'New York Knicks at Chicago Bulls',
  date: 'Wednesday January 15 at 7:00pm',
  venue: 'United Center, Chicago, IL',
}

const TICKET_DETAILS_BASE = {
  section: 'Lower Level 105, Row 11',
  quantity: 2,
  perks: 'Front of Section, Unlimited Food & Beverage',
}

const ORDERS = {
  'hard-stock': {
    event: EVENT,
    pricing: {
      dealScore: 7,
      dealLabel: 'Good Deal',
      tickets: { count: 2, unitPrice: 127.50 },
      fees: { count: 2, unitPrice: 24.95 },
      taxes: 0,
    },
    ticketDetails: {
      ...TICKET_DETAILS_BASE,
      delivery: 'Shipped via UPS',
      deliveryNote: 'Tickets delivered to your address',
      inHandDate: 'Tickets delivered by January 13, 2026',
    },
  },
  'e-ticket': {
    event: EVENT,
    pricing: {
      dealScore: 10,
      dealLabel: 'Fantastic Deal',
      tickets: { count: 2, unitPrice: 89.00 },
      fees: { count: 2, unitPrice: 19.95 },
      taxes: 14.22,
    },
    ticketDetails: {
      ...TICKET_DETAILS_BASE,
      delivery: 'E-Ticket',
      deliveryNote: 'Delivered to your email',
      inHandDate: 'E-Tickets available after purchase',
    },
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
  const navigate = useNavigate()
  const location = useLocation()
  const currentPage = location.pathname.split('/').pop()

  const [activeUser, setActiveUser] = useState('new')
  const [ticketType, setTicketType] = useState('hard-stock')
  const [email, setEmail] = useState('')
  const [shippingForm, setShippingForm] = useState(EMPTY_FORM)
  const [selectedShipping, setSelectedShipping] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [cardData, setCardData] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [savedCards, setSavedCards] = useState([])
  const paymentRef = useRef(null)

  const reset = () => {
    setEmail('')
    setShippingForm(EMPTY_FORM)
    setSelectedShipping(null)
    setSelectedPayment(null)
    setCardData(null)
    setAddresses([])
    setSavedCards([])
    navigate('/checkout/login')
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
      navigate('/checkout/payment')
    } else {
      if (profile.savedAddresses.length > 0) {
        setShippingForm({ ...profile.savedAddresses[0] })
      } else {
        setShippingForm(EMPTY_FORM)
      }
      navigate('/checkout/shipping')
    }
  }

  const handleAddAddress = (addr) => {
    setAddresses(prev => [...prev, { ...addr, isNew: true }])
  }

  const handleUpdateAddress = (idx, updatedAddr) => {
    setAddresses(prev => prev.map((a, i) => i === idx ? { ...updatedAddr, isNew: true } : a))
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
      <Routes>
        <Route
          path="/checkout"
          element={
            <CheckoutLayout
              progress={PROGRESS[ticketType]?.[currentPage]}
              event={ORDERS[ticketType].event}
              pricing={ORDERS[ticketType].pricing}
              ticketDetails={ORDERS[ticketType].ticketDetails}
              selectedShipping={currentPage === 'payment' ? selectedShipping : null}
              ticketType={ticketType}
            >
              <Outlet />
            </CheckoutLayout>
          }
        >
          <Route index element={<Navigate to="login" replace />} />
          <Route
            path="login"
            element={<LoginPage email={email} onContinue={handleLoginContinue} />}
          />
          <Route
            path="shipping"
            element={
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
                  navigate('/checkout/payment')
                }}
              />
            }
          />
          <Route
            path="payment"
            element={
              <PaymentPage
                ref={paymentRef}
                email={email}
                shippingForm={shippingForm}
                cardData={cardData}
                setCardData={setCardData}
                addresses={addresses}
                onAddAddress={handleAddAddress}
                onUpdateAddress={handleUpdateAddress}
                savedCards={savedCards}
                onAddCard={handleAddCard}
                fillData={fillData}
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
                ticketType={ticketType}
                errorState={activeUser === 'error'}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/checkout/login" replace />} />
      </Routes>
      <PrototypeControls
        actions={controls[currentPage] ?? []}
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
