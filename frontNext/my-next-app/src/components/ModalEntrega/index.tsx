'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { api } from '@/services/api'
import { STATUS_LIST } from '@/constants/status'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente } from '@/types/cliente/cliente'
import { Orcamento } from '@/types/orcamento/orcamento'
import { Servico } from '@/types/servico/servico'
import { Produto } from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'
import '@/styles/components/modalVisualizarOrcamento.css'
import '@/styles/components/modalOrcamento.css'

type Mode = 'delivery' | 'report'

type HistoricoItem = {
  id: number
  status: 'EN' | 'OR' | 'MA' | 'GA' | 'SA'
  date_entrada: string | null
  date_saida: string | null
}

interface Props {
  mode: Mode
  equipamento: Equipamento
  cliente: Cliente
  orcamento: Orcamento | null
  servicos: Servico[]
  produtos: Produto[]
  funcionarios?: Funcionario[]
  onClose: () => void
  setEquipamentos?: React.Dispatch<React.SetStateAction<Equipamento[]>>
  onAfterSetSaida?: (equipId: number) => void
}

const statusLabel = (code: string) => STATUS_LIST.find((status) => status.code === code)?.label || code

export default function ModalEntrega({
  mode,
  equipamento,
  cliente,
  orcamento,
  servicos,
  produtos,
  funcionarios,
  onClose,
  setEquipamentos,
  onAfterSetSaida,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [histLoading, setHistLoading] = useState(mode === 'report')
  const [historico, setHistorico] = useState<HistoricoItem[]>([])

  useEffect(() => {
    if (mode !== 'report') return
    let alive = true
    ;(async () => {
      try {
        setHistLoading(true)
        const response = await api.get(`/equipamentos/api/v1/${equipamento.id}/historico/`)
        if (!alive) return
        setHistorico(response.data as HistoricoItem[])
      } catch (error) {
        console.error(error)
      } finally {
        if (alive) setHistLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [mode, equipamento.id])

  const tecnico = useMemo(() => {
    if (!orcamento || !funcionarios) return null
    const cfId = orcamento.cargo_funcionario
    return funcionarios.find((funcionario) => funcionario.cargo_funcionario?.id === cfId) ?? null
  }, [orcamento, funcionarios])

  const handleConfirmSaida = async () => {
    if (loading) return
    try {
      setLoading(true)
      await api.post(`/equipamentos/api/v1/${equipamento.id}/set_status/`, { status: 'SA' })
      const nowIso = new Date().toISOString()
      if (setEquipamentos) {
        setEquipamentos((prev) =>
          prev.map((item) =>
            item.id === equipamento.id
              ? { ...item, status: { ...item.status, status: 'SA' as any, date_entrada: nowIso } }
              : item,
          ),
        )
      }
      onAfterSetSaida?.(equipamento.id)
      onClose()
    } catch (error: any) {
      console.error(error)
      alert(error?.response?.data?.detail || 'Não foi possível registrar a saída.')
    } finally {
      setLoading(false)
    }
  }

  const serviceRows = (orcamento?.servico || []).map((id) => {
    const servico = servicos.find((item) => item.id === id)
    return servico ? (
      <tr key={`service-${id}`}>
        <td>{servico.nome}</td>
        <td>{Number((servico as any).valor ?? 0).toFixed(2)}</td>
      </tr>
    ) : null
  })

  const productRows = (orcamento?.produto || []).map((id) => {
    const produto = produtos.find((item) => item.id === id)
    return produto ? (
      <tr key={`product-${id}`}>
        <td>{produto.nome}</td>
        <td>{Number((produto as any).preco ?? 0).toFixed(2)}</td>
      </tr>
    ) : null
  })

  const footer = (
    <>
      {mode === 'delivery' && (
        <Button type="button" variant="success" onClick={handleConfirmSaida} disabled={loading}>
          {loading ? 'Registrando...' : 'Confirmar Saida'}
        </Button>
      )}
      <Button type="button" variant="danger" onClick={onClose} disabled={loading}>
        Fechar
      </Button>
    </>
  )

  return (
    <ModalShell
      title={mode === 'delivery' ? 'Entrega do Equipamento' : 'Relatorio do Equipamento'}
      onClose={onClose}
      size="lg"
      footer={footer}
      bodyClassName="modal-vo"
    >
      <section className="summary-panel">
        <div>
          <span className="summary-label">Cliente</span>
          <span className="summary-value">{cliente?.nome ?? '-'}</span>
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

      {orcamento && (
        <>
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
              <tbody>{serviceRows}</tbody>
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
              <tbody>{productRows}</tbody>
            </table>
          </div>
        </>
      )}

      {tecnico && (
        <div className="entries-section">
          <div className="entries-header">
            <h3>Tecnico Responsavel</h3>
          </div>
          <p>{tecnico.nome}</p>
        </div>
      )}

      {mode === 'report' && (
        <div className="entries-section">
          <div className="entries-header">
            <h3>Linha do Tempo</h3>
          </div>
          {histLoading ? (
            <p>Carregando historico...</p>
          ) : (
            <table className="entries-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Entrada</th>
                  <th>Saida</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((item) => (
                  <tr key={item.id}>
                    <td>{statusLabel(item.status)}</td>
                    <td>{item.date_entrada ? new Date(item.date_entrada).toLocaleString() : '-'}</td>
                    <td>{item.date_saida ? new Date(item.date_saida).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </ModalShell>
  )
}
