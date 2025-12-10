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
import ConfirmDialog from '@/components/ConfirmDialog'
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
  const [showConfirm, setShowConfirm] = useState(false)

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

  const formatDateTime = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : '-')

  const visitas = useMemo(() => {
    if (!historico.length) return []

    const sorted = [...historico].sort((a, b) => {
      const da = a.date_entrada ?? a.date_saida ?? ''
      const db = b.date_entrada ?? b.date_saida ?? ''
      if (da && db) return da.localeCompare(db)
      if (da) return -1
      if (db) return 1
      return a.id - b.id
    })

    type Visita = { id: number; inicio: string | null; fim: string | null; items: HistoricoItem[] }
    const groups: Visita[] = []
    let current: Visita | null = null

    sorted.forEach((item) => {
      const startCandidate = item.date_entrada ?? item.date_saida ?? null

      if (item.status === 'EN' || !current) {
        current = {
          id: groups.length + 1,
          inicio: startCandidate,
          fim: null,
          items: [],
        }
        groups.push(current)
      }

      current.items.push(item)

      if (item.status === 'SA') {
        current.fim = item.date_saida ?? item.date_entrada ?? current.fim
        current = null
      }
    })

    return groups
  }, [historico])

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
      setShowConfirm(false)
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
        <Button type="button" variant="success" onClick={() => setShowConfirm(true)} disabled={loading}>
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
          ) : visitas.length === 0 ? (
            <p>Nenhum histórico encontrado.</p>
          ) : (
            <div className="timeline-visits">
              {visitas.map((visit, idx) => (
                <div className="timeline-visit" key={`visit-${visit.id}-${idx}`}>
                  <div className="timeline-visit__header">
                    <div>
                      <span className="timeline-pill">Visita {idx + 1}</span>
                      <div className="timeline-range">
                        <span className="timeline-range__date">
                          {visit.inicio ? formatDateTime(visit.inicio) : 'Entrada não registrada'}
                        </span>
                        <span className="timeline-range__arrow">→</span>
                        <span className="timeline-range__date">
                          {visit.fim ? formatDateTime(visit.fim) : 'Em andamento'}
                        </span>
                      </div>
                    </div>
                    <div className="timeline-meta">
                      <span>{visit.items.length} status</span>
                    </div>
                  </div>

                  <div className="timeline-rows">
                    {visit.items.map((item, itemIdx) => (
                      <div className="timeline-row" key={`hist-${item.id}-${itemIdx}`}>
                        <div className="timeline-row__status">{statusLabel(item.status)}</div>
                        <div className="timeline-row__dates">
                          <span>Entrada: {formatDateTime(item.date_entrada)}</span>
                          <span>Saída: {formatDateTime(item.date_saida)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === 'delivery' && (
        <ConfirmDialog
          open={showConfirm}
          title="Confirmar saída"
          message="Tem certeza que deseja confirmar a saída deste equipamento?"
          confirmText="Confirmar"
          cancelText="Cancelar"
          variant="warning"
          onConfirm={handleConfirmSaida}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </ModalShell>
  )
}
