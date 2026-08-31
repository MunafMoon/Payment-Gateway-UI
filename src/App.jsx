import { useMemo, useState } from 'react'
import './App.css'
import PaymentMethodCard from './components/PaymentMethodCard'
import CardsPayment from './components/payments/CardsPayment'
import NetBankingPayment from './components/payments/NetBankingPayment'
import UpiPayment from './components/payments/UpiPayment'

const paymentOptions = [
  {
    id: 'card',
    label: 'Cards',
    helper: 'Credit and debit cards',
    // icon: '[ ]',
    accent: 'Tap card details',
  },
  {
    id: 'upi',
    label: 'UPI',
    helper: 'Instant app-based payment',
    // icon: '( )',
    accent: 'Approve on mobile',
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    helper: 'Bank account redirect',
    // icon: '{ }',
    accent: 'Continue to bank',
  },
]

const banks = [
  'HDFC Bank',
  'ICICI Bank',
  'State Bank of India',
  'Axis Bank',
  'Kotak Mahindra Bank',
]

const initialForm = {
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  upiId: '',
  bank: banks[0],
}

const initialTouched = {
  cardName: false,
  cardNumber: false,
  expiry: false,
  cvv: false,
  upiId: false,
  bank: false,
}

const order = {
  item: 'Creator Commerce Pack',
  description: 'One-year access with priority support and analytics suite.',
  amount: 999,
  discount: 400,
  convenienceFee: 49,
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCardNumber(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length < 3) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function validateField(method, field, value) {
  if (method === 'card') {
    if (field === 'cardName') {
      return value.trim().length >= 3 ? '' : 'Enter the cardholder name'
    }
    if (field === 'cardNumber') {
      return value.replace(/\s/g, '').length === 16 ? '' : 'Card number must be 16 digits'
    }
    if (field === 'expiry') {
      if (!/^\d{2}\/\d{2}$/.test(value)) return 'Use MM/YY format'

      const [monthText, yearText] = value.split('/')
      const month = Number(monthText)
      const year = Number(`20${yearText}`)
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()

      if (month < 1 || month > 12) return 'Month must be between 01 and 12'
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return 'Card has expired'
      }
    }
    if (field === 'cvv') {
      return /^\d{3}$/.test(value) ? '' : 'CVV must be 3 digits'
    }
  }

  if (method === 'upi' && field === 'upiId') {
    return /^[\w.+-]{2,}@[a-zA-Z]{2,}$/.test(value.trim()) ? '' : 'Enter a valid UPI ID'
  }

  if (method === 'netbanking' && field === 'bank') {
    return value ? '' : 'Select a bank'
  }

  return ''
}

function getStatusText(paymentState) {
  if (paymentState === 'loading') return 'Processing payment request...'
  if (paymentState === 'success') return 'Payment successful. Your order is confirmed.'
  if (paymentState === 'error') return 'Payment could not be completed. Check details or try again.'
  return 'Your payment details are encrypted and ready.'
}

