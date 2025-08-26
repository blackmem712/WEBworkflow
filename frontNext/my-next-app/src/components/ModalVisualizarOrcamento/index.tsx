'use client'

import React, { useState, ChangeEvent } from 'react'
import { Orcamento }   from '@/types/orcamento/orcamento'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente }     from '@/types/cliente/cliente'
import { Servico }     from '@/types/servico/servico'
import { Produto }     from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import Button          from '@/components/buton'
import '@/styles/components/modalOrcamento.css' // <- CSS escopado para este modal

interface Props {
  orcamento: Orcamento
  cliente: Cliente
  equipamento: Equipamento
  servicos: Servico[]
  produtos: Produto[]
  funcionarios: Funcionario[]
  onClose: () => void
  setOrcamentos: React.Dispatch<React.SetStateAction<Orcamento[]>>
  setEquipamentos: React.Dispatch<React.SetStateAction<Equipamento[]>>
  /** 'assign' (atribuir técnico e enviar p/ MA) ou 'maintenance' (concluir e ir p/ GA).
   *  Quando não informado, deduz pelo status do equipamento. */
  mode?: 'assign' | 'maintenance'
  /** Desabilita o select do técnico (somente leitura). */
  readOnlyTech?: boolean
}

// Helpers para aceitar cargo numérico OU string
const cargoIsTCorGE = (cargo: number | string | null | undefined) => {
  if (cargo == null) return false
  if (typeof cargo === 'number') return cargo === 2 || cargo === 3   // 2=TC, 3=GE
  return cargo === 'TC' || cargo === 'GE'
}
const cargoLabel = (cargo: number | string | null | undefined) => {
  if (cargo == null) return ''
  if (typeof cargo === 'number') return ({ 1:'RC', 2:'TC', 3:'GE' } as const)[cargo] ?? String(cargo)
  return cargo
}

export default function ModalVisualizarOrcamento({
  orcamento,
  cliente,
  equipamento,
  servicos,
  produtos,
  funcionarios,
  onClose,
  setOrcamentos,
  setEquipamentos,
  mode: givenMode,
  readOnlyTech,
}: Props) {

  // modo deduzido pelo status, caso não seja informado via prop
  const derivedMode: 'assign' | 'maintenance' =
    givenMode ?? (equipamento.status?.status === 'MA' ? 'maintenance' : 'assign')

  const isMaintenance = derivedMode === 'maintenance'
  const isReadOnlyTech = readOnlyTech ?? isMaintenance

  const [techId, setTechId] = useState<number | null>(orcamento.cargo_funcionario ?? null)

  const handleTechChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTechId(e.target.value ? Number(e.target.value) : null)
  }

  // Atribui técnico e envia p/ MA
  const handleSalvar = () => {
    if (techId == null) return

    // 1) Atribui técnico ao orçamento
    fetch(`http://127.0.0.1:8000/orcamentos/api/v1/${orcamento.id}/`, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ cargo_funcionario: techId })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao atribuir técnico')
        return res.json()
      })
      .then((updated: Orcamento) => {
        // 2) Atualiza store de orçamentos
        setOrcamentos(prev => prev.map(o => o.id === updated.id ? updated : o))

        // 3) Atualiza equipamento p/ MA
        return fetch(`http://127.0.0.1:8000/equipamentos/api/v1/${equipamento.id}/`, {
          method: 'PATCH',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ status: 'MA' })
        })
      })
      .then(res => {
        if (!res || !res.ok) throw new Error('Erro ao mudar equipamento para MA')
        // 4) Reflita no front
        setEquipamentos(prev =>
          prev.map(e =>
            e.id === equipamento.id ? { ...e, status: { ...e.status, status: 'MA' } } : e
          )
        )
        onClose()
      })
      .catch(err => {
        console.error(err)
        alert('Não foi possível atribuir técnico/enviar para manutenção.')
      })
  }

  // Conclui manutenção e envia p/ GA (Entrega)
  const handleConcluir = () => {
    fetch(`http://127.0.0.1:8000/equipamentos/api/v1/${equipamento.id}/`, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ status: 'GA' })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao concluir manutenção')
        // Atualiza front
        setEquipamentos(prev =>
          prev.map(e =>
            e.id === equipamento.id ? { ...e, status: { ...e.status, status: 'GA' } } : e
          )
        )
        onClose()
      })
      .catch(err => {
        console.error(err)
        alert('Não foi possível concluir a manutenção.')
      })
  }

  return (
    <div className="mvo modal-overlay">
      <div className="mvo modal-window">
        <h2 className="mvo title">Orçamento</h2>

        <div className="mvo summary">
          <p><strong>Cliente:</strong> {cliente.nome}</p>
          <p><strong>Equipamento:</strong> {equipamento.equipamento}</p>
          <p><strong>Série:</strong> {equipamento.nun_serie}</p>
        </div>

        {/* Serviços */}
        <div className="mvo entries-section">
          <h3>Serviços</h3>
          <table className="mvo entries-table">
            <thead>
              <tr><th>Serviço</th><th>Valor (R$)</th></tr>
            </thead>
            <tbody>
              {orcamento.servico.map((sid) => {
                const s = servicos.find(x => x.id === sid)
                return s ? (
                  <tr key={sid}>
                    <td>{s.nome}</td>
                    <td>{Number(s.valor ?? 0).toFixed(2)}</td>
                  </tr>
                ) : null
              })}
            </tbody>
          </table>
        </div>

        {/* Produtos */}
        <div className="mvo entries-section">
          <h3>Produtos</h3>
          <table className="mvo entries-table">
            <thead>
              <tr><th>Produto</th><th>Valor (R$)</th></tr>
            </thead>
            <tbody>
              {orcamento.produto.map((pid) => {
                const p = produtos.find(x => x.id === pid)
                return p ? (
                  <tr key={pid}>
                    <td>{p.nome}</td>
                    <td>{Number(p.valor ?? 0).toFixed(2)}</td>
                  </tr>
                ) : null
              })}
            </tbody>
          </table>
        </div>

        {/* Técnico Responsável */}
        <div className="mvo form-grid">
          <div className="mvo grid-col-12">
            <label>Técnico Responsável</label>
            <select
              value={techId ?? ''}
              onChange={handleTechChange}
              disabled={isReadOnlyTech}
            >
              <option value="">Selecione o técnico...</option>
              {funcionarios
                .filter(f => f.cargo_funcionario && cargoIsTCorGE(f.cargo_funcionario.cargo))
                .map(f => (
                  <option key={f.id} value={f.cargo_funcionario!.id}>
                    {f.nome} — {cargoLabel(f.cargo_funcionario?.cargo)}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="mvo modal-buttons">
          {isMaintenance ? (
            <Button variant="success" onClick={handleConcluir}>
              Concluir Manutenção
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSalvar}>
              Atribuir e Enviar p/ Manutenção
            </Button>
          )}
          <Button variant="danger" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  )
}