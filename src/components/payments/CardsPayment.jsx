import PaymentSection from '../PaymentSection'

function CardsPayment({ form, touched, errors, onChange, onBlur }) {
  return (
    <PaymentSection title="Card Details">
      <div className="input-grid">
        <label className="wide">
          Cardholder Name
          <input
            type="text"
            placeholder="Aarav Sharma"
            value={form.cardName}
            onChange={(event) => onChange('cardName', event.target.value)}
            onBlur={() => onBlur('cardName')}
          />
          {touched.cardName && errors.cardName && <span className="error-text">{errors.cardName}</span>}
        </label>

        <label className="wide">
          Card Number
          <input
            type="text"
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            value={form.cardNumber}
            onChange={(event) => onChange('cardNumber', event.target.value)}
            onBlur={() => onBlur('cardNumber')}
          />
          {touched.cardNumber && errors.cardNumber && (
            <span className="error-text">{errors.cardNumber}</span>
          )}
        </label>

        <label>
          Expiry
          <input
            type="text"
            inputMode="numeric"
            placeholder="MM/YY"
            value={form.expiry}
            onChange={(event) => onChange('expiry', event.target.value)}
            onBlur={() => onBlur('expiry')}
          />
          {touched.expiry && errors.expiry && <span className="error-text">{errors.expiry}</span>}
        </label>

        <label>
          CVV
          <input
            type="password"
            inputMode="numeric"
            placeholder="123"
            value={form.cvv}
            onChange={(event) => onChange('cvv', event.target.value)}
            onBlur={() => onBlur('cvv')}
          />
          {touched.cvv && errors.cvv && <span className="error-text">{errors.cvv}</span>}
        </label>
      </div>
    </PaymentSection>
  )
}

export default CardsPayment
