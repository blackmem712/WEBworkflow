'use client'

import { useState, useRef, useEffect } from 'react'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente }     from '@/types/cliente/cliente'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalNovoCliente from '@/components/ModalNovoCliente'
import '@/styles/components/modalEquipamento.css'

/** Status retornado pela API */
interface Status {
  status: string
  date_entrada: string
  date_saida: string | null
}

/** Extensão de Equipamento para incluir status */
interface EquipamentoAPI extends Equipamento {
  status: Status
}

interface Props {
  equipamento: EquipamentoAPI
  clientes: Cliente[]
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
  setEquipamentos: React.Dispatch<React.SetStateAction<EquipamentoAPI[]>>
  onClose: () => void
}

export default function ModalEquipamento({
  equipamento,
  clientes,
  setClientes,
  setEquipamentos,
  onClose
}: Props) {
  // Estado do formulário (todos os campos de Equipamento menos status)
  const [form, setForm] = useState<Omit<EquipamentoAPI, 'status'>>(
    (({ status, ...rest }) => rest)(equipamento)
  )

  // Para campo de busca de cliente
  const initialCliente = clientes.find(c => c.id === equipamento.cliente)
  const [search, setSearch]       = useState(initialCliente?.nome ?? '')
  const [showSug, setShowSug]     = useState(false)
  const [showCliente, setShowCliente] = useState(false)
  const sugRef = useRef<HTMLUListElement>(null)

  // Fecha dropdown de sugestões ao clicar fora
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (sugRef.current && !sugRef.current.contains(e.target as Node)) {
        setShowSug(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Seleciona cliente da lista de sugestões
  const handleSelectCliente = (c: Cliente) => {
    setForm(prev => ({ ...prev, cliente: c.id }))
    setSearch(c.nome ?? '')
    setShowSug(false)
  }

  // Envia PATCH para atualizar o equipamento
  const handleSalvar = () => {
    fetch(`http://127.0.0.1:8000/equipamentos/api/v1/${equipamento.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao salvar')
        return res.json()
      })
      .then((updated: EquipamentoAPI) => {
        setEquipamentos(prev =>
          prev.map(e => (e.id === updated.id ? updated : e))
        )
        onClose()
      })
      .catch(console.error)
  }

  // Filtra sugestões de clientes conforme texto digitado
  const sugestoes = clientes.filter(c =>
    (c.nome ?? '').toLowerCase().includes(search.toLowerCase())
  )

  // Formata data de entrada
  const dtEnt = new Date(equipamento.status.date_entrada)
    .toLocaleString()

  return (
    <div className="modal-overlay">
      <div className="modal-equip wide">
        <h2>Editar Equipamento</h2>

        <div className="form-grid">
          <div className="grid-col-6">
            <InputCampo
              label="Equipamento"
              name="equipamento"
              value={form.equipamento}
              onChange={e => setForm({ ...form, equipamento: e.target.value })}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Marca"
              name="marca"
              value={form.marca}
              onChange={e => setForm({ ...form, marca: e.target.value })}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Modelo"
              name="modelo"
              value={form.modelo}
              onChange={e => setForm({ ...form, modelo: e.target.value })}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Cor"
              name="cor"
              value={form.cor}
              onChange={e => setForm({ ...form, cor: e.target.value })}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Nº Série"
              name="nun_serie"
              value={form.nun_serie}
              onChange={e => setForm({ ...form, nun_serie: e.target.value })}
            />
          </div>

          {/* Data de Entrada (read-only) */}
          <div className="grid-col-6">
            <label>Data de Entrada</label>
            <p className="date-field">{dtEnt}</p>
          </div>

          {/* Status Card */}
          <div className="grid-col-6">
            <label>Status</label>
            <div className={`status-card status-${equipamento.status.status}`}>
              {equipamento.status.status === 'EN' ? 'Entrada' : equipamento.status.status}
            </div>
          </div>

          {/* Busca de Cliente com sugestões */}
          <div className="grid-col-6">
            <label htmlFor="cliente-search" className="input-label">Cliente</label>
            <div className="search-wrap">
              <input
                id="cliente-search"
                className="search-input"
                type="text"
                placeholder="Buscar cliente..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowSug(true) }}
                onFocus={() => setShowSug(true)}
              />
              <Button variant="secondary" onClick={() => setShowCliente(true)}>
                + Cliente
              </Button>
            </div>
            {showSug && (
              <ul className="suggestions" ref={sugRef}>
                {sugestoes.slice(0, 8).map(c => (
                  <li key={c.id} onClick={() => handleSelectCliente(c)}>
                    {c.nome}
                  </li>
                ))}
                {sugestoes.length === 0 && (
                  <li className="no-sug">Nenhum cliente encontrado</li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="modal-buttons">
          <Button variant="primary" onClick={handleSalvar}>Salvar</Button>
          <Button variant="danger"  onClick={onClose}>Cancelar</Button>
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
