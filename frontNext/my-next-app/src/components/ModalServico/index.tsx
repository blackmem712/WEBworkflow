'use client'

import { useState, ChangeEvent } from 'react'
import { Servico } from '@/types/servico/servico'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'
import ConfirmDialog from '@/components/ConfirmDialog'

interface Props {
  servico: Servico
  onClose: () => void
  setServicos: React.Dispatch<React.SetStateAction<Servico[]>>
}

interface FormState {
  nome: string
  valor: number
  descricao: string
}

export default function ModalServico({ servico, onClose, setServicos }: Props) {
  const [form, setForm] = useState<FormState>({
    nome: servico.nome,
    valor: servico.valor,
    descricao: servico.descricao,
  })
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'valor' ? Number(value) : value,
    }))
  }

  const handleSalvar = () => {
    fetch(`http://127.0.0.1:8000/servicos/api/v1/${servico.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao salvar')
        return response.json()
      })
      .then((updated: Servico) => {
        setServicos((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        setShowConfirm(false)
        onClose()
      })
      .catch(console.error)
  }

  return (
    <ModalShell
      title="Editar Servico"
      onClose={onClose}
      size="md"
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
          <InputCampo
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
          />
        </div>
        <div className="grid-col-6">
          <InputCampo
            label="Valor (R$)"
            name="valor"
            type="number"
            value={form.valor}
            onChange={handleChange}
          />
        </div>
        <div className="grid-col-12">
          <label htmlFor="descricao-servico">Descricao</label>
          <textarea
            id="descricao-servico"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Confirmar alterações"
        message="Tem certeza que deseja salvar as alterações neste serviço?"
        confirmText="Salvar"
        cancelText="Cancelar"
        variant="info"
        onConfirm={handleSalvar}
        onCancel={() => setShowConfirm(false)}
      />
    </ModalShell>
  )
}

