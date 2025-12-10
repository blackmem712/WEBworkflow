'use client'

import { useState } from 'react'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'
import ConfirmDialog from '@/components/ConfirmDialog'
import { Cliente } from '@/types/cliente/cliente'

interface Props {
  onClose: () => void
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
  onCreated?: (cliente: Cliente) => void
}

type ClienteCreate = Omit<Cliente, 'id'>

const initialForm: ClienteCreate = {
  nome: '',
  cpf: '',
  email: '',
  cep: null,
  rua: '',
  numero: null,
  bairro: '',
  cidade: '',
  estado: '',
  telefone: '',
}

export default function ModalNovoCliente({ onClose, setClientes, onCreated }: Props) {
  const [form, setForm] = useState<ClienteCreate>(initialForm)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (name === 'cep' || name === 'numero') {
      setForm((prev) => ({ ...prev, [name]: value === '' ? null : Number(value) }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSalvar = () => {
    fetch('http://127.0.0.1:8000/pessoas/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao criar cliente')
        return response.json()
      })
      .then((novo: Cliente) => {
        setClientes((prev) => [...prev, novo])
        onCreated?.(novo)
        setShowConfirm(false)
        onClose()
        setForm(initialForm)
      })
      .catch(console.error)
  }

  return (
    <ModalShell
      title="Novo Cliente"
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
            value={form.cep != null ? form.cep.toString() : ''}
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
            label="Numero"
            name="numero"
            value={form.numero != null ? form.numero.toString() : ''}
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

      <ConfirmDialog
        open={showConfirm}
        title="Confirmar cadastro"
        message="Tem certeza que deseja cadastrar este novo cliente?"
        confirmText="Salvar"
        cancelText="Cancelar"
        variant="info"
        onConfirm={handleSalvar}
        onCancel={() => setShowConfirm(false)}
      />
    </ModalShell>
  )
}

