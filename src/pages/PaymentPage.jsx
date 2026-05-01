import { useState, forwardRef, useImperativeHandle } from 'react'
import Modal from '../components/Modal'
import { US_STATES, COUNTRY_LABELS } from '../utils/address'

const formatAddress = (f) =>
  [f.name, f.addressLine1, f.city, f.state, f.postalCode, COUNTRY_LABELS[f.country] || f.country]
    .filter(Boolean)
    .join(', ')

const CreditCardIcon = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <rect x="0.5" y="0.5" width="31" height="19" rx="2.5" stroke="#717488" />
    <rect y="5.5" width="32" height="4" fill="#717488" opacity="0.35" />
    <rect x="3" y="13" width="9" height="3" rx="1" fill="#d3d3dc" />
  </svg>
)

const ApplePayIcon = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <rect width="32" height="20" rx="3" fill="#000" />
    <text x="16" y="13.5" textAnchor="middle" fill="#fff" fontSize="6.5" fontFamily="system-ui, sans-serif">Apple Pay</text>
  </svg>
)

const PayPalIcon = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <text x="1" y="14" fill="#003087" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="bold">Pay</text>
    <text x="19" y="14" fill="#009cde" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="bold">Pal</text>
  </svg>
)

const KlarnaIcon = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <rect width="32" height="20" rx="3" fill="#ffb3c7" />
    <text x="16" y="13.5" textAnchor="middle" fill="#000" fontSize="7" fontFamily="system-ui, sans-serif">klarna</text>
  </svg>
)

const PAYMENT_METHODS = [
  { id: 'credit-card', label: 'Credit Card', Icon: CreditCardIcon },
  { id: 'apple-pay', label: 'Apple Pay', Icon: ApplePayIcon },
  { id: 'paypal', label: 'PayPal', Icon: PayPalIcon },
  { id: 'klarna', label: 'Klarna', Icon: KlarnaIcon },
  { id: 'bnpl', label: 'Buy Now, Pay Later by PayPal', Icon: PayPalIcon },
]

const EMPTY_CARD_FORM = {
  cardNumber: '', expiry: '', cvv: '',
  name: '', phone: '', addressLine1: '', city: '', postalCode: '', state: '', country: '',
  saveCard: true,
}

const EMPTY_ADDRESS_FORM = {
  name: '', phone: '', addressLine1: '', city: '', postalCode: '', state: '', country: '',
  saveAddress: true,
}

