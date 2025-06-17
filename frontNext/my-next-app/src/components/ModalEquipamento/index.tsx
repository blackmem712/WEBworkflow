'use client'

import { useState } from 'react'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente }     from '@/types/cliente/cliente'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalNovoCliente from '@/components/ModalNovoCliente'
import '@/styles/components/modalEquipamento.css'

interface Props {
  equipamento: Equipamento
  onClose: () => void
  setEquipamentos: React.Dispatch<React.SetStateAction<Equipamento[]>>
  clientes: Cliente[]
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
}

export default function ModalEquipamento({ equipamento, onClose, setEquipamentos, clientes, setClientes }: Props) {
  const [form, setForm] = useState<Equipamento>({ ...equipamento })
  const [showCliente, setShowCliente] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'cliente' ? Number(value) : value
    }))
  }

  const handleSalvar = () => {
    fetch(`http://127.0.0.1:8000/equipamentos/api/v1/${equipamento.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(r => {
        if (!r.ok) throw new Error('Erro')
        setEquipamentos(prev =>
          prev.map(e => (e.id === equipamento.id ? { ...e, ...form } : e))
        )
        onClose()
      })
      .catch(console.error)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-equip">
        <h2>Editar Equipamento</h2>

        <div className="form-grid">
          {/* mesmos campos de criação */}
          <div className="grid-col-6">
            <InputCampo label="Equipamento" name="equipamento" value={form.equipamento} onChange={handleChange} />
          </div>
          <div className="grid-col-6">
            <InputCampo label="Marca" name="marca" value={form.marca} onChange={handleChange} />
          </div>
          <div className="grid-col-6">
            <InputCampo label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} />
          </div>
          <div className="grid-col-6">
            <InputCampo label="Cor" name="cor" value={form.cor} onChange={handleChange} />
          </div>
          <div className="grid-col-6">
            <InputCampo label="Nº Série" name="nun_serie" value={form.nun_serie} onChange={handleChange} />
          </div>
          <div className="grid-col-6">
            <label htmlFor="cliente">Cliente</label>
            <div className="select-wrap">
              <select name="cliente" id="cliente" value={form.cliente} onChange={handleChange}>
                <option value={0}>Selecione...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              <Button variant="secondary" onClick={() => setShowCliente(true)}>
                + Cliente
              </Button>
            </div>
          </div>
        </div>

        <div className="modal-buttons">
          <Button variant="primary" onClick={handleSalvar}>Salvar</Button>
          <Button variant="danger" onClick={onClose}>Cancelar</Button>
        </div>

        {showCliente && (
          <ModalNovoCliente
            onClose={() => setShowCliente(false)}
            setClientes={setClientes}
          />
        )}
      </div>
    </div>
  )
}
