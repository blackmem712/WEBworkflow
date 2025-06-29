'use client'

import { useState, ChangeEvent } from 'react'
import { Servico } from '@/types/servico/servico'
import InputCampo from '@/components/InputCampo'
import Button     from '@/components/buton'
import '@/styles/components/modalServico.css'

interface Props {
  onClose: () => void
  setServicos: React.Dispatch<React.SetStateAction<Servico[]>>
}

export default function ModalNovoServico({ onClose, setServicos }: Props) {
  const [form, setForm] = useState<Omit<Servico,'id'>>({
    nome: '',
    valor: 0,
    descricao: ''
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
    fetch('http://127.0.0.1:8000/servicos/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form),
    })
      .then(r => {
        if (!r.ok) throw new Error('Erro ao criar serviço')
        return r.json()
      })
      .then((novo: Servico) => {
        setServicos(prev => [...prev, novo])
        onClose()
      })
      .catch(console.error)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-serv wide">
        <h2>Novo Serviço</h2>
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