const PaymentPage = forwardRef(function PaymentPage(
  { email, shippingForm, addresses, onAddAddress, cardData, setCardData, savedCards, onAddCard, fillData, selectedPayment, setSelectedPayment, onGoToLogin, onGoToShipping, ticketType },
  ref
) {
  const [showCardModal, setShowCardModal] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [paymentSectionOpen, setPaymentSectionOpen] = useState(!selectedPayment)
  const [billingSectionOpen, setBillingSectionOpen] = useState(false)
  const [cardForm, setCardForm] = useState(EMPTY_CARD_FORM)
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS_FORM)
  const [cardModalAddrIdx, setCardModalAddrIdx] = useState('new')
  const [cvvMode, setCvvMode] = useState(savedCards.length > 0 && selectedPayment === 'credit-card')
  const [cvvValue, setCvvValue] = useState('')

  const openCardModal = () => {
    setCardModalAddrIdx(addresses.length > 0 ? 0 : 'new')
    setShowCardModal(true)
  }

  useImperativeHandle(ref, () => ({
    fillCard() {
      setCardForm({ ...fillData.card, saveCard: true })
    },
    fillAddress() {
      setAddressForm({ ...fillData.billingAddress, saveAddress: true })
    },
  }), [fillData])

  const updateCardField = (field) => (e) =>
    setCardForm(prev => ({ ...prev, [field]: field === 'saveCard' ? e.target.checked : e.target.value }))

  const updateAddressField = (field) => (e) =>
    setAddressForm(prev => ({ ...prev, [field]: field === 'saveAddress' ? e.target.checked : e.target.value }))

  const handleAddCard = () => {
    const digits = cardForm.cardNumber.replace(/\D/g, '')
    const lastFour = digits.slice(-4) || '0000'
    let billingForm
    if (addresses.length > 0 && cardModalAddrIdx !== 'new') {
      billingForm = addresses[cardModalAddrIdx]
    } else {
      const cardBilling = {
        name: cardForm.name,
        phone: cardForm.phone,
        addressLine1: cardForm.addressLine1,
        city: cardForm.city,
        postalCode: cardForm.postalCode,
        state: cardForm.state,
        country: cardForm.country,
      }
      const hasBillingAddress = cardBilling.name.trim() && cardBilling.addressLine1.trim()
      billingForm = hasBillingAddress ? cardBilling : { ...shippingForm }
      if (hasBillingAddress) onAddAddress(cardBilling)
    }
    onAddCard({ lastFour, expiry: cardForm.expiry || '00/00', billingForm })
    setSelectedPayment('credit-card')
    setShowCardModal(false)
    setPaymentSectionOpen(false)
    setBillingSectionOpen(false)
    setCardForm(EMPTY_CARD_FORM)
  }

  const handleAddAddress = () => {
    const newAddress = {
      name: addressForm.name,
      phone: addressForm.phone,
      addressLine1: addressForm.addressLine1,
      city: addressForm.city,
      postalCode: addressForm.postalCode,
      state: addressForm.state,
      country: addressForm.country,
    }
    onAddAddress(newAddress)
    setCardData(prev => ({ ...prev, billingForm: newAddress }))
    setShowAddressModal(false)
    setBillingSectionOpen(false)
    setAddressForm(EMPTY_ADDRESS_FORM)
  }

  const selectPayment = (id) => {
    setSelectedPayment(id)
    setPaymentSectionOpen(false)
    setCvvMode(false)
  }

  const selectSavedCard = (card) => {
    setCardData(card)
    setSelectedPayment('credit-card')
    setPaymentSectionOpen(false)
    setCvvMode(false)
  }

  const handleCvvUpdate = () => {
    setCardData(prev => ({ ...prev, cvv: cvvValue }))
    setCvvMode(false)
    setPaymentSectionOpen(false)
  }

  const canBuy = selectedPayment !== null && !cvvMode
  const showBillingSection = selectedPayment === 'credit-card' && cardData != null

  const getPaymentSummary = () => {
    if (selectedPayment === 'credit-card' && cardData) {
      return { Icon: CreditCardIcon, label: `****${cardData.lastFour}, Expires: ${cardData.expiry}` }
    }
    const method = PAYMENT_METHODS.find(m => m.id === selectedPayment)
    return method ? { Icon: method.Icon, label: method.label } : null
  }
  const paymentSummary = getPaymentSummary()

  return (
    <div className="review-form-wrapper">
      <h1 className="review-title">Review Order</h1>

      <div className="review-billing-form">

        <div className="review-section review-payment-section">
          <p className="review-section-label">Contact</p>
          <div className="review-section-row">
            <p className="review-section-value">{email || 'No email provided'}</p>
            <button className="btn-update" onClick={onGoToLogin}>Update</button>
          </div>
        </div>

        {ticketType !== 'e-ticket' && (
          <div className="review-section review-payment-section">
            <p className="review-section-label">Shipping Address</p>
            <div className="review-section-row">
              <p className="review-section-value">{formatAddress(shippingForm)}</p>
              <button className="btn-update" onClick={onGoToShipping}>Update</button>
            </div>
          </div>
        )}

        <div className="review-section review-payment-section">
          <p className="review-section-label">Payment Method</p>
          {cvvMode ? (
            <div className="payment-method-list">
              {savedCards.map((card, i) => {
                const isSelected = selectedPayment === 'credit-card' && cardData?.lastFour === card.lastFour && cardData?.expiry === card.expiry
                return isSelected ? (
                  <div key={i} className="payment-method-item">
                    <input type="radio" className="shipping-radio" checked readOnly />
                    <div className="payment-method-content">
                      <div className="payment-method-row">
                        <span className="payment-method-icon"><CreditCardIcon /></span>
                        <span className="payment-method-name">****{card.lastFour}, Expires: {card.expiry}</span>
                      </div>
                      <div className="cvv-row">
                        <input
                          className="cvv-input"
                          type="text"
                          placeholder="CVV"
                          maxLength={4}
                          value={cvvValue}
                          onChange={e => setCvvValue(e.target.value)}
                        />
                        <button
                          className="btn-update btn-update-primary"
                          onClick={handleCvvUpdate}
                          disabled={!cvvValue.trim()}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button key={i} className="payment-method-item" onClick={() => selectSavedCard(card)}>
                    <input type="radio" className="shipping-radio" checked={false} readOnly />
                    <div className="payment-method-content">
                      <div className="payment-method-row">
                        <span className="payment-method-icon"><CreditCardIcon /></span>
                        <span className="payment-method-name">****{card.lastFour}, Expires: {card.expiry}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
              {PAYMENT_METHODS.filter(m => m.id !== 'credit-card').map(({ id, label, Icon }) => (
                <button key={id} className="payment-method-item" onClick={() => selectPayment(id)}>
                  <input type="radio" className="shipping-radio" checked={false} readOnly />
                  <div className="payment-method-content">
                    <div className="payment-method-row">
                      <span className="payment-method-icon"><Icon /></span>
                      <span className="payment-method-name">{label}</span>
                    </div>
                  </div>
                </button>
              ))}
              <button className="payment-method-item" onClick={() => openCardModal()}>
                <input type="radio" className="shipping-radio" checked={false} readOnly />
                <div className="payment-method-content">
                  <div className="payment-method-row">
                    <span className="payment-method-icon"><CreditCardIcon /></span>
                    <span className="payment-method-name">New Credit Card</span>
                  </div>
                </div>
              </button>
            </div>
          ) : paymentSectionOpen ? (
            <div className="payment-method-list">
              {savedCards.length > 0 ? (
                <>
                  {savedCards.map((card, i) => (
                    <button key={i} className="payment-method-item" onClick={() => selectSavedCard(card)}>
                      <input type="radio" className="shipping-radio" checked={selectedPayment === 'credit-card' && cardData === card} readOnly />
                      <div className="payment-method-content">
                        <div className="payment-method-row">
                          <span className="payment-method-icon"><CreditCardIcon /></span>
                          <span className="payment-method-name">****{card.lastFour}, Expires: {card.expiry}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  {PAYMENT_METHODS.filter(m => m.id !== 'credit-card').map(({ id, label, Icon }) => (
                    <button key={id} className="payment-method-item" onClick={() => selectPayment(id)}>
                      <input type="radio" className="shipping-radio" checked={selectedPayment === id} readOnly />
                      <div className="payment-method-content">
                        <div className="payment-method-row">
                          <span className="payment-method-icon"><Icon /></span>
                          <span className="payment-method-name">{label}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button className="payment-method-item" onClick={() => openCardModal()}>
                    <input type="radio" className="shipping-radio" checked={false} readOnly />
                    <div className="payment-method-content">
                      <div className="payment-method-row">
                        <span className="payment-method-icon"><CreditCardIcon /></span>
                        <span className="payment-method-name">New Credit Card</span>
                      </div>
                    </div>
                  </button>
                </>
              ) : (
                PAYMENT_METHODS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    className="payment-method-item"
                    onClick={() => id === 'credit-card' ? openCardModal() : selectPayment(id)}
                  >
                    <input type="radio" className="shipping-radio" checked={selectedPayment === id} readOnly />
                    <div className="payment-method-content">
                      <div className="payment-method-row">
                        <span className="payment-method-icon"><Icon /></span>
                        <span className="payment-method-name">{label}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : paymentSummary && (
            <div className="review-section-row">
              <div className="payment-summary-row">
                <span className="payment-method-icon"><paymentSummary.Icon /></span>
                <p className="review-section-value">{paymentSummary.label}</p>
              </div>
              <button className="btn-update" onClick={() => { setSelectedPayment(null); setCardData(null); setPaymentSectionOpen(true) }}>Update</button>
            </div>
          )}
        </div>

        {showBillingSection && (
          <div className="review-section review-payment-section">
            <p className="review-section-label">Billing Address</p>
            {billingSectionOpen ? (
              <div className="payment-method-list">
                {addresses.map((addr, i) => {
                  return (
                    <button key={i} className="payment-method-item" onClick={() => {
                      setCardData(prev => ({ ...prev, billingForm: { ...addr } }))
                      setBillingSectionOpen(false)
                    }}>
                      <input type="radio" className="shipping-radio" checked={false} readOnly />
                      <div className="payment-method-content">
                        <div className="payment-method-row">
                          <span className="payment-method-name">{formatAddress(addr)}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
                <button className="payment-method-item" onClick={() => setShowAddressModal(true)}>
                  <input type="radio" className="shipping-radio" checked={false} readOnly />
                  <div className="payment-method-content">
                    <div className="payment-method-row">
                      <span className="payment-method-name">New Address</span>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <div className="review-section-row">
                <p className="review-section-value">{formatAddress(cardData.billingForm)}</p>
                <button className="btn-update" onClick={() => setBillingSectionOpen(true)}>Update</button>
              </div>
            )}
          </div>
        )}

      </div>

      <div className="checkout-divider" />

      <div className="review-cta">
        <p className="terms-text">
          By clicking "Buy now" you agree to the <a href="#">Terms and Conditions</a>. All sales are final.
        </p>
        <button className="btn-primary" disabled={!canBuy}>Buy now</button>
      </div>

      {showAddressModal && (
        <Modal
          title="Add New Address"
          onClose={() => setShowAddressModal(false)}
          onSubmit={handleAddAddress}
          submitLabel="Add Address"
        >
          <div className="modal-section">
            <div className="address-form">
              <div className="form-field-group">
                <div className="floating-field">
                  <input
                    type="text"
                    className="text-input"
                    value={addressForm.name}
                    onChange={updateAddressField('name')}
                  />
                  <label className="floating-label">Full Name <span className="field-required">*</span></label>
                </div>
                <button className="add-link">+ Add a company name</button>
              </div>
              <div className="floating-field">
                <input
                  type="tel"
                  className="text-input"
                  placeholder="+1 (123) 123-1234"
                  value={addressForm.phone}
                  onChange={updateAddressField('phone')}
                />
                <label className="floating-label">Mobile phone <span className="field-required">*</span></label>
              </div>
              <div className="form-field-group">
                <div className="floating-field">
                  <input
                    type="text"
                    className="text-input"
                    value={addressForm.addressLine1}
                    onChange={updateAddressField('addressLine1')}
                  />
                  <label className="floating-label">Address Line 1</label>
                </div>
                <button className="add-link">+ Add address line 2</button>
              </div>
              <div className="form-row">
                <div className="floating-field">
                  <input
                    type="text"
                    className="text-input"
                    value={addressForm.city}
                    onChange={updateAddressField('city')}
                  />
                  <label className="floating-label">City <span className="field-required">*</span></label>
                </div>
                <div className="floating-field">
                  <input
                    type="text"
                    className="text-input"
                    value={addressForm.postalCode}
                    onChange={updateAddressField('postalCode')}
                  />
                  <label className="floating-label">Postal Code <span className="field-required">*</span></label>
                </div>
              </div>
              <div className="form-row">
                <div className="floating-field">
                  <select
                    className={`select-field${addressForm.state ? ' has-value' : ''}`}
                    value={addressForm.state}
                    onChange={updateAddressField('state')}
                  >
                    <option value="">Select one</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <label className="floating-label">State <span className="field-required">*</span></label>
                </div>
                <div className="floating-field">
                  <select
                    className={`select-field${addressForm.country ? ' has-value' : ''}`}
                    value={addressForm.country}
                    onChange={updateAddressField('country')}
                  >
                    <option value="">Select one</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </select>
                  <label className="floating-label">Country <span className="field-required">*</span></label>
                </div>
              </div>
              <label className="save-address-row">
                <input
                  type="checkbox"
                  className="save-checkbox"
                  checked={addressForm.saveAddress}
                  onChange={updateAddressField('saveAddress')}
                />
                <span className="save-address-label">Save this address for future use</span>
              </label>
            </div>
          </div>
        </Modal>
      )}

      {showCardModal && (
        <Modal
          title="Add New Card"
          onClose={() => { setShowCardModal(false); setCardForm(EMPTY_CARD_FORM) }}
          onSubmit={handleAddCard}
          submitLabel="Add Card"
        >
          <div className="modal-section">
            <div className="floating-field">
              <input
                type="text"
                className="text-input"
                value={cardForm.cardNumber}
                onChange={updateCardField('cardNumber')}
              />
              <label className="floating-label">Card Number <span className="field-required">*</span></label>
            </div>
            <div className="form-row">
              <div className="floating-field">
                <input
                  type="text"
                  className="text-input"
                  value={cardForm.expiry}
                  onChange={updateCardField('expiry')}
                  placeholder="MM/YY"
                />
                <label className="floating-label">Expiration Date <span className="field-required">*</span></label>
              </div>
              <div className="floating-field">
                <input
                  type="text"
                  className="text-input"
                  value={cardForm.cvv}
                  onChange={updateCardField('cvv')}
                />
                <label className="floating-label">Security Code <span className="field-required">*</span></label>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <p className="form-section-title">Billing Address</p>
            {addresses.length > 0 && (
              <div className="payment-method-list">
                {addresses.map((addr, i) => (
                  <button key={i} className="payment-method-item" onClick={() => setCardModalAddrIdx(i)}>
                    <input type="radio" className="shipping-radio" checked={cardModalAddrIdx === i} readOnly />
                    <div className="payment-method-content">
                      <div className="payment-method-row">
                        <span className="payment-method-name">{formatAddress(addr)}</span>
                      </div>
                    </div>
                  </button>
                ))}
                <button className="payment-method-item" onClick={() => setCardModalAddrIdx('new')}>
                  <input type="radio" className="shipping-radio" checked={cardModalAddrIdx === 'new'} readOnly />
                  <div className="payment-method-content">
                    <div className="payment-method-row">
                      <span className="payment-method-name">New Address</span>
                    </div>
                  </div>
                </button>
              </div>
            )}
            {addresses.length > 0 && cardModalAddrIdx === 'new' && (
              <div className="checkout-divider" style={{ margin: '8px 0' }} />
            )}
            {(addresses.length === 0 || cardModalAddrIdx === 'new') && (
              <div className="address-form">
                <div className="form-field-group">
                  <div className="floating-field">
                    <input
                      type="text"
                      className="text-input"
                      value={cardForm.name}
                      onChange={updateCardField('name')}
                    />
                    <label className="floating-label">Full Name <span className="field-required">*</span></label>
                  </div>
                  <button className="add-link">+ Add a company name</button>
                </div>
                <div className="floating-field">
                  <input
                    type="tel"
                    className="text-input"
                    placeholder="+1 (123) 123-1234"
                    value={cardForm.phone}
                    onChange={updateCardField('phone')}
                  />
                  <label className="floating-label">Mobile phone <span className="field-required">*</span></label>
                </div>
                <div className="form-field-group">
                  <div className="floating-field">
                    <input
                      type="text"
                      className="text-input"
                      value={cardForm.addressLine1}
                      onChange={updateCardField('addressLine1')}
                    />
                    <label className="floating-label">Address Line 1</label>
                  </div>
                  <button className="add-link">+ Add address line 2</button>
                </div>
                <div className="form-row">
                  <div className="floating-field">
                    <input
                      type="text"
                      className="text-input"
                      value={cardForm.city}
                      onChange={updateCardField('city')}
                    />
                    <label className="floating-label">City <span className="field-required">*</span></label>
                  </div>
                  <div className="floating-field">
                    <input
                      type="text"
                      className="text-input"
                      value={cardForm.postalCode}
                      onChange={updateCardField('postalCode')}
                    />
                    <label className="floating-label">Postal Code <span className="field-required">*</span></label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="floating-field">
                    <select
                      className={`select-field${cardForm.state ? ' has-value' : ''}`}
                      value={cardForm.state}
                      onChange={updateCardField('state')}
                    >
                      <option value="">Select one</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <label className="floating-label">State <span className="field-required">*</span></label>
                  </div>
                  <div className="floating-field">
                    <select
                      className={`select-field${cardForm.country ? ' has-value' : ''}`}
                      value={cardForm.country}
                      onChange={updateCardField('country')}
                    >
                      <option value="">Select one</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                    <label className="floating-label">Country <span className="field-required">*</span></label>
                  </div>
                </div>
                <label className="save-address-row">
                  <input
                    type="checkbox"
                    className="save-checkbox"
                    checked={cardForm.saveCard}
                    onChange={updateCardField('saveCard')}
                  />
                  <span className="save-address-label">Save this credit card for future use</span>
                </label>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
})

export default PaymentPage
