// src/components/TabelaFornecedores.tsx
'use client'

import { useState } from 'react'
import { Fornecedor } from '@/types/fornecedor/fornecedor'
import { Produto }    from '@/types/produto/produto'
import Button from '@/components/buton'
import '@/styles/components/tabelaFornecedores.css'

interface Props {
  fornecedores: Fornecedor[]
  produtos: Produto[]
  onSelecionar: (f: Fornecedor) => void
  onNovo: () => void
}

export default function TabelaFornecedores({
  fornecedores, produtos, onSelecionar, onNovo
}: Props) {
  const [filtro, setFiltro] = useState('')

  const nomesProdutos = (ids: number[]) =>
    produtos
      .filter(p => ids.includes(p.id))
      .map(p => p.nome)
      .join(', ')

  const filtrados = fornecedores.filter(f =>
    f.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    f.cnpj.includes(filtro) ||
    f.telefone.includes(filtro) ||
    nomesProdutos(f.produtos).toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="tabela-forn-container">
      <div className="tabela-controls">
        <input
          type="text"
          placeholder="Buscar nome, CNPJ, telefone ou produtos..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="tabela-busca"
        />
        <Button onClick={onNovo} variant="primary">
          + Novo Forn.
        </Button>
      </div>

      <table className="tabela-forn">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Telefone</th>
            <th>Produtos</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(f => (
            <tr key={f.id} onClick={() => onSelecionar(f)}>
              <td>{f.nome}</td>
              <td>{f.cnpj}</td>
              <td>{f.telefone}</td>
              <td>{nomesProdutos(f.produtos)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
