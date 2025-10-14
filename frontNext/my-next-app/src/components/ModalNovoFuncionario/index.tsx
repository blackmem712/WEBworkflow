// src/components/ModalNovoFuncionario/index.tsx
'use client'

import React, { useEffect, useState, ChangeEvent } from 'react'
import { Funcionario, Cargo, Setor } from '@/types/funcionario/funcionario'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'

interface ModalNovoFuncionarioProps {
  onClose: () => void
  setFuncionarios: React.Dispatch<React.SetStateAction<Funcionario[]>>
  cargos: Cargo[]
  setores: Setor[]
}

const CARGO_LABELS: Record<Cargo['cargo'], string> = {
  TC: 'Tecnico',
  GE: 'Gerente',
  RC: 'Recepcionista',
}

const SETOR_LABELS: Record<Setor['setor'], string> = {
  RE: 'Recepcao',
  OF: 'Oficina',
  ES: 'Estoque',
}

type FormState = {
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

  const [cargoId, setCargoId] = useState('')
  const [setorId, setSetorId] = useState('')

  const [cargosData, setCargosData] = useState<Cargo[]>(cargos ?? [])
  const [setoresData, setSetoresData] = useState<Setor[]>(setores ?? [])
  const [loadingCargos, setLoadingCargos] = useState(false)
  const [loadingSetores, setLoadingSetores] = useState(false)

  useEffect(() => { setCargosData(cargos ?? []) }, [cargos])
  useEffect(() => { setSetoresData(setores ?? []) }, [setores])

  useEffect(() => {
    if (!cargos || cargos.length === 0) {
      setLoadingCargos(true)
      fetch('http://127.0.0.1:8000/cargos/api/v1/')
        .then((response) => response.json())
        .then((data: Cargo[]) => setCargosData(data))
        .catch(console.error)
        .finally(() => setLoadingCargos(false))
    }
    if (!setores || setores.length === 0) {
      setLoadingSetores(true)
      fetch('http://127.0.0.1:8000/setores/api/v1/')
        .then((response) => response.json())
        .then((data: Setor[]) => setSetoresData(data))
        .catch(console.error)
        .finally(() => setLoadingSetores(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (name === 'cep' || name === 'numero') {
      setForm((prev) => ({ ...prev, [name]: value === '' ? null : Number(value) }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value || null }))
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
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao criar funcionario')
        return response.json()
      })
      .then((novo: Funcionario) => {
        setFuncionarios((prev) => [...prev, novo])
        onClose()
      })
      .catch(console.error)
  }

  return (
    <ModalShell
      title="Novo Funcionario"
      onClose={onClose}
      size="xl"
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
            placeholder="Nome do funcionario"
          />
        </div>
        <div className="grid-col-12">
          <InputCampo
            label="Email"
            name="email"
            type="email"
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
            label="Telefone"
            name="telefone"
            value={form.telefone ?? ''}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
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
        <div className="grid-col-6">
          <label htmlFor="cargo">Cargo</label>
          <select
            id="cargo"
            value={cargoId}
            onChange={(event) => setCargoId(event.target.value)}
            disabled={loadingCargos}
          >
            <option value="">
              {loadingCargos ? 'Carregando...' : 'Selecione...'}
            </option>
            {cargosData.map((cargo) => (
              <option key={cargo.id} value={String(cargo.id)}>
                {CARGO_LABELS[cargo.cargo] ?? cargo.cargo}
              </option>
            ))}
          </select>
          {!loadingCargos && cargosData.length === 0 && (
            <small className="hint">Nenhum cargo encontrado.</small>
          )}
        </div>
        <div className="grid-col-6">
          <label htmlFor="setor">Setor</label>
          <select
            id="setor"
            value={setorId}
            onChange={(event) => setSetorId(event.target.value)}
            disabled={loadingSetores}
          >
            <option value="">
              {loadingSetores ? 'Carregando...' : 'Selecione...'}
            </option>
            {setoresData.map((setor) => (
              <option key={setor.id} value={String(setor.id)}>
                {SETOR_LABELS[setor.setor] ?? setor.setor}
              </option>
            ))}
          </select>
          {!loadingSetores && setoresData.length === 0 && (
            <small className="hint">Nenhum setor encontrado.</small>
          )}
        </div>
      </div>
    </ModalShell>
  )
}

