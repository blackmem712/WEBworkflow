'use client'

import { useState } from 'react'
import { Cliente } from '@/types/cliente/cliente'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'

interface Props {
  cliente: Cliente
  onClose: () => void
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
}

export default function ModalCliente({ cliente, onClose, setClientes }: Props) {
  const [form, setForm] = useState({ ...cliente })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSalvar = () => {
    fetch(`http://127.0.0.1:8000/pessoas/api/v1/${cliente.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro no PATCH')
        setClientes((prev) => prev.map((c) => (c.id === cliente.id ? { ...c, ...form } : c)))
        onClose()
      })
      .catch((error) => console.error('Erro ao salvar:', error))
  }

  return (
    <ModalShell
      title="Editar Cliente"
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
        <div className="grid-col-12">
          <InputCampo
            label="Nome"
            name="nome"
            value={form.nome ?? ''}
            onChange={handleChange}
            placeholder="Digite o nome"
          />
        </div>
        <div className="grid-col-12">
          <InputCampo
            label="Email"
            name="email"
            value={form.email ?? ''}
            onChange={handleChange}
            placeholder="email@exemplo.com"
          />
        </div>
        <div className="grid-col-4">
          <InputCampo
            label="CPF"
            name="cpf"
            value={form.cpf ?? ''}
            onChange={handleChange}
            placeholder="00000000000"
          />
        </div>
        <div className="grid-col-4">
          <InputCampo
            label="CEP"
            name="cep"
            value={form.cep ?? ''}
            onChange={handleChange}
            placeholder="00000-000"
          />
        </div>
        <div className="grid-col-4">
          <InputCampo
            label="Telefone"
            name="telefone"
            value={form.telefone ?? ''}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
        </div>
        <div className="grid-col-8">
          <InputCampo
            label="Rua"
            name="rua"
            value={form.rua ?? ''}
            onChange={handleChange}
            placeholder="Nome da rua"
          />
        </div>
        <div className="grid-col-4">
          <InputCampo
            label="NAomero"
            name="numero"
            value={form.numero ?? ''}
            onChange={handleChange}
            placeholder="123"
          />
        </div>
        <div className="grid-col-4">
          <InputCampo
            label="Bairro"
            name="bairro"
            value={form.bairro ?? ''}
            onChange={handleChange}
            placeholder="Seu bairro"
          />
        </div>
        <div className="grid-col-4">
          <InputCampo
            label="Cidade"
            name="cidade"
            value={form.cidade ?? ''}
            onChange={handleChange}
            placeholder="Sua cidade"
          />
        </div>
        <div className="grid-col-4">
          <InputCampo
            label="Estado"
            name="estado"
            value={form.estado ?? ''}
            onChange={handleChange}
            placeholder="Seu estado"
          />
        </div>
      </div>
    </ModalShell>
  )
}

