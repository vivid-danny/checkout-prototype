import { useState, forwardRef, useImperativeHandle } from 'react'


const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
]

const ShippingPage = forwardRef(function ShippingPage(
  { form, setForm, selectedShipping, setSelectedShipping, onContinue },
  ref
) {
  const [saveAddress, setSaveAddress] = useState(false)

  useImperativeHandle(ref, () => ({
    fillAddress() {
      setSelectedShipping('basic')
      setForm({
        name: 'John Doe',
        phone: '(312) 555-0192',
        addressLine1: '233 S Wacker Dr',
        city: 'Chicago',
        postalCode: '60606',
        state: 'Illinois',
        country: 'US',
      })
    },
  }))

  const showAddressForm = selectedShipping !== null
  const canContinue = showAddressForm &&
    form.name.trim() && form.phone.trim() && form.city.trim() &&
    form.postalCode.trim() && form.state && form.country

  const updateField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

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

      {showAddressForm && (
        <>
          <div className="checkout-divider" />
          <div className="address-section">
            <p className="form-section-title">Shipping Address</p>
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
        onClick={canContinue ? onContinue : undefined}
      >
        Continue
      </button>
    </div>
  )
})

export default ShippingPage
