'use client'

import { useState, ChangeEvent } from 'react'
import { Servico } from '@/types/servico/servico'
import InputCampo from '@/components/InputCampo'
import Button     from '@/components/buton'
import '@/styles/components/modalServico.css'

interface Props {
  servico: Servico
  onClose: () => void
  setServicos: React.Dispatch<React.SetStateAction<Servico[]>>
}

interface FormState {
  nome:      string
  valor:     number
  descricao: string
}

export default function ModalServico({ servico, onClose, setServicos }: Props) {
  const [form, setForm] = useState<FormState>({
    nome: servico.nome,
    valor: servico.valor,
    descricao: servico.descricao
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'valor'
        ? Number(value)
        : value
    }))
  }

  const handleSalvar = () => {
    fetch(`http://127.0.0.1:8000/servicos/api/v1/${servico.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form),
    })
      .then(r => {
        if (!r.ok) throw new Error('Erro ao salvar')
        return r.json()
      })
      .then((updated: Servico) => {
        setServicos(prev =>
          prev.map(s => s.id === updated.id ? updated : s)
        )
        onClose()
      })
      .catch(console.error)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-serv wide">
        <h2>Editar Serviço</h2>
        <div className="form-grid">
          <div className="grid-col-12">
            <InputCampo
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Valor (R$)"
              name="valor"
              type="number"
              value={form.valor}
              onChange={handleChange}
            />
          </div>
          <div className="grid-col-12">
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>
        <div className="modal-buttons">
          <Button variant="primary" onClick={handleSalvar}>Salvar</Button>
          <Button variant="danger"  onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  )
}
