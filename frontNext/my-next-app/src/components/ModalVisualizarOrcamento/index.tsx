'use client'

import React, { useState, ChangeEvent } from 'react'
import { Orcamento }   from '@/types/orcamento/orcamento'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente }     from '@/types/cliente/cliente'
import { Servico }     from '@/types/servico/servico'
import { Produto }     from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import Button          from '@/components/buton'
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
  setEquipamentos
}: Props) {
  const [techId, setTechId] = useState<number | null>(orcamento.cargo_funcionario ?? null)

  const handleTechChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTechId(e.target.value ? Number(e.target.value) : null)
  }

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
        // Atualiza orçamentos
        setOrcamentos(prev => prev.map(o => (o.id === updated.id ? updated : o)))

        // 2) Move equipamento para "MA"
        fetch(`http://127.0.0.1:8000/equipamentos/api/v1/${equipamento.id}/`, {
          method: 'PATCH',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ status: 'MA' })
        }).catch(console.error)

        setEquipamentos(prev =>
          prev.map(e =>
            e.id === equipamento.id ? { ...e, status: { ...e.status, status: 'MA' } } : e
          )
        )

        onClose()
      })
      .catch(console.error)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-orc wide">
        <h2>Visualizar Orçamento</h2>

        {/* Cabeçalho somente leitura */}
        <div className="form-grid">
          <div className="grid-col-12">
            <label>Cliente</label>
            <input type="text" value={cliente.nome ?? ''} readOnly />
          </div>

          <div className="grid-col-6">
            <label>Equipamento</label>
            <input type="text" value={equipamento.equipamento} readOnly />
          </div>
          <div className="grid-col-6">
            <label>Nº de Série</label>
            <input type="text" value={equipamento.nun_serie} readOnly />
          </div>

          <div className="grid-col-12">
            <label>Observação</label>
            <textarea value={orcamento.observacao ?? ''} readOnly rows={3} />
          </div>
        </div>

        {/* Serviços */}
        <div className="entries-section">
          <h3>Serviços</h3>
          <table className="entries-table">
            <thead>
              <tr><th>Serviço</th><th>Valor (R$)</th></tr>
            </thead>
            <tbody>
              {orcamento.servico.map((sid) => {
                const s = servicos.find(x => x.id === sid)
                return s ? (
                  <tr key={sid}>
                    <td>{s.nome}</td>
                    <td>{s.valor.toFixed(2)}</td>
                  </tr>
                ) : null
              })}
            </tbody>
          </table>
        </div>

        {/* Produtos */}
        <div className="entries-section">
          <h3>Produtos</h3>
          <table className="entries-table">
            <thead>
              <tr><th>Produto</th><th>Valor (R$)</th></tr>
            </thead>
            <tbody>
              {orcamento.produto.map((pid) => {
                const p = produtos.find(x => x.id === pid)
                return p ? (
                  <tr key={pid}>
                    <td>{p.nome}</td>
                    <td>{p.preco.toFixed(2)}</td>
                  </tr>
                ) : null
              })}
            </tbody>
          </table>
        </div>

        {/* Select do técnico (único campo editável) */}
        <div className="form-grid">
          <div className="grid-col-12">
            <label>Técnico Responsável</label>
            <select value={techId ?? ''} onChange={handleTechChange}>
              <option value="">Selecione o técnico...</option>
              {funcionarios
                .filter(f => f.cargo_funcionario?.id != null) // mostra quem tem vínculo
                .map(f => (
                  <option key={f.cargo_funcionario!.id} value={f.cargo_funcionario!.id}>
                    {f.nome}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="modal-buttons">
          <Button variant="primary" onClick={handleSalvar}>Atribuir e Enviar p/ Manutenção</Button>
          <Button variant="danger" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  )
}
