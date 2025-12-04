'use client'

import { useState } from 'react'
import { Funcionario, Cargo, Setor } from '@/types/funcionario/funcionario'
import Button from '@/components/buton' 
import '@/styles/components/tabelaFuncionario.css'


interface Props {
  funcionarios: Funcionario[]
  cargos: Cargo[]
  setores: Setor[]
  onSelecionar: (f: Funcionario) => void
  onNovo: () => void
}

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

export default function TabelaFuncionarios({
  funcionarios, cargos, setores, onSelecionar, onNovo
}: Props) {

  const [filtro, setFiltro] = useState('')

  const cargoCode = (id: any) =>
    cargos.find(c => c.id === Number(id))?.cargo

  const setorCode = (id: any) =>
    setores.find(s => s.id === Number(id))?.setor

  const cargoLabel = (id: any) => {
    const code = cargoCode(id)
    return code ? CARGO_LABELS[code] : ''
  }
  const setorLabel = (id: any) => {
    const code = setorCode(id)
    return code ? SETOR_LABELS[code] : ''
  }

    const filtrados = funcionarios.filter(f => {
      const c = cargoCode(f.cargo_funcionario?.cargo)
      const s = setorCode(f.cargo_funcionario?.setor)
      return (
        (f.nome ?? '').toLowerCase().includes(filtro.toLowerCase()) ||
        (f.email ?? '').toLowerCase().includes(filtro.toLowerCase()) ||
        (c && CARGO_LABELS[c]?.toLowerCase().includes(filtro.toLowerCase())) ||
        (s && SETOR_LABELS[s]?.toLowerCase().includes(filtro.toLowerCase()))
      )
    })
  

  return (
    <div className="tabela-func-container">
      <div className="tabela-controls">
        <input
          type="text"
          placeholder="Buscar nome, email, cargo ou setor..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="tabela-busca"
        />
        <Button onClick={onNovo} variant="primary">+ Novo Func.</Button>
      </div>

      <table className="tabela-func">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Cargo</th>
            <th>Setor</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(f => (
            <tr key={f.id} onClick={() => onSelecionar(f)}>
              <td>{f.nome}</td>
              <td>{f.email}</td>
              <td>{f.telefone}</td>
              <td>{cargoLabel(f.cargo_funcionario?.cargo)}</td>
              <td>{setorLabel(f.cargo_funcionario?.setor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
