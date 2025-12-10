// src/components/ModalNovoProduto.tsx
'use client'

import { useState, ChangeEvent } from 'react'
import { Produto } from '@/types/produto/produto'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'
import ConfirmDialog from '@/components/ConfirmDialog'

interface Props {
  onClose: () => void
  setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>
}

type ProdutoCreate = Omit<Produto, 'id'>

export default function ModalNovoProduto({ onClose, setProdutos }: Props) {
  const [form, setForm] = useState<ProdutoCreate>({
    nome: '',
    marca: '',
    modelo: '',
    preco: 0,
    descricao: '',
  })
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'preco' ? Number(value) : value,
    }))
  }

  const handleSalvar = () => {
    fetch('http://127.0.0.1:8000/produtos/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao criar produto')
        return response.json()
      })
      .then((novo: Produto) => {
        setProdutos((prev) => [...prev, novo])
        setShowConfirm(false)
        onClose()
      })
      .catch(console.error)
  }

  return (
    <ModalShell
      title="Novo Produto"
      onClose={onClose}
      size="md"
      footer={(
        <>
          <Button type="button" variant="danger" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={() => setShowConfirm(true)}>
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
          <label htmlFor="descricao-novo-produto">Descrição</label>
          <textarea
            id="descricao-novo-produto"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Confirmar cadastro"
        message="Tem certeza que deseja cadastrar este novo produto?"
        confirmText="Salvar"
        cancelText="Cancelar"
        variant="info"
        onConfirm={handleSalvar}
        onCancel={() => setShowConfirm(false)}
      />
    </ModalShell>
  )
}

