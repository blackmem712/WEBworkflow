'use client'

import { useState, useRef, useEffect } from 'react'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente } from '@/types/cliente/cliente'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'
import ModalNovoCliente from '@/components/ModalNovoCliente'
import '@/styles/components/modalEquipamento.css'

interface Props {
  equipamento: Equipamento
  clientes: Cliente[]
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
  setEquipamentos: React.Dispatch<React.SetStateAction<Equipamento[]>>
  onClose: () => void
}

export default function ModalEquipamento({
  equipamento,
  clientes,
  setClientes,
  setEquipamentos,
  onClose,
}: Props) {
  const [form, setForm] = useState<Omit<Equipamento, 'status'>>((({ status, ...rest }) => rest)(equipamento))

  const initialCliente = clientes.find((cliente) => cliente.id === equipamento.cliente)
  const [search, setSearch] = useState(initialCliente?.nome ?? '')
  const [showSug, setShowSug] = useState(false)
  const [showCliente, setShowCliente] = useState(false)
  const suggestionsRef = useRef<HTMLUListElement>(null)
  const searchWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchWrapperRef.current) return
      if (searchWrapperRef.current.contains(event.target as Node)) return
      setShowSug(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sugestoes = clientes.filter((cliente) =>
    (cliente.nome ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const handleSelectCliente = (cliente: Cliente) => {
    setForm((prev) => ({ ...prev, cliente: cliente.id }))
    setSearch(cliente.nome ?? '')
    setShowSug(false)
  }

  const handleClienteCriado = (cliente: Cliente) => {
    setClientes((prev) => [...prev, cliente])
    handleSelectCliente(cliente)
  }

  const handleSalvar = () => {
    fetch(`http://127.0.0.1:8000/equipamentos/api/v1/${equipamento.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao salvar')
        return response.json()
      })
      .then((updated: Equipamento) => {
        setEquipamentos((prev) => prev.map((eq) => (eq.id === updated.id ? updated : eq)))
        onClose()
      })
      .catch(console.error)
  }

  const formattedEntrada = new Date(equipamento.status.date_entrada).toLocaleString()

  return (
    <>
      <ModalShell
        title='Editar Equipamento'
        onClose={onClose}
        size='xl'
        footer={(
          <>
            <Button type='button' variant='danger' onClick={onClose}>
              Cancelar
            </Button>
            <Button type='button' onClick={handleSalvar}>
              Salvar
            </Button>
          </>
        )}
      >
        <div className='modal-grid'>
          <div className='grid-col-6'>
            <InputCampo
              label='Equipamento'
              name='equipamento'
              value={form.equipamento}
              onChange={(event) => setForm((prev) => ({ ...prev, equipamento: event.target.value }))}
            />
          </div>
          <div className='grid-col-6'>
            <InputCampo
              label='Marca'
              name='marca'
              value={form.marca}
              onChange={(event) => setForm((prev) => ({ ...prev, marca: event.target.value }))}
            />
          </div>
          <div className='grid-col-6'>
            <InputCampo
              label='Modelo'
              name='modelo'
              value={form.modelo}
              onChange={(event) => setForm((prev) => ({ ...prev, modelo: event.target.value }))}
            />
          </div>
          <div className='grid-col-6'>
            <InputCampo
              label='Cor'
              name='cor'
              value={form.cor}
              onChange={(event) => setForm((prev) => ({ ...prev, cor: event.target.value }))}
            />
          </div>
          <div className='grid-col-6'>
            <InputCampo
              label='Numero de serie'
              name='nun_serie'
              value={form.nun_serie}
              onChange={(event) => setForm((prev) => ({ ...prev, nun_serie: event.target.value }))}
            />
          </div>
          <div className='grid-col-6'>
            <label>Data de entrada</label>
            <p className='date-field'>{formattedEntrada}</p>
          </div>
          <div className='grid-col-6'>
            <label>Status</label>
            <div className={`status-chip status-chip--${equipamento.status.status}`}>
              {equipamento.status.status}
            </div>
          </div>
          <div className='grid-col-6'>
            <label htmlFor='cliente-search' className='input-label'>Cliente</label>
            <div className='combo-field' ref={searchWrapperRef}>
              <input
                id='cliente-search'
                className='combo-input'
                type='text'
                placeholder='Buscar cliente...'
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setShowSug(true)
                }}
                onFocus={() => setShowSug(true)}
              />
              <Button type='button' variant='secondary' onClick={() => setShowCliente(true)}>
                + Cliente
              </Button>
              {showSug && (
                <ul className='combo-suggestions' ref={suggestionsRef}>
                  {sugestoes.slice(0, 8).map((cliente) => (
                    <li key={cliente.id} onMouseDown={() => handleSelectCliente(cliente)}>
                      {cliente.nome}
                    </li>
                  ))}
                  {sugestoes.length === 0 && <li className='combo-empty'>Nenhum cliente encontrado</li>}
                </ul>
              )}
            </div>
          </div>
        </div>
      </ModalShell>

      {showCliente && (
        <ModalNovoCliente
          onClose={() => setShowCliente(false)}
          setClientes={setClientes}
          onCreated={handleClienteCriado}
        />
      )}
    </>
  )
}
