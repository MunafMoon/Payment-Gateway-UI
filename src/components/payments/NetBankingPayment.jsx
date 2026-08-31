import PaymentSection from '../PaymentSection'

function NetBankingPayment({ form, touched, errors, banks, onChange, onBlur }) {
  return (
    <PaymentSection title="Bank Redirect">
      <label className="wide">
        Select Bank
        <select
          value={form.bank}
          onChange={(event) => onChange('bank', event.target.value)}
          onBlur={() => onBlur('bank')}
        >
          {banks.map((bank) => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>
        {touched.bank && errors.bank && <span className="error-text">{errors.bank}</span>}
      </label>
      <div className="info-strip" style={{paddingTop:"10px"}}>
        <span>OTP verification</span>
        <span>Trusted redirect</span>
        <span>Bank session</span>
      </div>
    </PaymentSection>
  )
}

export default NetBankingPayment
