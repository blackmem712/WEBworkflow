// src/components/ModalProduto.tsx
'use client'

import { useState, ChangeEvent } from 'react'
import { Produto } from '@/types/produto/produto'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'

interface Props {
  produto: Produto
  onClose: () => void
  setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>
}

interface FormState {
  nome: string
  marca: string
  modelo: string
  preco: number
  descricao: string
}

export default function ModalProduto({ produto, onClose, setProdutos }: Props) {
  const [form, setForm] = useState<FormState>({
    nome: produto.nome,
    marca: produto.marca,
    modelo: produto.modelo,
    preco: produto.preco,
    descricao: produto.descricao,
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'preco' ? Number(value) : value,
    }))
  }

  const handleSalvar = () => {
    fetch(`http://127.0.0.1:8000/produtos/api/v1/${produto.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao salvar')
        return response.json()
      })
      .then((updated: Produto) => {
        setProdutos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        onClose()
      })
      .catch(console.error)
  }

  return (
    <ModalShell
      title="Editar Produto"
      onClose={onClose}
      size="md"
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
            label="Marca"
            name="marca"
            value={form.marca}
            onChange={handleChange}
          />
        </div>
        <div className="grid-col-6">
          <InputCampo
            label="Modelo"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
          />
        </div>
        <div className="grid-col-6">
          <InputCampo
            label="PreAo (R$)"
            name="preco"
            type="number"
            value={form.preco}
            onChange={handleChange}
          />
        </div>
        <div className="grid-col-12">
          <label htmlFor="descricao-produto">Descrição</label>
          <textarea
            id="descricao-produto"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>
    </ModalShell>
  )
}

