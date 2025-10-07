'use client'

import React, { useState, ChangeEvent } from 'react'
import { Orcamento }   from '@/types/orcamento/orcamento'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente }     from '@/types/cliente/cliente'
import { Servico }     from '@/types/servico/servico'
import { Produto }     from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import { api }         from '@/services/api'     // axios com Bearer/refresh
import '@/styles/components/modalOrcamento.css'  // CSS escopado para este modal

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
  /** 'assign' (atribuir técnico e enviar p/ MA) ou 'maintenance' (concluir e ir p/ GA). */
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
  const [loading, setLoading] = useState(false)

  const handleTechChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTechId(e.target.value ? Number(e.target.value) : null)
  }

  // Atribui técnico e envia p/ MA (REGISTRA no banco!)
  const handleSalvar = async () => {
    if (loading) return
    if (techId == null) {
      alert('Selecione o técnico responsável.')
      return
    }
    try {
      setLoading(true)

      // 1) Atualiza o orçamento com o técnico selecionado
      const orcResp = await api.patch(`/orcamentos/api/v1/${orcamento.id}/`, {
        cargo_funcionario: techId,
      })
      const updated: Orcamento = orcResp.data
      setOrcamentos(prev => prev.map(o => (o.id === updated.id ? updated : o)))

      // 2) REGISTRA status MA no backend (action dedicada)
      await api.post(`/equipamentos/api/v1/${equipamento.id}/set_status/`, { status: 'MA' })
      const nowIso = new Date().toISOString()

      // 3) Reflete no estado local do Kanban
      setEquipamentos(prev =>
        prev.map(e =>
          e.id === equipamento.id
            ? { ...e, status: { ...e.status, status: 'MA' as any, date_entrada: nowIso } }
            : e
        )
      )

      onClose()
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data?.detail || 'Não foi possível atribuir técnico/enviar para manutenção.')
    } finally {
      setLoading(false)
    }
  }

  // Conclui manutenção e envia p/ GA (Entrega) — REGISTRA no banco
  const handleConcluir = async () => {
    if (loading) return
    try {
      setLoading(true)

      await api.post(`/equipamentos/api/v1/${equipamento.id}/set_status/`, { status: 'GA' })
      const nowIso = new Date().toISOString()

      setEquipamentos(prev =>
        prev.map(e =>
          e.id === equipamento.id
            ? { ...e, status: { ...e.status, status: 'GA' as any, date_entrada: nowIso } }
            : e
        )
      )

      onClose()
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data?.detail || 'Não foi possível concluir a manutenção.')
    } finally {
      setLoading(false)
    }
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
                    <td>{Number((p as any).preco ?? 0).toFixed(2)}</td>
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
              disabled={isReadOnlyTech || loading}
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
            <button
              className="btn btn-success"
              onClick={handleConcluir}
              disabled={loading}
            >
              {loading ? 'Concluindo…' : 'Concluir Manutenção'}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSalvar}
              disabled={loading || techId == null}
            >
              {loading ? 'Enviando…' : 'Atribuir e Enviar p/ Manutenção'}
            </button>
          )}
          <button
            className="btn btn-danger"
            onClick={onClose}
            disabled={loading}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
