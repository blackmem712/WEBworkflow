'use client'

import { useState } from 'react'
import { Servico } from '@/types/servico/servico'
import Button from '@/components/buton'
import '@/styles/components/tabelaServicos.css'

interface Props {
  servicos: Servico[]
  onSelecionar: (s: Servico) => void
  onNovo: () => void
}

export default function TabelaServicos({ servicos, onSelecionar, onNovo }: Props) {
  const [filtro, setFiltro] = useState('')

  const filtrados = servicos.filter(s =>
    s.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    s.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
    s.valor.toString().includes(filtro)
  )

  return (
    <div className="tabela-serv-container">
      <div className="tabela-controls">
        <input
          type="text"
          placeholder="Buscar nome, descrição ou valor..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="tabela-busca"
        />
        <Button onClick={onNovo} variant="primary">+ Novo Serv.</Button>
      </div>

      <table className="tabela-serv">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Valor (R$)</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(s => (
            <tr key={s.id} onClick={() => onSelecionar(s)}>
              <td>{s.nome}</td>
              <td>{s.valor.toFixed(2)}</td>
              <td>{s.descricao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
