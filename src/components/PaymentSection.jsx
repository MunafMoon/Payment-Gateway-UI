function PaymentSection({ title, children }) {
  return (
    <div className="form-section">
      <div className="form-section-head">
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default PaymentSection
