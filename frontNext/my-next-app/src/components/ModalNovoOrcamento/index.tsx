// src/components/ModalNovoOrcamento/index.tsx
'use client'

import React, { useState, useEffect, ChangeEvent } from 'react'
import { Orcamento } from '@/types/orcamento/orcamento'
import { Cliente } from '@/types/cliente/cliente'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Servico } from '@/types/servico/servico'
import { Produto } from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'
import '@/styles/components/modalOrcamento.css'

interface Props {
  clientes: Cliente[]
  initialEquip?: Equipamento
  initialClienteName?: string
  equipamentos: Equipamento[]
  servicos: Servico[]
  produtos: Produto[]
  funcionarios: Funcionario[]
  onClose: () => void
  setOrcamentos: React.Dispatch<React.SetStateAction<Orcamento[]>>
  setEquipamentos?: React.Dispatch<React.SetStateAction<Equipamento[]>>
}

const cargoIsTCorGE = (cargo: number | string | null) => {
  if (cargo == null) return false
  if (typeof cargo === 'number') return cargo === 2 || cargo === 3
  return cargo === 'TC' || cargo === 'GE'
}

const cargoLabel = (cargo: number | string | null) => {
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
  setEquipamentos,
}: Props) {
  const clientesList = Array.isArray(clientes) ? clientes : []
  const equipamentosList = Array.isArray(equipamentos) ? equipamentos : []
  const servicosList = Array.isArray(servicos) ? servicos : []
  const produtosList = Array.isArray(produtos) ? produtos : []
  const funcionariosList = Array.isArray(funcionarios) ? funcionarios : []

  const [clienteId, setClienteId] = useState<number | null>(initialEquip ? initialEquip.cliente : null)
  const [equipId, setEquipId] = useState<number | null>(initialEquip ? initialEquip.id : null)
  const [observacao, setObservacao] = useState('')
  const [respId, setRespId] = useState<number | null>(null)
  const [services, setServices] = useState<number[]>([])
  const [productsState, setProductsState] = useState<number[]>([])

  useEffect(() => {
    if (initialEquip) {
      setClienteId(initialEquip.cliente)
      setEquipId(initialEquip.id)
    }
    const tecnicos = funcionariosList.filter(
      (funcionario) => funcionario.cargo_funcionario && cargoIsTCorGE(funcionario.cargo_funcionario.cargo),
    )
    if (tecnicos.length === 1) {
      setRespId(tecnicos[0].cargo_funcionario!.id)
    }
    setServices((prev) => (prev.length === 0 ? [0] : prev))
  }, [initialEquip, funcionariosList])

  const addServiceRow = () => setServices((prev) => [...prev, 0])
  const removeServiceRow = (index: number) => setServices((prev) => prev.filter((_, idx) => idx !== index))
  const changeService = (index: number, value: number) =>
    setServices((prev) => prev.map((id, idx) => (idx === index ? value : id)))

  const addProductRow = () => setProductsState((prev) => [...prev, 0])
  const removeProductRow = (index: number) =>
    setProductsState((prev) => prev.filter((_, idx) => idx !== index))
  const changeProduct = (index: number, value: number) =>
    setProductsState((prev) => prev.map((id, idx) => (idx === index ? value : id)))

  const resetForm = () => {
    setObservacao('')
    setServices([0])
    setProductsState([])
  }

  const handleSalvar = () => {
    if (!equipId) {
      alert('Selecione um equipamento.')
      return
    }
    if (respId == null) {
      alert('Selecione o responsavel pelo orcamento.')
      return
    }

    const payload = {
      observacao,
      equipamento: equipId,
      servico: services.filter((id) => id !== 0),
      produto: productsState.filter((id) => id !== 0),
      cargo_funcionario: respId,
    }

    fetch('http://127.0.0.1:8000/orcamentos/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao criar orcamento')
        return response.json()
      })
      .then((novo: Orcamento) => {
        setOrcamentos((prev) => [...prev, novo])

        if (typeof setEquipamentos === 'function') {
          setEquipamentos((prev) =>
            prev.map((equipamento) =>
              equipamento.id === equipId
                ? { ...equipamento, status: { ...(equipamento.status as any), status: 'OR' as any } }
                : equipamento,
            ),
          )
        }

        alert('Orcamento criado com sucesso!')
        resetForm()
        onClose()
      })
      .catch((error) => {
        console.error(error)
        alert('Erro ao salvar orcamento. Tente novamente.')
      })
  }

  const onClienteChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value ? Number(event.target.value) : null
    setClienteId(id)
    setEquipId(null)
  }

  const filteredEquipamentos = clienteId
    ? equipamentosList.filter((equipamento) => equipamento.cliente === clienteId)
    : equipamentosList

  return (
    <ModalShell
      title="Novo Orcamento"
      onClose={onClose}
      size="xl"
      footer={(
        <>
          <Button type="button" variant="danger" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSalvar}>
            Salvar
          </Button>
        </>
      )}
    >
      <div className="modal-grid">
        <div className="grid-col-6">
          <label htmlFor="orcamento-cliente">Cliente</label>
          <select
            id="orcamento-cliente"
            value={clienteId ?? ''}
            onChange={onClienteChange}
          >
            <option value="">Selecione...</option>
            {clientesList.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="grid-col-6">
          <label htmlFor="orcamento-equip">Equipamento</label>
          <select
            id="orcamento-equip"
            value={equipId ?? ''}
            onChange={(event) => setEquipId(event.target.value ? Number(event.target.value) : null)}
          >
            <option value="">Selecione...</option>
            {filteredEquipamentos.map((equipamento) => (
              <option key={equipamento.id} value={equipamento.id}>
                {equipamento.equipamento}
              </option>
            ))}
          </select>
        </div>
        <div className="grid-col-6">
          <label htmlFor="orcamento-responsavel">Responsavel</label>
          <select
            id="orcamento-responsavel"
            value={respId ?? ''}
            onChange={(event) => setRespId(event.target.value ? Number(event.target.value) : null)}
          >
            <option value="">
              {funcionariosList.length ? 'Selecione o responsavel...' : 'Carregando responsaveis...'}
            </option>
            {funcionariosList
              .filter((funcionario) => funcionario.cargo_funcionario && cargoIsTCorGE(funcionario.cargo_funcionario.cargo))
              .map((funcionario) => (
                <option key={funcionario.id} value={funcionario.cargo_funcionario!.id}>
                  {funcionario.nome} - {cargoLabel(funcionario.cargo_funcionario?.cargo ?? null)}
                </option>
              ))}
          </select>
        </div>
        <div className="grid-col-12">
          <label htmlFor="orcamento-observacao">Observacao</label>
          <textarea
            id="orcamento-observacao"
            rows={3}
            value={observacao}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setObservacao(event.target.value)}
            placeholder="Detalhes do orcamento..."
          />
        </div>
      </div>

      <div className="entries-section">
        <div className="entries-header">
          <h3>Servicos</h3>
          <Button type="button" variant="secondary" onClick={addServiceRow}>
            + Adicionar Servico
          </Button>
        </div>
        <table className="entries-table">
          <thead>
            <tr>
              <th>Servico</th>
              <th className="entries-table__actions" aria-label="Remover" />
            </tr>
          </thead>
          <tbody>
            {services.map((serviceId, index) => (
              <tr key={`service-${index}`}>
                <td>
                  <select
                    value={serviceId || ''}
                    onChange={(event) => changeService(index, Number(event.target.value))}
                  >
                    <option value="">Selecione...</option>
                    {servicosList.map((servico) => (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome} - R$ {Number(servico.valor ?? 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => removeServiceRow(index)}
                    aria-label="Remover servico"
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="entries-section">
        <div className="entries-header">
          <h3>Produtos</h3>
          <Button type="button" variant="secondary" onClick={addProductRow}>
            + Adicionar Produto
          </Button>
        </div>
        <table className="entries-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th className="entries-table__actions" aria-label="Remover" />
            </tr>
          </thead>
          <tbody>
            {productsState.map((productId, index) => (
              <tr key={`product-${index}`}>
                <td>
                  <select
                    value={productId || ''}
                    onChange={(event) => changeProduct(index, Number(event.target.value))}
                  >
                    <option value="">Selecione...</option>
                    {produtosList.map((produto) => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} - R$ {Number(produto.preco ?? 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => removeProductRow(index)}
                    aria-label="Remover produto"
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModalShell>
  )
}
