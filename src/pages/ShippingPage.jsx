import { useState } from 'react'
import { US_STATES } from '../utils/address'

const EMPTY_FORM = {
  name: '', phone: '', addressLine1: '', city: '', postalCode: '', state: '', country: '',
}

const formatAddress = (f) =>
  [f.name, f.addressLine1, f.city, f.state, f.postalCode]
    .filter(Boolean)
    .join(', ')

export default function ShippingPage({ form, setForm, addresses, onAddAddress, selectedShipping, setSelectedShipping, onContinue }) {
  const hasSaved = addresses.length > 0
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(hasSaved ? 0 : 'new')
  const [saveAddress, setSaveAddress] = useState(false)

  const showAddressForm = selectedShipping !== null
  const showSavedList = showAddressForm && hasSaved
  const showForm = showAddressForm && (!hasSaved || selectedAddressIdx === 'new')

  const isFormValid = form.name.trim() && form.phone.trim() && form.city.trim() &&
    form.postalCode.trim() && form.state && form.country

  const canContinue = showAddressForm && (selectedAddressIdx !== 'new' || isFormValid)

  const updateField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const selectSaved = (i) => {
    setSelectedAddressIdx(i)
    setForm({ ...addresses[i] })
  }

  const selectNew = () => {
    setSelectedAddressIdx('new')
    setForm({ ...EMPTY_FORM })
  }

  const handleContinue = () => {
    if (selectedAddressIdx === 'new') {
      onAddAddress({ ...form })
    }
    onContinue()
  }

  return (
    <div className="shipping-form-wrapper">
      <h1 className="shipping-title">Shipping Details</h1>

      <div className="shipping-method-section">
        <div>
          <p className="form-section-title">Shipping Method</p>
          <p className="form-section-subtitle">A signature may be required for delivery.</p>
        </div>
        <div className="shipping-method-list">
          <label className="shipping-method-item">
            <input
              type="radio"
              name="shipping"
              className="shipping-radio"
              checked={selectedShipping === 'basic'}
              onChange={() => setSelectedShipping('basic')}
            />
            <span className="shipping-method-label">UPS Basic Delivery</span>
          </label>
          <label className="shipping-method-item">
            <input
              type="radio"
              name="shipping"
              className="shipping-radio"
              checked={selectedShipping === 'overnight'}
              onChange={() => setSelectedShipping('overnight')}
            />
            <span className="shipping-method-label">UPS Overnight Delivery</span>
          </label>
        </div>
      </div>

      {showSavedList && (
        <>
          <div className="checkout-divider" />
          <div className="address-section">
            <p className="form-section-title">Shipping Address</p>
            <div className="payment-method-list">
              {addresses.map((addr, i) => (
                <button key={i} className="payment-method-item" onClick={() => selectSaved(i)}>
                  <input
                    type="radio"
                    className="shipping-radio"
                    checked={selectedAddressIdx === i}
                    readOnly
                  />
                  <div className="payment-method-content">
                    <div className="payment-method-row">
                      <span className="payment-method-name">{formatAddress(addr)}</span>
                    </div>
                  </div>
                </button>
              ))}
              <button className="payment-method-item" onClick={selectNew}>
                <input
                  type="radio"
                  className="shipping-radio"
                  checked={selectedAddressIdx === 'new'}
                  readOnly
                />
                <div className="payment-method-content">
                  <div className="payment-method-row">
                    <span className="payment-method-name">New Address</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <>
          <div className="checkout-divider" />
          <div className="address-section">
            {!hasSaved && <p className="form-section-title">Shipping Address</p>}
            <div className="address-form">

              <div className="form-field-group">
                <div className="floating-field">
                  <input
                    type="text"
                    className="text-input"
                    value={form.name}
                    onChange={updateField('name')}
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
                  value={form.phone}
                  onChange={updateField('phone')}
                />
                <label className="floating-label">Mobile phone <span className="field-required">*</span></label>
              </div>

              <div className="form-field-group">
                <div className="floating-field">
                  <input
                    type="text"
                    className="text-input"
                    value={form.addressLine1}
                    onChange={updateField('addressLine1')}
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
                    value={form.city}
                    onChange={updateField('city')}
                  />
                  <label className="floating-label">City <span className="field-required">*</span></label>
                </div>
                <div className="floating-field">
                  <input
                    type="text"
                    className="text-input"
                    value={form.postalCode}
                    onChange={updateField('postalCode')}
                  />
                  <label className="floating-label">Postal Code <span className="field-required">*</span></label>
                </div>
              </div>

              <div className="form-row">
                <div className="floating-field">
                  <select
                    className={`select-field${form.state ? ' has-value' : ''}`}
                    value={form.state}
                    onChange={updateField('state')}
                  >
                    <option value="">Select one</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <label className="floating-label">State <span className="field-required">*</span></label>
                </div>
                <div className="floating-field">
                  <select
                    className={`select-field${form.country ? ' has-value' : ''}`}
                    value={form.country}
                    onChange={updateField('country')}
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
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                />
                <span className="save-address-label">Save this address for future use</span>
              </label>

            </div>
          </div>
        </>
      )}

      <div className="checkout-divider" />

      <button
        className="btn-primary"
        disabled={!canContinue}
        onClick={canContinue ? handleContinue : undefined}
      >
        Continue
      </button>
    </div>
  )
}