function PaymentMethodContent({ selectedMethod, form, touched, errors, onChange, onBlur }) {
  if (selectedMethod === 'card') {
    return (
      <CardsPayment
        form={form}
        touched={touched}
        errors={errors}
        onChange={onChange}
        onBlur={onBlur}
      />
    )
  }

  if (selectedMethod === 'upi') {
    return (
      <div style={{paddingTop:"10px"}}>
      <UpiPayment
        form={form}
        touched={touched}
        errors={errors}
        onChange={onChange}
        onBlur={onBlur}
      />
      </div>
    )
  }

  return (
    <NetBankingPayment
      form={form}
      touched={touched}
      errors={errors}
      banks={banks}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}

function App() {
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState(initialTouched)
  const [paymentState, setPaymentState] = useState('idle')

  const selectedOption = paymentOptions.find((option) => option.id === selectedMethod)
  const subtotal = order.amount
  const total = subtotal - order.discount + order.convenienceFee

  const fieldErrors = useMemo(
    () => ({
      cardName: validateField(selectedMethod, 'cardName', form.cardName),
      cardNumber: validateField(selectedMethod, 'cardNumber', form.cardNumber),
      expiry: validateField(selectedMethod, 'expiry', form.expiry),
      cvv: validateField(selectedMethod, 'cvv', form.cvv),
      upiId: validateField(selectedMethod, 'upiId', form.upiId),
      bank: validateField(selectedMethod, 'bank', form.bank),
    }),
    [form, selectedMethod],
  )

  const activeFields = {
    card: ['cardName', 'cardNumber', 'expiry', 'cvv'],
    upi: ['upiId'],
    netbanking: ['bank'],
  }[selectedMethod]

  const isFormValid = activeFields.every((field) => !fieldErrors[field] && form[field].trim() !== '')

  const handleMethodChange = (method) => {
    setSelectedMethod(method)
    setPaymentState('idle')
  }

  const handleBlur = (field) => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const handleChange = (field, value) => {
    let nextValue = value

    if (field === 'cardNumber') nextValue = formatCardNumber(value)
    if (field === 'expiry') nextValue = formatExpiry(value)
    if (field === 'cvv') nextValue = value.replace(/\D/g, '').slice(0, 3)

    setForm((current) => ({ ...current, [field]: nextValue }))
    setPaymentState('idle')
  }

  const simulatePayment = (event) => {
    event.preventDefault()

    const nextTouched = { ...touched }
    activeFields.forEach((field) => {
      nextTouched[field] = true
    })
    setTouched(nextTouched)

    if (!isFormValid) {
      setPaymentState('error')
      return
    }

    setPaymentState('loading')
    window.setTimeout(() => {
      setPaymentState(Math.random() > 0.35 ? 'success' : 'error')
    }, 1800)
  }

  return (
    <main className="checkout-shell">
      <aside className="method-sidebar">

        <div className="sidebar-methods" role="tablist" aria-label="Payment methods">
          {paymentOptions.map((option, index) => (
            <PaymentMethodCard
              key={option.id}
              option={option}
              index={index}
              isActive={selectedMethod === option.id}
              onSelect={handleMethodChange}
            />
          ))}
        </div>

        <div className="sidebar-foot">
          <span>Secured checkout</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </aside>

      <section className="main-stage">
        <div className="payment-stage">
          <div className="stage-header">
            <div>
              <span className="stage-label">Selected Method</span>
              <h2>{selectedOption.label}</h2>
            </div>
            <div className={`state-chip ${paymentState}`}>
              {paymentState === 'idle' ? 'Ready' : paymentState}
            </div>
          </div>

          <div className="stage-intro">
            <p>{selectedOption.helper}</p>
            <span>{selectedOption.accent}</span>
          </div>

          <form className="payment-form" onSubmit={simulatePayment}>
            <PaymentMethodContent
              selectedMethod={selectedMethod}
              form={form}
              touched={touched}
              errors={fieldErrors}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <div className={`status-banner ${paymentState}`}>{getStatusText(paymentState)}</div>

            <button type="submit" className="pay-button" disabled={paymentState === 'loading'}>
              {paymentState === 'loading' ? 'Processing...' : `Pay ${formatCurrency(total)}`}
            </button>
          </form>
        </div>

        <aside className="summary-panel">
          <div className="summary-card">
            <span className="summary-label">Order Snapshot</span>
            <h3>{order.item}</h3>
            <p>{order.description}</p>

            <div className="summary-lines">
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong className="positive">- {formatCurrency(order.discount)}</strong>
              </div>
              <div>
                <span>Convenience Fee</span>
                <strong>{formatCurrency(order.convenienceFee)}</strong>
              </div>
            </div>

            <div className="summary-total">
              <span>Total Payable</span>
              <strong>{formatCurrency(total)}</strong>
            </div>

          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
