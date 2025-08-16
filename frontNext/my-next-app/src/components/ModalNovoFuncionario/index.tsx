// src/components/ModalNovoFuncionario/index.tsx
'use client'

import React, { useEffect, useState, ChangeEvent } from 'react'
import { Funcionario, Cargo, Setor } from '@/types/funcionario/funcionario'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import '@/styles/components/modalFuncionario.css'

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
  RC: 'Recepcionista',
}
const SETOR_LABELS: Record<Setor['setor'], string> = {
  RE: 'Recepção',
  OF: 'Oficina',
  ES: 'Estoque',
}

interface FormState {
  nome: string | null
  cpf: string | null
  email: string | null
  cep: number | null
  rua: string | null
  numero: number | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  telefone: string | null
}

export default function ModalNovoFuncionario({
  onClose,
  setFuncionarios,
  cargos,
  setores,
}: ModalNovoFuncionarioProps) {
  const [form, setForm] = useState<FormState>({
    nome: null,
    cpf: null,
    email: null,
    cep: null,
    rua: null,
    numero: null,
    bairro: null,
    cidade: null,
    estado: null,
    telefone: null,
  })

  // ⚠️ controla selects como string; converte para number no salvar
  const [cargoId, setCargoId] = useState<string>('') // '' = não selecionado
  const [setorId, setSetorId] = useState<string>('')

  // Fallback/local cache das listas (caso venham vazias por props)
  const [cargosData, setCargosData] = useState<Cargo[]>(cargos ?? [])
  const [setoresData, setSetoresData] = useState<Setor[]>(setores ?? [])
  const [loadingCargos, setLoadingCargos] = useState(false)
  const [loadingSetores, setLoadingSetores] = useState(false)

  // Sincroniza quando o pai carregar depois de abrir o modal
  useEffect(() => { setCargosData(cargos ?? []) }, [cargos])
  useEffect(() => { setSetoresData(setores ?? []) }, [setores])

  // Busca fallback se abrir o modal antes do carregamento do pai
  useEffect(() => {
    if (!cargos || cargos.length === 0) {
      setLoadingCargos(true)
      fetch('http://127.0.0.1:8000/cargos/api/v1/')
        .then(r => r.json())
        .then((data: Cargo[]) => setCargosData(data))
        .catch(console.error)
        .finally(() => setLoadingCargos(false))
    }
    if (!setores || setores.length === 0) {
      setLoadingSetores(true)
      fetch('http://127.0.0.1:8000/setores/api/v1/')
        .then(r => r.json())
        .then((data: Setor[]) => setSetoresData(data))
        .catch(console.error)
        .finally(() => setLoadingSetores(false))
    }
  // só dispara na montagem
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'cep' || name === 'numero') {
      setForm(prev => ({ ...prev, [name]: value === '' ? null : Number(value) }))
    } else {
      setForm(prev => ({ ...prev, [name]: value || null }))
    }
  }

  const handleSalvar = () => {
    if (!cargoId || !setorId) {
      alert('Selecione um Cargo e um Setor.')
      return
    }

    const payload = {
      ...form,
      cargo: Number(cargoId),
      setor: Number(setorId),
    }

    fetch('http://127.0.0.1:8000/funcionarios/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao criar funcionário')
        return res.json()
      })
      .then((novo: Funcionario) => {
        setFuncionarios(prev => [...prev, novo])
        onClose()
      })
      .catch(err => {
        console.error(err)
        alert('Não foi possível salvar. Verifique os campos.')
      })
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

          {/* SELECTS controlados como string; usam dados locais (props ou fallback) */}
          <div className="grid-col-6">
            <label htmlFor="cargo">Cargo</label>
            <select
              id="cargo"
              value={cargoId}
              onChange={e => setCargoId(e.target.value)}
              disabled={loadingCargos}
            >
              <option value="">
                {loadingCargos ? 'Carregando...' : 'Selecione...'}
              </option>
              {cargosData.map(c => (
                <option key={c.id} value={String(c.id)}>
                  {CARGO_LABELS[c.cargo] ?? c.cargo}
                </option>
              ))}
            </select>
            {(!loadingCargos && cargosData.length === 0) && (
              <small className="hint">Nenhum cargo encontrado.</small>
            )}
          </div>

          <div className="grid-col-6">
            <label htmlFor="setor">Setor</label>
            <select
              id="setor"
              value={setorId}
              onChange={e => setSetorId(e.target.value)}
              disabled={loadingSetores}
            >
              <option value="">
                {loadingSetores ? 'Carregando...' : 'Selecione...'}
              </option>
              {setoresData.map(s => (
                <option key={s.id} value={String(s.id)}>
                  {SETOR_LABELS[s.setor] ?? s.setor}
                </option>
              ))}
            </select>
            {(!loadingSetores && setoresData.length === 0) && (
              <small className="hint">Nenhum setor encontrado.</small>
            )}
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
