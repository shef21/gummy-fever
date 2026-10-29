import { Minus, Plus } from 'lucide-react'

export default function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  invert = false,
  labelledBy,
}: {
  value: number
  onDecrease: () => void
  onIncrease: () => void
  invert?: boolean
  labelledBy?: string
}) {
  const chrome = invert
    ? 'border-white text-white hover:bg-white hover:text-black'
    : 'border-black text-black hover:bg-black hover:text-white'

  return (
    <div
      className={`inline-flex items-stretch border ${invert ? 'border-white' : 'border-black'}`}
      role="group"
      aria-labelledby={labelledBy}
    >
      <button
        type="button"
        onClick={onDecrease}
        className={`tap ${chrome}`}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className={`min-w-11 px-4 py-2 text-center text-base ${invert ? 'text-white' : 'text-black'}`}>
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className={`tap ${chrome}`}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
