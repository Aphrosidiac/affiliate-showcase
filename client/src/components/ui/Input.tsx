import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 placeholder:text-neutral-400 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-neutral-300 focus:border-neutral-500 focus:ring-neutral-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
)

Input.displayName = 'Input'
export default Input
