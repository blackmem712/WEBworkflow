'use client'

import { useState } from 'react'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente } from '@/types/cliente/cliente'
import Button from '@/components/buton'
import '@/styles/components/tabelaEquipamentos.css'

interface Props {
  equipamentos: Equipamento[]
  clientes: Cliente[]
  onSelecionar: (e: Equipamento) => void
  onNovo: () => void
}

export default function TabelaEquipamentos({ equipamentos, clientes, onSelecionar, onNovo }: Props) {
  const [filtro, setFiltro] = useState('')

  const filtrados = equipamentos.filter(e =>
    e.equipamento.toLowerCase().includes(filtro.toLowerCase()) ||
    e.marca.toLowerCase().includes(filtro.toLowerCase()) ||
    (clientes.find(c => c.id === e.cliente)?.nome ?? '')
      .toLowerCase()
      .includes(filtro.toLowerCase())
  )

  return (
    <div className="tabela-equip-container">
      <div className="tabela-controls">
        <input
          type="text"
          placeholder="Buscar equipamento, marca ou cliente..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="tabela-busca"
        />
        <Button onClick={onNovo} variant="primary">+ Novo Equip.</Button>
      </div>

      <table className="tabela-equip">
        <thead>
          <tr>
            <th>Equipamento</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Cor</th>
            <th>Série</th>
            <th>Cliente</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(e => (
            <tr key={e.id} onClick={() => onSelecionar(e)}>
              <td>{e.equipamento}</td>
              <td>{e.marca}</td>
              <td>{e.modelo}</td>
              <td>{e.cor}</td>
              <td>{e.nun_serie}</td>
              <td>{clientes.find(c => c.id === e.cliente)?.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
