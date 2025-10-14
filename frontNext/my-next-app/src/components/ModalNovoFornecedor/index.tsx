// src/components/ModalNovoFornecedor.tsx
'use client'

import { useState, ChangeEvent } from 'react'
import { Fornecedor } from '@/types/fornecedor/fornecedor'
import { Produto } from '@/types/produto/produto'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'

interface Props {
  produtos: Produto[]
  onClose: () => void
  setFornecedores: React.Dispatch<React.SetStateAction<Fornecedor[]>>
}

export default function ModalNovoFornecedor({ produtos, onClose, setFornecedores }: Props) {
  const [form, setForm] = useState<Omit<Fornecedor, 'id'>>({
    nome: '',
    cnpj: '',
    telefone: '',
    descricao: '',
    produtos: [],
  })

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name } = event.target

    if (name === 'produtos') {
      const options = (event.target as HTMLSelectElement).selectedOptions
      const values = Array.from(options).map((option) => Number(option.value))
      setForm((prev) => ({ ...prev, produtos: values }))
      return
    }

    const value = event.target.value
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSalvar = () => {
    fetch('http://127.0.0.1:8000/fornecedores/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao criar fornecedor')
        return response.json()
      })
      .then((novo: Fornecedor) => {
        setFornecedores((prev) => [...prev, novo])
        onClose()
      })
      .catch(console.error)
  }

  return (
    <ModalShell
      title="Novo Fornecedor"
      onClose={onClose}
      size="lg"
      footer={(
        <>
          <Button type="button" variant="danger" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSalvar}>
            Salvar
          </Button>
        </>
      )}
    >
      <div className="modal-grid">
        <div className="grid-col-6">
          <InputCampo
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
          />
        </div>
        <div className="grid-col-6">
          <InputCampo
            label="CNPJ"
            name="cnpj"
            value={form.cnpj}
            onChange={handleChange}
          />
        </div>
        <div className="grid-col-6">
          <InputCampo
            label="Telefone"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
          />
        </div>
        <div className="grid-col-12">
          <label htmlFor="descricao-novo-fornecedor">Descricao</label>
          <textarea
            id="descricao-novo-fornecedor"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="grid-col-12">
          <label htmlFor="produtos-novo-fornecedor">Produtos</label>
          <select
            id="produtos-novo-fornecedor"
            name="produtos"
            multiple
            value={form.produtos.map((id) => id.toString())}
            onChange={handleChange}
          >
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
    </ModalShell>
  )
}

