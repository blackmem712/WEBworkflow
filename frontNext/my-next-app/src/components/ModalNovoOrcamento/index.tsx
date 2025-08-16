// src/components/ModalNovoOrcamento/index.tsx
'use client'

import React, { useState, useEffect, ChangeEvent } from 'react'
import { Orcamento }   from '@/types/orcamento/orcamento'
import { Cliente }     from '@/types/cliente/cliente'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Servico }     from '@/types/servico/servico'
import { Produto }     from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import Button          from '@/components/buton'
import '@/styles/components/modalOrcamento.css'

interface Props {
  clientes: Cliente[]
  initialEquip?: Equipamento
  initialClienteName?: string
  equipamentos: Equipamento[]
  servicos: Servico[]
  produtos: Produto[]
  funcionarios: Funcionario[]  // para listar responsáveis
  onClose: () => void
  setOrcamentos: React.Dispatch<React.SetStateAction<Orcamento[]>>
  setEquipamentos: React.Dispatch<React.SetStateAction<Equipamento[]>>
}

export default function ModalNovoOrcamento({
  clientes,
  initialEquip,
  initialClienteName,
  equipamentos,
  servicos,
  produtos,
  funcionarios,
  onClose,
  setOrcamentos,
  setEquipamentos
}: Props) {
  // ==== FALLBACKS SEGUROS (evitam .filter em undefined) ====
  const clientesList      = Array.isArray(clientes)      ? clientes      : []
  const equipamentosList  = Array.isArray(equipamentos)  ? equipamentos  : []
  const servicosList      = Array.isArray(servicos)      ? servicos      : []
  const produtosList      = Array.isArray(produtos)      ? produtos      : []
  const funcionariosList  = Array.isArray(funcionarios)  ? funcionarios  : []

  // Estados básicos (pré-preenchidos quando vem do card EN)
  const [clienteId, setClienteId] = useState<number | null>(initialEquip ? initialEquip.cliente : null)
  const [equipId, setEquipId]     = useState<number | null>(initialEquip ? initialEquip.id      : null)
  const [clienteNome]             = useState(initialClienteName || '')
  const [observacao, setObservacao] = useState('')

  // Responsável (deve ser um vínculo Cargo_funcionario com cargo TC/GE)
  const [respId, setRespId] = useState<number | null>(null)

  // Linhas dinâmicas
  const [services, setServices] = useState<number[]>([])
  const [products, setProducts] = useState<number[]>([])

  useEffect(() => {
    if (initialEquip) {
      setClienteId(initialEquip.cliente)
      setEquipId(initialEquip.id)
    }
  }, [initialEquip])

  // Handlers de linhas (serviços)
  const addServiceRow = () => setServices(prev => [...prev, 0])
  const removeServiceRow = (i: number) => setServices(prev => prev.filter((_, idx) => idx !== i))
  const changeService = (i: number, val: number) =>
    setServices(prev => prev.map((v, idx) => (idx === i ? val : v)))

  // Handlers de linhas (produtos)
  const addProductRow = () => setProducts(prev => [...prev, 0])
  const removeProductRow = (i: number) => setProducts(prev => prev.filter((_, idx) => idx !== i))
  const changeProduct = (i: number, val: number) =>
    setProducts(prev => prev.map((v, idx) => (idx === i ? val : v)))

  // Salvar (POST) — agora COM cargo_funcionario (obrigatório)
  const handleSalvar = () => {
    if (!equipId) {
      alert('Selecione um equipamento.')
      return
    }
    if (respId == null) {
      alert('Selecione o responsável pelo orçamento.')
      return
    }

    const body = {
      observacao,
      equipamento: equipId,
      servico: services.filter(id => id !== 0),
      produto: products.filter(id => id !== 0),
      cargo_funcionario: respId,
    }

    fetch('http://127.0.0.1:8000/orcamentos/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao criar orçamento')
        return res.json()
      })
      .then((novo: Orcamento) => {
        setOrcamentos(prev => [...prev, novo])

        // move equipamento para "OR" imediatamente
        setEquipamentos(prev =>
          prev.map(e =>
            e.id === equipId ? { ...e, status: { ...(e.status as any), status: 'OR' as any } } : e
          )
        )

        // persiste no backend o status OR
        fetch(`http://127.0.0.1:8000/equipamentos/api/v1/${equipId}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'OR' })
        }).catch(console.error)

        onClose()
      })
      .catch(err => {
        console.error(err)
        alert('Não foi possível salvar o orçamento.')
      })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-orc wide">
        <h2>Novo Orçamento</h2>

        <div className="form-grid">
          {/* Cliente */}
          <div className="grid-col-6">
            <label>Cliente</label>
            <select
              value={clienteId ?? ''}
              disabled={!!initialEquip}
              onChange={e => setClienteId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">{initialEquip ? clienteNome : 'Selecione...'}</option>
              {clientesList.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Equipamento (filtrado pelo cliente) */}
          <div className="grid-col-6">
            <label>Equipamento</label>
            <select
              value={equipId ?? ''}
              disabled={!!initialEquip}
              onChange={e => setEquipId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">{initialEquip ? initialEquip.equipamento : 'Selecione...'}</option>
              {equipamentosList
                .filter(e => e.cliente === clienteId)
                .map(e => (
                  <option key={e.id} value={e.id}>{e.equipamento}</option>
                ))}
            </select>
          </div>

          {/* Responsável (Técnico / Gerente) */}
          <div className="grid-col-6">
            <label>Responsável</label>
            <select
              value={respId ?? ''}
              onChange={e => setRespId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">
                {funcionariosList.length ? 'Selecione o responsável...' : 'Carregando responsáveis...'}
              </option>
              {funcionariosList
                .filter(f => f?.cargo_funcionario?.id != null && (f.cargo_funcionario.cargo === 'TC' || f.cargo_funcionario.cargo === 'GE'))
                .map(f => (
                  <option key={f.cargo_funcionario!.id} value={f.cargo_funcionario!.id}>
                    {f.nome}
                  </option>
                ))}
            </select>
          </div>

          {/* Observação */}
          <div className="grid-col-12">
            <label>Observação</label>
            <textarea
              rows={3}
              value={observacao}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setObservacao(e.target.value)}
              placeholder="Detalhes do orçamento..."
            />
          </div>
        </div>

        {/* Serviços */}
        <div className="entries-section">
          <h3>Serviços</h3>
          <table className="entries-table">
            <thead>
              <tr>
                <th>Serviço</th>
                <th style={{ width: '1rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {services.map((srvId, i) => (
                <tr key={i}>
                  <td>
                    <select
                      value={srvId ?? ''}
                      onChange={e => changeService(i, Number(e.target.value))}
                    >
                      <option value="">Selecione...</option>
                      {servicosList.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.nome} — R$ {Number(s.valor ?? 0).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button type="button" onClick={() => removeServiceRow(i)} className="btn-remove-row">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="secondary" onClick={addServiceRow}>+ Adicionar Serviço</Button>
        </div>

        {/* Produtos */}
        <div className="entries-section">
          <h3>Produtos</h3>
          <table className="entries-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th style={{ width: '1rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((prdId, i) => (
                <tr key={i}>
                  <td>
                    <select
                      value={prdId ?? ''}
                      onChange={e => changeProduct(i, Number(e.target.value))}
                    >
                      <option value="">Selecione...</option>
                      {produtosList.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nome} — R$ {Number(p.preco ?? 0).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button type="button" onClick={() => removeProductRow(i)} className="btn-remove-row">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="secondary" onClick={addProductRow}>+ Adicionar Produto</Button>
        </div>

        <div className="modal-buttons">
          <Button
            variant="primary"
            onClick={handleSalvar}
          >
            Salvar
          </Button>
          <Button variant="danger" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  )
}
