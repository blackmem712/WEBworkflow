// src/components/ModalNovoProduto.tsx
'use client'

import { useState, ChangeEvent } from 'react'
import { Produto } from '@/types/produto/produto'
import InputCampo from '@/components/InputCampo'
import Button     from '@/components/buton'
import '@/styles/components/modalProduto.css'

interface Props {
  onClose: () => void
  setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>
}

export default function ModalNovoProduto({ onClose, setProdutos }: Props) {
  const [form, setForm] = useState<Omit<Produto,'id'>>({
    nome: '',
    marca: '',
    modelo: '',
    preco: 0,
    descricao: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'preco'
        ? Number(value)
        : value
    }))
  }

  const handleSalvar = () => {
    fetch('http://127.0.0.1:8000/produtos/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form),
    })
      .then(r => {
        if (!r.ok) throw new Error('Erro ao criar produto')
        return r.json()
      })
      .then((novo: Produto) => {
        setProdutos(prev => [...prev, novo])
        onClose()
      })
      .catch(console.error)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-prod wide">
        <h2>Novo Produto</h2>
        <div className="form-grid">
          <div className="grid-col-6">
            <InputCampo label="Nome"   name="nome"   value={form.nome}   onChange={handleChange} />
          </div>
          <div className="grid-col-6">
            <InputCampo label="Marca"  name="marca"  value={form.marca}  onChange={handleChange} />
          </div>
          <div className="grid-col-6">
            <InputCampo label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Preço (R$)"
              name="preco"
              type="number"
              value={form.preco}
              onChange={handleChange}
            />
          </div>
          <div className="grid-col-12">
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={3}
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
