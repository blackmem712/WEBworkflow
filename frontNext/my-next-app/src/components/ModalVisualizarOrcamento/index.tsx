'use client'

import React, { useState, ChangeEvent } from 'react'
import { Orcamento } from '@/types/orcamento/orcamento'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente } from '@/types/cliente/cliente'
import { Servico } from '@/types/servico/servico'
import { Produto } from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import { api } from '@/services/api'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'
import '@/styles/components/modalVisualizarOrcamento.css'
import '@/styles/components/modalOrcamento.css'

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
  mode?: 'assign' | 'maintenance'
  readOnlyTech?: boolean
}

const cargoIsTCorGE = (cargo: number | string | null | undefined) => {
  if (cargo == null) return false
  if (typeof cargo === 'number') return cargo === 2 || cargo === 3
  return cargo === 'TC' || cargo === 'GE'
}

const cargoLabel = (cargo: number | string | null | undefined) => {
  if (cargo == null) return ''
  if (typeof cargo === 'number') {
    return (
      {
        1: 'RC',
        2: 'TC',
        3: 'GE',
      } as const
    )[cargo] ?? String(cargo)
  }
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
  const derivedMode: 'assign' | 'maintenance' = givenMode ?? (equipamento.status?.status === 'MA' ? 'maintenance' : 'assign')
  const isMaintenance = derivedMode === 'maintenance'
  const isReadOnlyTech = readOnlyTech ?? isMaintenance

  const [techId, setTechId] = useState<number | null>(orcamento.cargo_funcionario ?? null)
  const [loading, setLoading] = useState(false)

  const handleTechChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTechId(event.target.value ? Number(event.target.value) : null)
  }

  const handleSalvar = async () => {
    if (loading) return
    if (techId == null) {
      alert('Selecione o tecnico responsavel.')
      return
    }
    try {
      setLoading(true)
      const orcResponse = await api.patch(`/orcamentos/api/v1/${orcamento.id}/`, {
        cargo_funcionario: techId,
      })
      const updated: Orcamento = orcResponse.data
      setOrcamentos((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))

      await api.post(`/equipamentos/api/v1/${equipamento.id}/set_status/`, { status: 'MA' })
      const nowIso = new Date().toISOString()
      setEquipamentos((prev) =>
        prev.map((item) =>
          item.id === equipamento.id
            ? { ...item, status: { ...item.status, status: 'MA' as any, date_entrada: nowIso } }
            : item,
        ),
      )
      onClose()
    } catch (error: any) {
      console.error(error)
      alert(error?.response?.data?.detail || 'Nao foi possivel atribuir tecnico/enviar para manutencao.')
    } finally {
      setLoading(false)
    }
  }

  const handleConcluir = async () => {
    if (loading) return
    try {
      setLoading(true)
      await api.post(`/equipamentos/api/v1/${equipamento.id}/set_status/`, { status: 'GA' })
      const nowIso = new Date().toISOString()
      setEquipamentos((prev) =>
        prev.map((item) =>
          item.id === equipamento.id
            ? { ...item, status: { ...item.status, status: 'GA' as any, date_entrada: nowIso } }
            : item,
        ),
      )
      onClose()
    } catch (error: any) {
      console.error(error)
      alert(error?.response?.data?.detail || 'Nao foi possivel concluir a manutencao.')
    } finally {
      setLoading(false)
    }
  }

  const footer = (
    <>
      {isMaintenance ? (
        <Button type="button" variant="success" onClick={handleConcluir} disabled={loading}>
          {loading ? 'Concluindo...' : 'Concluir Manutencao'}
        </Button>
      ) : (
        <Button
          type="button"
          variant="primary"
          onClick={handleSalvar}
          disabled={loading || techId == null}
        >
          {loading ? 'Enviando...' : 'Atribuir e Enviar para Manutencao'}
        </Button>
      )}
      <Button type="button" variant="danger" onClick={onClose} disabled={loading}>
        Fechar
      </Button>
    </>
  )

  const techOptions = funcionarios
    .filter((funcionario) => funcionario.cargo_funcionario && cargoIsTCorGE(funcionario.cargo_funcionario.cargo))
    .map((funcionario) => (
      <option key={funcionario.id} value={funcionario.cargo_funcionario!.id}>
        {funcionario.nome} - {cargoLabel(funcionario.cargo_funcionario?.cargo)}
      </option>
    ))

  return (
    <ModalShell
      title="Orcamento"
      onClose={onClose}
      size="lg"
      footer={footer}
      bodyClassName="modal-vo"
    >
      <section className="summary-panel">
        <div>
          <span className="summary-label">Cliente</span>
          <span className="summary-value">{cliente.nome}</span>
        </div>
        <div>
          <span className="summary-label">Equipamento</span>
          <span className="summary-value">{equipamento.equipamento}</span>
        </div>
        <div>
          <span className="summary-label">Serie</span>
          <span className="summary-value">{equipamento.nun_serie}</span>
        </div>
      </section>

      <div className="entries-section">
        <div className="entries-header">
          <h3>Servicos</h3>
        </div>
        <table className="entries-table">
          <thead>
            <tr>
              <th>Servico</th>
              <th>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {orcamento.servico.map((id) => {
              const servico = servicos.find((item) => item.id === id)
              return servico ? (
                <tr key={id}>
                  <td>{servico.nome}</td>
                  <td>{Number(servico.valor ?? 0).toFixed(2)}</td>
                </tr>
              ) : null
            })}
          </tbody>
        </table>
      </div>

      <div className="entries-section">
        <div className="entries-header">
          <h3>Produtos</h3>
        </div>
        <table className="entries-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {orcamento.produto.map((id) => {
              const produto = produtos.find((item) => item.id === id)
              return produto ? (
                <tr key={id}>
                  <td>{produto.nome}</td>
                  <td>{Number((produto as any).preco ?? 0).toFixed(2)}</td>
                </tr>
              ) : null
            })}
          </tbody>
        </table>
      </div>

      <div className="modal-grid">
        <div className="grid-col-12">
          <label htmlFor="orcamento-tecnico">Tecnico Responsavel</label>
          <select
            id="orcamento-tecnico"
            value={techId ?? ''}
            onChange={handleTechChange}
            disabled={isReadOnlyTech || loading}
          >
            <option value="">Selecione o tecnico...</option>
            {techOptions}
          </select>
        </div>
      </div>
    </ModalShell>
  )
}
