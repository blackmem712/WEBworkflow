// components/InputCampo.tsx
import { ChangeEvent, InputHTMLAttributes, useMemo } from 'react'
import '@/styles/components/inputCampo.css'

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'name'>

interface InputCampoProps extends BaseInputProps {
  label: string
  name: string
  value: string | number | null
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  containerClassName?: string
  hint?: string
}

export default function InputCampo({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  containerClassName = '',
  hint,
  disabled,
  readOnly,
  ...rest
}: InputCampoProps) {
  const val = value == null ? '' : value
  const changeHandler = useMemo(() => onChange ?? (() => {}), [onChange])
  const effectiveReadOnly = readOnly ?? (!onChange && !disabled)

  return (
    <div className={['input-group', containerClassName].filter(Boolean).join(' ')}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={val}
        onChange={changeHandler}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={effectiveReadOnly}
        aria-readonly={effectiveReadOnly || undefined}
        {...rest}
      />
      {hint ? <span className="input-hint">{hint}</span> : null}
    </div>
  )
}
