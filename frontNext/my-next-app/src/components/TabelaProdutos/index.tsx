// src/components/TabelaProdutos.tsx
'use client'

import { useState } from 'react'
import { Produto } from '@/types/produto/produto'
import Button from '@/components/buton'
import '@/styles/components/tabelaProdutos.css'

interface Props {
  produtos: Produto[]
  onSelecionar: (p: Produto) => void
  onNovo: () => void
}

export default function TabelaProdutos({ produtos, onSelecionar, onNovo }: Props) {
  const [filtro, setFiltro] = useState('')

  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    p.marca.toLowerCase().includes(filtro.toLowerCase()) ||
    p.modelo.toLowerCase().includes(filtro.toLowerCase()) ||
    p.preco.toString().includes(filtro) ||
    p.descricao.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="tabela-prod-container">
      <div className="tabela-controls">
        <input
          type="text"
          placeholder="Buscar nome, marca, modelo, preAo ou descriAA?o..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="tabela-busca"
        />
        <Button onClick={onNovo} variant="primary">+ Novo Prod.</Button>
      </div>

      <table className="tabela-prod">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>PreAo (R$)</th>
            <th>DescriAA?o</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(p => (
            <tr key={p.id} onClick={() => onSelecionar(p)}>
              <td>{p.nome}</td>
              <td>{p.marca}</td>
              <td>{p.modelo}</td>
              <td>{p.preco.toFixed(2)}</td>
              <td>{p.descricao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

