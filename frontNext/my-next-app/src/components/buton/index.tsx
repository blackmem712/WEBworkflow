/* components/Button.tsx */
'use client'

import '@/styles/components/buton.css'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger'

interface ButtonProps {
  onClick: () => void
  variant?: ButtonVariant
  children: React.ReactNode
}

export default function Button({ onClick, variant = 'primary', children }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}