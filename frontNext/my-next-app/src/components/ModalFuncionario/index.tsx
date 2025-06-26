// src/components/ModalFuncionario.tsx
'use client'

import React, { useState,ChangeEvent } from 'react'
import { Funcionario, Cargo, Setor } from '@/types/funcionario/funcionario'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import '@/styles/components/modalFuncionario.css'


interface ModalFuncionarioProps {
  funcionario: Funcionario
  onClose: () => void
  setFuncionarios: React.Dispatch<React.SetStateAction<Funcionario[]>>
  cargos: Cargo[]
  setores: Setor[]
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
  cargo:    string| null
  setor:    string | null
}

export default function ModalFuncionario({
  funcionario,
  onClose,
  setFuncionarios,
  cargos,
  setores
}: ModalFuncionarioProps) {
  // separa o vínculo de cargo/​setor do restante
  const { cargo_funcionario, ...base } = funcionario

  const [form, setForm] = useState<FormState>({
    nome:     base.nome,
    cpf:      base.cpf,
    email:    base.email,
    cep:      base.cep,
    rua:      base.rua,
    numero:   base.numero,
    bairro:   base.bairro,
    cidade:   base.cidade,
    estado:   base.estado,
    telefone: base.telefone,
    cargo:    cargo_funcionario?.cargo  ?? null,
    setor:    cargo_funcionario?.setor  ?? null
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev: FormState) => ({
      ...prev,
      [name]: ['cep','numero','cargo','setor'].includes(name)
        ? (value === '' ? null : Number(value))
        : (value || null)
    }))
  }

  const handleSalvar = () => {
    fetch("http://127.0.0.1:8000/funcionarios/api/v1/" + funcionario.id + "/", {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao salvar')
        return res.json()
      })
      .then((updated: Funcionario) => {
        setFuncionarios((prev: Funcionario[]) =>
          prev.map(f => (f.id === updated.id ? updated : f))
        )
        onClose()
      })
      .catch(console.error)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-func wide">
        <h2>Editar Funcionário</h2>

        <div className="form-grid">
          <div className="grid-col-12">
            <InputCampo
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome do funcionário"
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
                  {c.cargo}
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
                  {s.setor}
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