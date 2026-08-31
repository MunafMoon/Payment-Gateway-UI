function PaymentMethodCard({ option, index, isActive, onSelect }) {
  return (
    <button
      type="button"
      className={`sidebar-method ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(option.id)}
    >
      <div className="sidebar-method-top">
        <span className="method-index">0{index + 1}</span>
        <span className="method-icon" aria-hidden="true">
          {option.icon}
        </span>
      </div>
      <strong>{option.label}</strong>
      <small>{option.helper}</small>
      <em>{option.accent}</em>
    </button>
  )
}

export default PaymentMethodCard
