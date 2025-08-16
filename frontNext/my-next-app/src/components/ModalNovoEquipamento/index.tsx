// src/components/ModalNovoEquipamento/index.tsx
'use client'

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente }     from '@/types/cliente/cliente'
import InputCampo      from '@/components/InputCampo'
import Button          from '@/components/buton'
import ModalNovoCliente from '@/components/ModalNovoCliente'
import '@/styles/components/modalEquipamento.css'

interface Props {
  onClose: () => void
  setEquipamentos: React.Dispatch<React.SetStateAction<Equipamento[]>>
  clientes: Cliente[]
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
}

// Tipo específico para criação
type EquipamentoCreate = {
  equipamento: string
  marca: string
  modelo: string
  cor: string
  nun_serie: string
  cliente: number
}

export default function ModalNovoEquipamento({
  onClose, setEquipamentos, clientes, setClientes
}: Props) {
  const [form, setForm] = useState<Omit<EquipamentoCreate, 'cliente'>>({
    equipamento: '', marca: '', modelo: '', cor: '', nun_serie: ''
  })
  // Auto-complete
  const [search, setSearch]                 = useState('')
  const [selectedClienteId, setSelectedId]  = useState<number | null>(null)
  const [showSug, setShowSug]               = useState(false)
  const [activeIndex, setActiveIndex]       = useState(0)
  const comboRef = useRef<HTMLDivElement>(null)

  // Modal novo cliente
  const [showCliente, setShowCliente] = useState(false)

  // Fecha sugestões clicando fora de todo o combobox
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setShowSug(false)
        setActiveIndex(0)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // Filtragem
  const filtrados = clientes.filter(c =>
    (c.nome ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const pickByIndex = (idx: number) => {
    const c = filtrados[idx]
    if (!c) return
    setSelectedId(c.id)
    setSearch(c.nome ?? '')
    setShowSug(false)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSug && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setShowSug(true)
      return
    }
    if (!showSug) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtrados.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      pickByIndex(activeIndex)
    } else if (e.key === 'Escape') {
      setShowSug(false)
    }
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    setShowSug(true)
    setActiveIndex(0)
    // Limpamos o ID selecionado se o usuário voltar a digitar
    setSelectedId(null)
  }

  const handleSelect = (c: Cliente) => {
    setSelectedId(c.id)
    setSearch(c.nome ?? '')
    setShowSug(false)
  }

  // (Opcional) Se seu ModalNovoCliente suportar callback onCreated
  const handleClienteCriado = (novo: Cliente) => {
    // Atualiza lista externa
    setClientes((prev) => [...prev, novo])
    // Já seleciona esse cliente no combobox
    setSelectedId(novo.id)
    setSearch(novo.nome ?? '')
    setShowCliente(false)
  }

  const handleSalvar = () => {
    let clienteId = selectedClienteId

    // Se o usuário só digitou, tenta casar:
    if (!clienteId) {
      // 1) match exato (case-insensitive)
      const exato = clientes.find(
        c => (c.nome ?? '').toLowerCase().trim() === search.toLowerCase().trim()
      )
      // 2) se não houver exato, se houver só 1 filtrado, assume-o
      const unico = filtrados.length === 1 ? filtrados[0] : undefined

      if (exato) {
        clienteId = exato.id
      } else if (unico) {
        clienteId = unico.id
      } else {
        alert('Selecione um cliente válido na lista de sugestões.')
        return
      }
    }

    const body: EquipamentoCreate = {
      ...form,
      cliente: clienteId
    }

    fetch('http://127.0.0.1:8000/equipamentos/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body),
    })
      .then(r => {
        if (!r.ok) throw new Error('Erro ao criar equipamento')
        return r.json()
      })
      .then((novo: Equipamento) => {
        setEquipamentos(prev => [...prev, novo])
        onClose()
      })
      .catch((err) => {
        console.error(err)
        alert('Não foi possível salvar. Verifique os campos e tente novamente.')
      })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-equip wide">
        <h2>Novo Equipamento</h2>

        <div className="form-grid">
          <div className="grid-col-6">
            <InputCampo
              label="Equipamento"
              name="equipamento"
              value={form.equipamento}
              onChange={e=>setForm({...form, equipamento: e.target.value})}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Marca"
              name="marca"
              value={form.marca}
              onChange={e=>setForm({...form, marca: e.target.value})}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Modelo"
              name="modelo"
              value={form.modelo}
              onChange={e=>setForm({...form, modelo: e.target.value})}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Cor"
              name="cor"
              value={form.cor}
              onChange={e=>setForm({...form, cor: e.target.value})}
            />
          </div>
          <div className="grid-col-6">
            <InputCampo
              label="Nº Série"
              name="nun_serie"
              value={form.nun_serie}
              onChange={e=>setForm({...form, nun_serie: e.target.value})}
            />
          </div>

          {/* Combobox de Cliente */}
          <div className="grid-col-6">
            <label htmlFor="cliente-search" className="input-label">Cliente</label>

            <div className="search-wrap" ref={comboRef}>
              <input
                id="cliente-search"
                className="search-input"
                type="text"
                placeholder="Buscar cliente..."
                autoComplete="off"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setShowSug(true)}
                onKeyDown={handleKey}
                aria-autocomplete="list"
                aria-expanded={showSug}
                aria-controls="cliente-suggestions"
                role="combobox"
              />

              <Button variant="secondary" onClick={() => setShowCliente(true)}>
                + Cliente
              </Button>

              {showSug && (
                <ul
                  id="cliente-suggestions"
                  className="suggestions"
                  role="listbox"
                >
                  {filtrados.slice(0, 8).map((c, i) => (
                    <li
                      key={c.id}
                      role="option"
                      aria-selected={i === activeIndex}
                      className={i === activeIndex ? 'active' : ''}
                      onMouseDown={(e) => e.preventDefault()} // evita blur antes do click
                      onClick={() => handleSelect(c)}
                    >
                      {c.nome}
                    </li>
                  ))}
                  {filtrados.length === 0 && (
                    <li className="no-sug">Nenhum cliente</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="modal-buttons">
          <Button variant="primary" onClick={handleSalvar}>Salvar</Button>
          <Button variant="danger"  onClick={onClose}>Cancelar</Button>
        </div>

        {showCliente && (
          // Se seu ModalNovoCliente expõe onCreated, passe o callback; caso não, remova a prop.
          <ModalNovoCliente
            onClose={()=>setShowCliente(false)}
            setClientes={setClientes}
            onCreated={handleClienteCriado as any}
          />
        )}
      </div>
    </div>
  )
}
