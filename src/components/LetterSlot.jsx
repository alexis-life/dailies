import { forwardRef } from 'react'

const LetterSlot = forwardRef(function LetterSlot({ value, status, onChange, onKeyDown }, ref) {
  function handleChange(e) {
    const letter = e.target.value.replace(/[^a-zA-Z]/g, '').slice(-1).toUpperCase()
    onChange(letter || null)
  }

  return (
    <input
      ref={ref}
      type="text"
      className={`letter-slot ${status ? `letter-slot--${status}` : ''}`}
      value={value ?? ''}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      maxLength={1}
      inputMode="text"
      autoCapitalize="characters"
      aria-label="Letter"
    />
  )
})

export default LetterSlot
