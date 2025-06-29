'use client'

import { useState, ChangeEvent } from 'react'
import { Orcamento }   from '@/types/orcamento/orcamento'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Servico }     from '@/types/servico/servico'
import { Produto }     from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import InputCampo      from '@/components/InputCampo'
import Button          from '@/components/buton'
import '@/styles/components/modalOrcamento.css'

interface Props {
  orcamento: Orcamento
  equipamentos: Equipamento[]
  servicos: Servico[]
  produtos: Produto[]
  funcionarios: Funcionario[]
  onClose: () => void
  setOrcamentos: React.Dispatch<React.SetStateAction<Orcamento[]>>
}

interface FormState {
  observacao: string
  equipamento: number | null
  servico: number[]
  produto: number[]
  cargo_funcionario: number | null
}

export default function ModalOrcamento({
  orcamento,
  equipamentos,
  servicos,
  produtos,
  funcionarios,
  onClose,
  setOrcamentos
}: Props) {
  const [form, setForm] = useState<FormState>({
    observacao: orcamento.observacao,
    equipamento: orcamento.equipamento ?? null,
    servico: orcamento.servico ?? [],
    produto: orcamento.produto ?? [],
    cargo_funcionario: orcamento.cargo_funcionario ?? null
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, selectedOptions } = e.target as HTMLSelectElement
    if (name === 'servico' || name === 'produto') {
      const vals = Array.from(selectedOptions).map(o => Number(o.value))
      setForm(prev => ({ ...prev, [name]: vals }))
    } else if (name === 'observacao') {
      setForm(prev => ({ ...prev, observacao: value }))
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value === '' ? null : Number(value)
      }))
    }
  }

  const handleSalvar = () => {
    fetch(`http://127.0.0.1:8000/orcamentos/api/v1/${orcamento.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao salvar')
        return res.json()
      })
      .then((updated: Orcamento) => {
        setOrcamentos(prev =>
          prev.map(o => (o.id === updated.id ? updated : o))
        )
        onClose()
      })
      .catch(console.error)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-orc wide">
        <h2>Editar Orçamento</h2>
        <div className="form-grid">
          <div className="grid-col-12">
            <label>Observação</label>
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid-col-6">
            <label>Equipamento</label>
            <select
              name="equipamento"
              value={form.equipamento?.toString() || ''}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              {equipamentos.map(e => (
                <option key={e.id} value={e.id.toString()}>
                  {e.equipamento}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-col-6">
            <label>Responsável</label>
            <select
              name="cargo_funcionario"
              value={form.cargo_funcionario?.toString() || ''}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              {funcionarios.map(f => (
                <option
                  key={f.cargo_funcionario!.id}
                  value={f.cargo_funcionario!.id.toString()}
                >
                  {f.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-col-6">
            <label>Serviços</label>
            <select
              multiple
              name="servico"
              value={form.servico.map(v => v.toString())}
              onChange={handleChange}
            >
              {servicos.map(s => (
                <option key={s.id} value={s.id.toString()}>
                  {s.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-col-6">
            <label>Produtos</label>
            <select
              multiple
              name="produto"
              value={form.produto.map(v => v.toString())}
              onChange={handleChange}
            >
              {produtos.map(p => (
                <option key={p.id} value={p.id.toString()}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-buttons">
          <Button variant="primary" onClick={handleSalvar}>
            Salvar
          </Button>
          <Button variant="danger" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
