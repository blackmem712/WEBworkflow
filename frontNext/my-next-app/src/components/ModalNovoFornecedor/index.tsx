// src/components/ModalNovoFornecedor.tsx
'use client'

import { useState, ChangeEvent } from 'react'
import { Fornecedor } from '@/types/fornecedor/fornecedor'
import { Produto }    from '@/types/produto/produto'
import InputCampo from '@/components/InputCampo'
import Button     from '@/components/buton'
import '@/styles/components/modalFornecedor.css'

interface Props {
  produtos: Produto[]
  onClose: () => void
  setFornecedores: React.Dispatch<React.SetStateAction<Fornecedor[]>>
}

export default function ModalNovoFornecedor({
  produtos, onClose, setFornecedores
}: Props) {
  const [form, setForm] = useState<Omit<Fornecedor,'id'>>({
    nome:      '',
    cnpj:      '',
    telefone:  '',
    descricao: '',
    produtos:  []
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, selectedOptions } = e.target as HTMLSelectElement
    if (name === 'produtos' && selectedOptions) {
      const vals = Array.from(selectedOptions).map(o => Number(o.value))
      setForm(prev => ({ ...prev, produtos: vals }))
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSalvar = () => {
    fetch('http://127.0.0.1:8000/fornecedores/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form),
    })
      .then(r => {
        if (!r.ok) throw new Error('Erro ao criar fornecedor')
        return r.json()
      })
      .then((novo: Fornecedor) => {
        setFornecedores(prev => [...prev, novo])
        onClose()
      })
      .catch(console.error)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-forn wide">
        <h2>Novo Fornecedor</h2>
        <div className="form-grid">
          <div className="grid-col-6">
            <InputCampo label="Nome"    name="nome"    value={form.nome}    onChange={handleChange}/>
          </div>
          <div className="grid-col-6">
            <InputCampo label="CNPJ"    name="cnpj"    value={form.cnpj}    onChange={handleChange}/>
          </div>
          <div className="grid-col-6">
            <InputCampo label="Telefone" name="telefone" value={form.telefone} onChange={handleChange}/>
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
          <div className="grid-col-12">
            <label>Produtos</label>
            <select
              name="produtos"
              multiple
              value={form.produtos.map(id => id.toString())}
              onChange={handleChange}
            >
              {produtos.map(p => (
                <option key={p.id} value={p.id.toString()}>
                  {p.nome}
                </option>
              ))}
            </select>
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
