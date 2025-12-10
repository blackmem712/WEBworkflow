'use client'

import { useState, ChangeEvent } from 'react'
import { Orcamento } from '@/types/orcamento/orcamento'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Servico } from '@/types/servico/servico'
import { Produto } from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'
import ConfirmDialog from '@/components/ConfirmDialog'

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
  setOrcamentos,
}: Props) {
  const [form, setForm] = useState<FormState>({
    observacao: orcamento.observacao,
    equipamento: orcamento.equipamento ?? null,
    servico: orcamento.servico ?? [],
    produto: orcamento.produto ?? [],
    cargo_funcionario: orcamento.cargo_funcionario ?? null,
  })
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target

    if (name === 'servico' || name === 'produto') {
      const options = (event.target as HTMLSelectElement).selectedOptions
      const values = Array.from(options).map((option) => Number(option.value))
      setForm((prev) => ({ ...prev, [name]: values }))
      return
    }

    if (name === 'observacao') {
      setForm((prev) => ({ ...prev, observacao: value }))
      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: value === '' ? null : Number(value),
    }))
  }

  const handleSalvar = () => {
    fetch(`http://127.0.0.1:8000/orcamentos/api/v1/${orcamento.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao salvar')
        return response.json()
      })
      .then((updated: Orcamento) => {
        setOrcamentos((prev) => prev.map((orc) => (orc.id === updated.id ? updated : orc)))
        setShowConfirm(false)
        onClose()
      })
      .catch(console.error)
  }

  return (
    <ModalShell
      title="Editar Orcamento"
      onClose={onClose}
      size="xl"
      footer={(
        <>
          <Button type="button" variant="danger" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={() => setShowConfirm(true)}>
            Salvar
          </Button>
        </>
      )}
    >
      <div className="modal-grid">
        <div className="grid-col-12">
          <label htmlFor="orcamento-observacao">Observacao</label>
          <textarea
            id="orcamento-observacao"
            name="observacao"
            value={form.observacao ?? ''}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="grid-col-6">
          <label htmlFor="orcamento-equipamento">Equipamento</label>
          <select
            id="orcamento-equipamento"
            name="equipamento"
            value={form.equipamento != null ? form.equipamento.toString() : ''}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {equipamentos.map((equipamento) => (
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
            name="cargo_funcionario"
            value={form.cargo_funcionario != null ? form.cargo_funcionario.toString() : ''}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {funcionarios.map((funcionario) => (
              <option key={funcionario.cargo_funcionario!.id} value={funcionario.cargo_funcionario!.id}>
                {funcionario.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="grid-col-6">
          <label htmlFor="orcamento-servicos">Servicos</label>
          <select
            id="orcamento-servicos"
            multiple
            name="servico"
            value={form.servico.map((id) => id.toString())}
            onChange={handleChange}
          >
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>
                {servico.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="grid-col-6">
          <label htmlFor="orcamento-produtos">Produtos</label>
          <select
            id="orcamento-produtos"
            multiple
            name="produto"
            value={form.produto.map((id) => id.toString())}
            onChange={handleChange}
          >
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Confirmar alterações"
        message="Tem certeza que deseja salvar as alterações neste orçamento?"
        confirmText="Salvar"
        cancelText="Cancelar"
        variant="info"
        onConfirm={handleSalvar}
        onCancel={() => setShowConfirm(false)}
      />
    </ModalShell>
  )
}

