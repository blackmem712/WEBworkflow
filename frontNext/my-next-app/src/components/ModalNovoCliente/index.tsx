'use client'

import { useState } from 'react'
import InputCampo from '@/components/InputCampo'
import '@/styles/components/modalNovoCliente.css'
import { Cliente } from '@/types/cliente/cliente'   
interface Props {
  onClose: () => void
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
}



export default function ModalNovoCliente({ onClose, setClientes }: Props) {
  const [form, setForm] = useState<Omit<Cliente, 'id'>>({
    nome: '',
    cpf: '',
    email: '',
    cep: null,
    rua: '',
    numero: null,
    bairro: '',
    cidade: '',
    estado: '',
    telefone: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'cep' || name === 'numero'
        ? (value === '' ? null : Number(value))
        : value
    }))
  }

  const handleSalvar = () => {
    fetch('http://127.0.0.1:8000/pessoas/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao criar cliente')
        return res.json()
      })
      .then((novo: Cliente) => {
        setClientes(prev => [...prev, novo])
        onClose()
      })
      .catch(err => console.error(err))
  }

 return (
    <div className="modal-overlay-novo">
      <div className="modal-novo">
        <h2>Novo Cliente</h2>

        <div className="form-grid">
          <div className="grid-col-12">
            <InputCampo label="Nome"     name="nome"     value={form.nome}     onChange={handleChange} placeholder="Digite o nome" />
          </div>

          <div className="grid-col-12">
            <InputCampo label="Email"    name="email"    value={form.email}    onChange={handleChange} placeholder="email@exemplo.com" />
          </div>

          <div className="grid-col-4">
            <InputCampo label="CPF"      name="cpf"      value={form.cpf}      onChange={handleChange} placeholder="00000000000" />
          </div>
          <div className="grid-col-4">
            <InputCampo label="CEP"      name="cep"      value={form.cep}      onChange={handleChange} placeholder="00000-000" />
          </div>
          <div className="grid-col-4">
            <InputCampo label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(00) 00000-0000" />
          </div>

          <div className="grid-col-8">
            <InputCampo label="Rua"      name="rua"      value={form.rua}      onChange={handleChange} placeholder="Nome da rua" />
          </div>
          <div className="grid-col-4">
            <InputCampo label="Número"   name="numero"   value={form.numero}   onChange={handleChange} placeholder="123" />
          </div>

          <div className="grid-col-4">
            <InputCampo label="Bairro"   name="bairro"   value={form.bairro}   onChange={handleChange} placeholder="Seu bairro" />
          </div>
          <div className="grid-col-4">
            <InputCampo label="Cidade"   name="cidade"   value={form.cidade}   onChange={handleChange} placeholder="Sua cidade" />
          </div>
          <div className="grid-col-4">
            <InputCampo label="Estado"   name="estado"   value={form.estado}   onChange={handleChange} placeholder="Seu estado" />
          </div>
        </div>

        <div className="modal-novo-botoes">
          <button onClick={handleSalvar} className="btn-salvar">Salvar</button>
          <button onClick={onClose}        className="btn-cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  )
}
