/* components/Button.tsx */
'use client'

import { ButtonHTMLAttributes } from 'react'
import '@/styles/components/buton.css'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger'

type ButtonBaseProps = ButtonHTMLAttributes<HTMLButtonElement>

interface ButtonProps extends ButtonBaseProps {
  variant?: ButtonVariant
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...buttonProps
}: ButtonProps) {
  const composed = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ')
  return (
    <button className={composed} {...buttonProps}>
      {children}
    </button>
  )
}
