'use client'

import { useState } from 'react'
import { Funcionario } from '@/types/funcionario/funcionario'
import Button from '@/components/buton' 
import '@/styles/components/tabelaFuncionario.css'

interface Cargo {
  id: number
  cargo: string
}

interface Setor {
  id: number
  setor: string
}

interface Props {
  funcionarios: Funcionario[]
  cargos: Cargo[]
  setores: Setor[]
  onSelecionar: (f: Funcionario) => void
  onNovo: () => void
}

const CARGO_LABELS: Record<string,string> = {
  RC: 'Recepcionista', TC: 'Técnico', GE: 'Gerente'
}
const SETOR_LABELS: Record<string,string> = {
  RE: 'Recepção', OF: 'Oficina', ES: 'Estoque'
}

export default function TabelaFuncionarios({
  funcionarios, cargos, setores, onSelecionar, onNovo
}: Props) {
  const [filtro, setFiltro] = useState('')

  const filtrados = funcionarios.filter(f =>
    (f.nome ?? '').toLowerCase().includes(filtro.toLowerCase()) ||
    (f.email ?? '').toLowerCase().includes(filtro.toLowerCase()) ||
    CARGO_LABELS[f.cargo_funcionario.cargo ?? '']?.toLowerCase().includes(filtro.toLowerCase()) ||
    SETOR_LABELS[f.cargo_funcionario.setor ?? '']?.toLowerCase().includes(filtro.toLowerCase())
  )

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
              <td>{CARGO_LABELS[f.cargo_funcionario.cargo ?? '']}</td>
              <td>{SETOR_LABELS[f.cargo_funcionario.setor ?? '']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}