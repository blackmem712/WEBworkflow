'use client'

import { useState } from 'react'
import InputCampo from '@/components/InputCampo'
import '@/styles/components/ModalClientes.css'
import { Cliente } from '@/types/cliente/cliente'   


interface Props {
  cliente: Cliente
  onClose: () => void
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
}

export default function ModalCliente({ cliente, onClose, setClientes }: Props) {
  const [form, setForm] = useState({ ...cliente })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSalvar = () => {
    fetch(`http://127.0.0.1:8000/pessoas/api/v1/${cliente.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro no PATCH')
        // Atualiza a lista de clientes no estado do pai
        setClientes(prev =>
          prev.map(c => (c.id === cliente.id ? { ...c, ...form } : c))
        )
        onClose()
      })
      .catch(err => console.error('Erro ao salvar:', err))
  }

   return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Cliente</h2>

        <div className="form-grid">
          <div className="grid-col-12">
            <InputCampo
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Digite o nome"
            />
          </div>

          <div className="grid-col-12">
            <InputCampo
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="grid-col-4">
            <InputCampo
              label="CPF"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              placeholder="00000000000"
            />
          </div>
          <div className="grid-col-4">
            <InputCampo
              label="CEP"
              name="cep"
              value={form.cep}
              onChange={handleChange}
              placeholder="00000-000"
            />
          </div>
          <div className="grid-col-4">
            <InputCampo
              label="Telefone"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="grid-col-8">
            <InputCampo
              label="Rua"
              name="rua"
              value={form.rua}
              onChange={handleChange}
              placeholder="Nome da rua"
            />
          </div>
          <div className="grid-col-4">
            <InputCampo
              label="Número"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              placeholder="123"
            />
          </div>

          <div className="grid-col-4">
            <InputCampo
              label="Bairro"
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              placeholder="Seu bairro"
            />
          </div>
          <div className="grid-col-4">
            <InputCampo
              label="Cidade"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              placeholder="Sua cidade"
            />
          </div>
          <div className="grid-col-4">
            <InputCampo
              label="Estado"
              name="estado"
              value={form.estado}
              onChange={handleChange}
              placeholder="Seu estado"
            />
          </div>
        </div>

        <div className="modal-botoes">
          <button onClick={handleSalvar} className="btn-salvar">
            Salvar
          </button>
          <button onClick={onClose} className="btn-cancelar">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
