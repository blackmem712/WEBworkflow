'use client'
import { useState } from 'react'
import '@/styles/components/tabelaClientes.css'
import { Cliente } from '@/types/cliente/cliente'   
import Button from '@/components/buton'

interface Props {
  clientes: Cliente[]
  onSelecionar: (cliente: Cliente) => void
  onNovo: () => void
}

export default function TabelaClientes({ clientes, onSelecionar,onNovo  }: Props) {
  const [filtro, setFiltro] = useState('')

  const filtrados = clientes.filter(c =>
    (c.nome ?? '').toLowerCase().includes(filtro.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="tabela-container">
      <h2>Clientes cadastrados</h2>

      <div className="tabela-controls">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="tabela-busca"
        />
        <Button onClick={onNovo} variant="primary">
          + Novo Cliente
        </Button>
      </div>

      <table className="tabela-clientes">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Cidade</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(cliente => (
            <tr
              key={cliente.id}
              onClick={() => onSelecionar(cliente)}
              className="tabela-row"
            >
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>{`${cliente.cidade} - ${cliente.estado}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
