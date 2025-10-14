'use client'

import { useState } from 'react'
import { Orcamento }   from '@/types/orcamento/orcamento'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Servico }     from '@/types/servico/servico'
import { Produto }     from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import Button          from '@/components/buton'
import '@/styles/components/tabelaOrcamentos.css'

interface Props {
  orcamentos: Orcamento[]
  equipamentos: Equipamento[]
  servicos: Servico[]
  produtos: Produto[]
  funcionarios: Funcionario[]
  onSelecionar: (o: Orcamento) => void
  onNovo: () => void
}

export default function TabelaOrcamentos({
  orcamentos, equipamentos, servicos, produtos, funcionarios, onSelecionar, onNovo
}: Props) {
  const [filtro, setFiltro] = useState('')

  const eqLabel = (id?: number) =>
    equipamentos.find(e => e.id === id)?.equipamento ?? ''
  const servLabels = (ids: number[]) =>
    servicos.filter(s => ids.includes(s.id)).map(s => s.nome).join(', ')
  const prodLabels = (ids: number[]) =>
    produtos.filter(p => ids.includes(p.id)).map(p => p.nome).join(', ')
  const funcName = (cfId?: number) => {
    const f = funcionarios.find(f => f.cargo_funcionario?.id === cfId)
    return f?.nome ?? ''
  }

  const filtrados = orcamentos.filter(o =>
    o.observacao.toLowerCase().includes(filtro.toLowerCase()) ||
    eqLabel(o.equipamento).toLowerCase().includes(filtro.toLowerCase()) ||
    servLabels(o.servico).toLowerCase().includes(filtro.toLowerCase()) ||
    prodLabels(o.produto).toLowerCase().includes(filtro.toLowerCase()) ||
    funcName(o.cargo_funcionario).toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="tabela-orc-container">
      <div className="tabela-controls">
        <input
          type="text"
          placeholder="Buscar observaAA?o, equipamento, serviAo, produto ou responsA!vel..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="tabela-busca"
        />
        <Button onClick={onNovo} variant="primary">+ Novo Orc.</Button>
      </div>

      <table className="tabela-orc">
        <thead>
          <tr>
            <th>ObservaAA?o</th>
            <th>Equipamento</th>
            <th>ServiAos</th>
            <th>Produtos</th>
            <th>ResponsA!vel</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(o => (
            <tr key={o.id} onClick={() => onSelecionar(o)}>
              <td>{o.observacao}</td>
              <td>{eqLabel(o.equipamento)}</td>
              <td>{servLabels(o.servico)}</td>
              <td>{prodLabels(o.produto)}</td>
              <td>{funcName(o.cargo_funcionario)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

