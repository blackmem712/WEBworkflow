'use client'

import { useState, useRef, useEffect } from 'react'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente }     from '@/types/cliente/cliente'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import ModalNovoCliente from '@/components/ModalNovoCliente'
import '@/styles/components/modalEquipamento.css'

interface Props {
  onClose: () => void
  setEquipamentos: React.Dispatch<React.SetStateAction<Equipamento[]>>
  clientes: Cliente[]
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
}

export default function ModalNovoEquipamento({
  onClose, setEquipamentos, clientes, setClientes
}: Props) {
  const [form, setForm] = useState<Omit<Equipamento,'id'>>({
    equipamento: '', marca: '', modelo: '', cor: '', nun_serie: '', cliente: 0
  })
  const [search, setSearch]       = useState('')
  const [showSug, setShowSug]     = useState(false)
  const [showCliente, setShowCliente] = useState(false)
  const sugRef = useRef<HTMLUListElement>(null)

  // atualiza cliente no form quando search corresponde exatamente a um nome
  const handleSelect = (c: Cliente) => {
    setForm(prev => ({ ...prev, cliente: c.id }))
    setSearch(c.nome ?? '')
    setShowSug(false)
  }

  // fecha sugestões ao clicar fora
    useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sugRef.current && !sugRef.current.contains(e.target as Node))
        setShowSug(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSalvar = () => {
    fetch('http://127.0.0.1:8000/equipamentos/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form),
    })
      .then(r => {
        if (!r.ok) throw new Error('Erro')
        return r.json()
      })
      .then((novo: Equipamento) => {
        setEquipamentos(prev => [...prev, novo])
        onClose()
      })
      .catch(console.error)
  }

  const filtrados = clientes.filter(c =>
    (c.nome ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="modal-overlay">
      <div className="modal-equip wide">
        <h2>Novo Equipamento</h2>
        <div className="form-grid">
          <div className="grid-col-6">
            <InputCampo label="Equipamento" name="equipamento" value={form.equipamento}  onChange={e=>setForm({...form, equipamento: e.target.value})} />
          </div>
          <div className="grid-col-6">
            <InputCampo label="Marca"        name="marca"        value={form.marca}         onChange={e=>setForm({...form, marca: e.target.value})} />
          </div>
          <div className="grid-col-6">
            <InputCampo label="Modelo"       name="modelo"       value={form.modelo}        onChange={e=>setForm({...form, modelo: e.target.value})} />
          </div>
          <div className="grid-col-6">
            <InputCampo label="Cor"          name="cor"          value={form.cor}           onChange={e=>setForm({...form, cor: e.target.value})} />
          </div>
          <div className="grid-col-6">
            <InputCampo label="Nº Série"     name="nun_serie"    value={form.nun_serie}     onChange={e=>setForm({...form, nun_serie: e.target.value})} />
          </div>

          {/* Campo de busca de Cliente */}
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
                {filtrados.slice(0,8).map(c => (
                  <li key={c.id} onClick={() => handleSelect(c)}>
                    {c.nome}
                  </li>
                ))}
                {filtrados.length === 0 && <li className="no-sug">Nenhum cliente</li>}
              </ul>
            )}
          </div>
        </div>

        <div className="modal-buttons">
          <Button variant="primary" onClick={handleSalvar}>Salvar</Button>
          <Button variant="danger"  onClick={onClose}>Cancelar</Button>
        </div>

        {showCliente && (
          <ModalNovoCliente onClose={()=>setShowCliente(false)} setClientes={setClientes} />
        )}
      </div>
    </div>
  )
}