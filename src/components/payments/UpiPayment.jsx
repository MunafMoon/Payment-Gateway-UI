import PaymentSection from '../PaymentSection'

function UpiPayment({ form, touched, errors, onChange, onBlur }) {
  return (
    <PaymentSection title="UPI Approval">
      <label className="wide">
        UPI ID
        <input
          type="text"
          placeholder="name@bank"
          value={form.upiId}
          onChange={(event) => onChange('upiId', event.target.value)}
          onBlur={() => onBlur('upiId')}
        />
        {touched.upiId && errors.upiId && <span className="error-text">{errors.upiId}</span>}
      </label>
      <div className="info-strip" style={{paddingTop:"10px"}}>
        <span>Google Pay</span>
        <span>PhonePe</span>
        <span>Paytm</span>
      </div>
    </PaymentSection>
  )
}

export default UpiPayment
