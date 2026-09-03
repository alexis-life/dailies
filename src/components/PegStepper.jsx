export default function PegStepper({ label, value, onChange, min = 0, max }) {
  return (
    <div className="peg-stepper">
      <span className="label-micro">{label}</span>
      <div className="peg-stepper-controls">
        <button
          type="button"
          className="ax-btn peg-stepper-btn"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          −
        </button>
        <span className="peg-stepper-value">{value}</span>
        <button
          type="button"
          className="ax-btn peg-stepper-btn"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  )
}
