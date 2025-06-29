// src/components/ModalProduto.tsx
'use client'

import { useState, ChangeEvent } from 'react'
import { Produto } from '@/types/produto/produto'
import InputCampo from '@/components/InputCampo'
import Button     from '@/components/buton'
import '@/styles/components/modalProduto.css'

interface Props {
  produto: Produto
  onClose: () => void
  setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>
}

interface FormState {
  nome:      string
  marca:     string
  modelo:    string
  preco:     number
  descricao: string
}

export default function ModalProduto({ produto, onClose, setProdutos }: Props) {
  const [form, setForm] = useState<FormState>({
    nome: produto.nome,
    marca: produto.marca,
    modelo: produto.modelo,
    preco: produto.preco,
    descricao: produto.descricao
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'preco'
        ? Number(value)
        : value
    }))
  }

  const handleSalvar = () => {
    fetch(`http://127.0.0.1:8000/produtos/api/v1/${produto.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form),
    })
      .then(r => {
        if (!r.ok) throw new Error('Erro ao salvar')
        return r.json()
      })
      .then((updated: Produto) => {
        setProdutos(prev =>
          prev.map(p => p.id === updated.id ? updated : p)
        )
        onClose()
      })
      .catch(console.error)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-prod wide">
        <h2>Editar Produto</h2>
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
