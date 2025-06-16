// components/InputCampo.tsx
import '@/styles/components/inputCampo.css'

interface InputCampoProps {
  label:     string
  name:      string
  value:     string | number | null
  onChange:  (e: React.ChangeEvent<HTMLInputElement>) => void
  type?:     string
  placeholder?: string
}

export default function InputCampo({
  label, name, value, onChange,
  type = 'text', placeholder = ''
}: InputCampoProps) {
  // converte null ou undefined em string vazia
  const val = value == null ? '' : value

  return (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={val}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}