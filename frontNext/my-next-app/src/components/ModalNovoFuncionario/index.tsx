'use client'


import React, { useState,ChangeEvent  } from 'react'
import { Funcionario, FuncionarioForm } from '@/types/funcionario/funcionario'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import '@/styles/components/modalFuncionario.css'

interface Cargo {
  id: number
  cargo: 'TC' | 'GE' | 'RC'
}
interface Setor {
  id: number
  setor: 'RE' | 'OF' | 'ES'
}

interface ModalNovoFuncionarioProps {
  onClose: () => void
  setFuncionarios: React.Dispatch<React.SetStateAction<Funcionario[]>>
  cargos: Cargo[]
  setores: Setor[]
}

// Labels legíveis para cada código
const CARGO_LABELS: Record<Cargo['cargo'], string> = {
  TC: 'Técnico',
  GE: 'Gerente',
  RC: 'Recepcionista'
}
const SETOR_LABELS: Record<Setor['setor'], string> = {
  RE: 'Recepção',
  OF: 'Oficina',
  ES: 'Estoque'
}

interface FormState {
  nome:     string | null
  cpf:      string | null
  email:    string | null
  cep:      number | null
  rua:      string | null
  numero:   number | null
  bairro:   string | null
  cidade:   string | null
  estado:   string | null
  telefone: string | null
  cargo:    number | null
  setor:    number | null
}

export default function ModalNovoFuncionario({
  onClose,
  setFuncionarios,
  cargos,
  setores
}: ModalNovoFuncionarioProps) {
  const [form, setForm] = useState<FormState>({
    nome:     null,
    cpf:      null,
    email:    null,
    cep:      null,
    rua:      null,
    numero:   null,
    bairro:   null,
    cidade:   null,
    estado:   null,
    telefone: null,
    cargo:    null,
    setor:    null
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: ['cep', 'numero', 'cargo', 'setor'].includes(name)
        ? (value === '' ? null : Number(value))
        : (value || null)
    }))
  }

  const handleSalvar = () => {
    fetch('http://127.0.0.1:8000/funcionarios/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao criar funcionário')
        return res.json()
      })
      .then((novo: Funcionario) => {
        setFuncionarios(prev => [...prev, novo])
        onClose()
      })
      .catch(console.error)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-func wide">
        <h2>Novo Funcionário</h2>

        <div className="form-grid">
          <div className="grid-col-12">
            <InputCampo
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome completo"
            />
          </div>

          <div className="grid-col-12">
            <InputCampo
              label="Email"
              name="email"
              type="email"
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
              label="Telefone"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
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

          <div className="grid-col-6">
            <label htmlFor="cargo">Cargo</label>
            <select
              id="cargo"
              name="cargo"
              value={form.cargo != null ? form.cargo.toString() : ''}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              {cargos.map(c => (
                <option key={c.id} value={c.id.toString()}>
                  {CARGO_LABELS[c.cargo]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-col-6">
            <label htmlFor="setor">Setor</label>
            <select
              id="setor"
              name="setor"
              value={form.setor != null ? form.setor.toString() : ''}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              {setores.map(s => (
                <option key={s.id} value={s.id.toString()}>
                  {SETOR_LABELS[s.setor]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-buttons">
          <Button variant="primary" onClick={handleSalvar}>
            Salvar
          </Button>
          <Button variant="danger" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}