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

  const statusLabel = (code: string) => STATUS_LIST.find(s => s.code === code)?.label || code

  // Busca o histórico completo somente no modo relatório (SA)
  useEffect(() => {
    if (mode !== 'report') return
    let alive = true
    ;(async () => {
      try {
        setHistLoading(true)
        const r = await api.get(`/equipamentos/api/v1/${equipamento.id}/historico/`)
        if (!alive) return
        setHistorico(r.data as HistoricoItem[])
      } catch (e) {
        console.error(e)
      } finally {
        if (alive) setHistLoading(false)
      }
    })()
    return () => { alive = false }
  }, [mode, equipamento.id])

  const tecnico = useMemo(() => {
    if (!orcamento || !funcionarios) return null
    const cfId = orcamento.cargo_funcionario
    const f = funcionarios.find(x => x.cargo_funcionario && x.cargo_funcionario.id === cfId)
    return f || null
  }, [orcamento, funcionarios])

  const handleConfirmSaida = async () => {
    if (loading) return
    try {
      setLoading(true)
      await api.post(`/equipamentos/api/v1/${equipamento.id}/set_status/`, { status: 'SA' })
      const nowIso = new Date().toISOString()
      if (setEquipamentos) {
        setEquipamentos(prev => prev.map(e => (
          e.id === equipamento.id ? { ...e, status: { ...e.status, status: 'SA' as any, date_entrada: nowIso } } : e
        )))
      }
      onAfterSetSaida?.(equipamento.id)
      onClose()
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data?.detail || 'Não foi possível registrar a saída.')
    } finally {
      setLoading(false)
    }
  }

  // Helpers para renderização de serviços/produtos
  const servRows = (orcamento?.servico || []).map((sid) => {
    const s = servicos.find(x => x.id === sid)
    return s ? (
      <tr key={sid}>
        <td>{s.nome}</td>
        <td>{Number((s as any).valor ?? 0).toFixed(2)}</td>
      </tr>
    ) : null
  })

  const prodRows = (orcamento?.produto || []).map((pid) => {
    const p = produtos.find(x => x.id === pid)
    return p ? (
      <tr key={pid}>
        <td>{p.nome}</td>
        <td>{Number((p as any).preco ?? 0).toFixed(2)}</td>
      </tr>
    ) : null
  })

  return (
    <div className="mvo modal-overlay">
      <div className="mvo modal-window">
        <h2 className="mvo title">{mode === 'delivery' ? 'Entrega do Equipamento' : 'Relatório do Equipamento'}</h2>

        <div className="mvo summary">
          <p><strong>Cliente:</strong> {cliente?.nome ?? '—'}</p>
          <p><strong>Equipamento:</strong> {equipamento.equipamento}</p>
          <p><strong>Série:</strong> {equipamento.nun_serie}</p>
        </div>

        {orcamento && (
          <>
            <div className="mvo entries-section">
              <h3>Serviços</h3>
              <table className="mvo entries-table">
                <thead>
                  <tr><th>Serviço</th><th>Valor (R$)</th></tr>
                </thead>
                <tbody>{servRows}</tbody>
              </table>
            </div>

            <div className="mvo entries-section">
              <h3>Produtos</h3>
              <table className="mvo entries-table">
                <thead>
                  <tr><th>Produto</th><th>Valor (R$)</th></tr>
                </thead>
                <tbody>{prodRows}</tbody>
              </table>
            </div>
          </>
        )}

        {tecnico && (
          <div className="mvo entries-section">
            <h3>Técnico Responsável</h3>
            <p>{tecnico.nome}</p>
          </div>
        )}

        {mode === 'report' && (
          <div className="mvo entries-section">
            <h3>Linha do Tempo</h3>
            {histLoading ? (
              <p>Carregando histórico…</p>
            ) : (
              <table className="mvo entries-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Entrada</th>
                    <th>Saída</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((h) => (
                    <tr key={h.id}>
                      <td>{statusLabel(h.status)}</td>
                      <td>{h.date_entrada ? new Date(h.date_entrada).toLocaleString() : '—'}</td>
                      <td>{h.date_saida ? new Date(h.date_saida).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        <div className="mvo modal-buttons">
          {mode === 'delivery' && (
            <button
              className="btn btn-success"
              onClick={handleConfirmSaida}
              disabled={loading}
            >
              {loading ? 'Registrando…' : 'Confirmar Saída'}
            </button>
          )}
          <button className="btn btn-danger" onClick={onClose} disabled={loading}>Fechar</button>
        </div>
      </div>
    </div>
  )
}
