'use client'

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente } from '@/types/cliente/cliente'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalShell from '@/components/ModalShell'
import ModalNovoCliente from '@/components/ModalNovoCliente'
import EtiquetaQRModal, { EtiquetaData } from '@/app/(protected)/Equipamentos/[id]/etiqueta/etiquetaQRModal'
import '@/styles/components/modalEquipamento.css'

interface Props {
  onClose: () => void
  setEquipamentos: React.Dispatch<React.SetStateAction<Equipamento[]>>
  clientes: Cliente[]
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
}

type EquipamentoCreate = {
  equipamento: string
  marca: string
  modelo: string
  cor: string
  nun_serie: string
  cliente: number
}

export default function ModalNovoEquipamento({ onClose, setEquipamentos, clientes, setClientes }: Props) {
  const [form, setForm] = useState<Omit<EquipamentoCreate, 'cliente'>>({
    equipamento: '',
    marca: '',
    modelo: '',
    cor: '',
    nun_serie: '',
  })

  const [search, setSearch] = useState('')
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const comboRef = useRef<HTMLDivElement>(null)

  const [showCliente, setShowCliente] = useState(false)

  const [showEtiqueta, setShowEtiqueta] = useState(false)
  const [etiquetaData, setEtiquetaData] = useState<EtiquetaData | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!comboRef.current) return
      if (comboRef.current.contains(event.target as Node)) return
      setShowSuggestions(false)
      setActiveIndex(0)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtrados = clientes.filter((cliente) =>
    (cliente.nome ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const pickCliente = (cliente: Cliente) => {
    setSelectedClienteId(cliente.id)
    setSearch(cliente.nome ?? '')
    setShowSuggestions(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setShowSuggestions(true)
      return
    }

    if (!showSuggestions) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, filtrados.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const cliente = filtrados[activeIndex]
      if (cliente) pickCliente(cliente)
    } else if (event.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearch(value)
    setShowSuggestions(true)
    setActiveIndex(0)
    setSelectedClienteId(null)
  }

  const handleClienteCriado = (cliente: Cliente) => {
    setClientes((prev) => [...prev, cliente])
    pickCliente(cliente)
    setShowCliente(false)
  }

  const handleSalvar = async () => {
    let clienteId = selectedClienteId

    if (!clienteId) {
      const exato = clientes.find((cliente) => (cliente.nome ?? '').toLowerCase().trim() === search.toLowerCase().trim())
      const unico = filtrados.length === 1 ? filtrados[0] : undefined

      if (exato) clienteId = exato.id
      else if (unico) clienteId = unico.id
      else {
        alert('Selecione um cliente valido na lista de sugestoes.')
        return
      }
    }

    const payload: EquipamentoCreate = { ...form, cliente: clienteId }

    try {
      const response = await fetch('http://127.0.0.1:8000/equipamentos/api/v1/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Erro ao criar equipamento')
      const novo: Equipamento & { qr_slug?: string } = await response.json()

      setEquipamentos((prev) => [...prev, novo])

      let etiqueta: EtiquetaData | null = null
      if (novo.id && novo.qr_slug) {
        etiqueta = {
          id: novo.id,
          equipamento: novo.equipamento,
          qr_slug: novo.qr_slug,
        }
      } else if (novo.id) {
        try {
          const refrescado = await fetch(`http://127.0.0.1:8000/equipamentos/api/v1/${novo.id}/`)
          if (refrescado.ok) {
            const data = await refrescado.json()
            if (data?.id && data?.qr_slug) {
              etiqueta = {
                id: data.id,
                equipamento: data.equipamento,
                qr_slug: data.qr_slug,
              }
            }
          }
        } catch (error) {
          console.error(error)
        }
      }

      if (etiqueta) {
        setEtiquetaData(etiqueta)
        setShowEtiqueta(true)
        setForm({ equipamento: '', marca: '', modelo: '', cor: '', nun_serie: '' })
        setSelectedClienteId(null)
        setSearch('')
      } else {
        alert('Entrada criada com sucesso.')
        onClose()
      }
    } catch (error) {
      console.error(error)
      alert('Nao foi possivel salvar. Verifique os campos e tente novamente.')
    }
  }

  return (
    <>
      <ModalShell
        title="Novo Equipamento"
        onClose={onClose}
        size="xl"
        footer={(
          <>
            <Button type="button" variant="danger" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSalvar}>
              Salvar e imprimir QR
            </Button>
          </>
        )}
      >
        <div className="modal-grid">
          <div className="grid-col-6">
            <InputCampo
              label="Equipamento"
              name="equipamento"
              value={form.equipamento}
              onChange={(event) => setForm((prev) => ({ ...prev, equipamento: event.target.value }))}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Marca"
              name="marca"
              value={form.marca}
              onChange={(event) => setForm((prev) => ({ ...prev, marca: event.target.value }))}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Modelo"
              name="modelo"
              value={form.modelo}
              onChange={(event) => setForm((prev) => ({ ...prev, modelo: event.target.value }))}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Cor"
              name="cor"
              value={form.cor}
              onChange={(event) => setForm((prev) => ({ ...prev, cor: event.target.value }))}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="No Serie"
              name="nun_serie"
              value={form.nun_serie}
              onChange={(event) => setForm((prev) => ({ ...prev, nun_serie: event.target.value }))}
            />
          </div>
          <div className="grid-col-6">
            <label htmlFor="cliente-search" className="input-label">Cliente</label>
            <div className="combo-field" ref={comboRef}>
              <input
                id="cliente-search"
                className="combo-input"
                type="text"
                placeholder="Buscar cliente..."
                autoComplete="off"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                aria-controls="cliente-suggestions"
                role="combobox"
              />
              <Button type="button" variant="secondary" onClick={() => setShowCliente(true)}>
                + Cliente
              </Button>
              {showSuggestions && (
                <ul id="cliente-suggestions" className="combo-suggestions" role="listbox">
                  {filtrados.slice(0, 8).map((cliente, index) => (
                    <li
                      key={cliente.id}
                      role="option"
                      aria-selected={index === activeIndex}
                      className={index === activeIndex ? 'active' : ''}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => pickCliente(cliente)}
                    >
                      {cliente.nome}
                    </li>
                  ))}
                  {filtrados.length === 0 && <li className="combo-empty">Nenhum cliente</li>}
                </ul>
              )}
            </div>
          </div>
        </div>
      </ModalShell>

      <EtiquetaQRModal
        open={showEtiqueta}
        onClose={() => setShowEtiqueta(false)}
        data={etiquetaData}
        autoPrint={false}
      />

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

