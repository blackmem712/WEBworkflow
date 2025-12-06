'use client'

import { useEffect, useMemo, useRef, useState, KeyboardEvent, ChangeEvent } from 'react'
import { api } from '@/services/api'
import type { Equipamento } from '@/types/equipamento/equipamento'
import type { Cliente } from '@/types/cliente/cliente'
import ModalShell from '@/components/ModalShell'
import ModalNovoCliente from '@/components/ModalNovoCliente'
import InputCampo from '@/components/InputCampo'
import Button from '@/components/buton'
import EtiquetaQRModal, { EtiquetaData } from '@/app/(protected)/Equipamentos/[id]/etiqueta/etiquetaQRModal'
import { STATUS_LIST, StatusCode } from '@/constants/status'
import '@/styles/components/modalEntrada.css'

type Mode = 'existing' | 'new'

interface ModalEntradaProps {
  onClose: () => void
  equipamentos: Equipamento[]
  clientes: Cliente[]
  setEquipamentos: React.Dispatch<React.SetStateAction<Equipamento[]>>
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
  onAfterStatusChange?: (id: number, status: StatusCode) => void
}

type EquipamentoCreate = {
  equipamento: string
  marca: string
  modelo: string
  cor: string
  nun_serie: string
  cliente: number
}

const STATUS_LABEL_MAP = STATUS_LIST.reduce<Record<StatusCode, string>>((acc, item) => {
  acc[item.code] = item.label
  return acc
}, {} as Record<StatusCode, string>)

export default function ModalEntradaEquipamento({
  onClose,
  equipamentos,
  clientes,
  setEquipamentos,
  setClientes,
  onAfterStatusChange,
}: ModalEntradaProps) {
  const [mode, setMode] = useState<Mode>('existing')

  const [showNovoCliente, setShowNovoCliente] = useState(false)
  const [showEtiqueta, setShowEtiqueta] = useState(false)
  const [etiquetaData, setEtiquetaData] = useState<EtiquetaData | null>(null)

  const [equipSearch, setEquipSearch] = useState('')
  const [equipOpen, setEquipOpen] = useState(false)
  const [equipActiveIndex, setEquipActiveIndex] = useState(0)
  const [selectedEquipId, setSelectedEquipId] = useState<number | null>(null)
  const equipComboRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState<Omit<EquipamentoCreate, 'cliente'>>({
    equipamento: '',
    marca: '',
    modelo: '',
    cor: '',
    nun_serie: '',
  })
  const [clienteSearch, setClienteSearch] = useState('')
  const [clienteOpen, setClienteOpen] = useState(false)
  const [clienteActiveIndex, setClienteActiveIndex] = useState(0)
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null)
  const clienteComboRef = useRef<HTMLDivElement>(null)

  const [isSubmittingExisting, setSubmittingExisting] = useState(false)
  const [isSubmittingNew, setSubmittingNew] = useState(false)

  const clienteMap = useMemo(() => {
    const map = new Map<number, Cliente>()
    clientes.forEach((cliente) => map.set(cliente.id, cliente))
    return map
  }, [clientes])

  const equipmentsWithContext = useMemo(() => {
    const term = equipSearch.trim().toLowerCase()
    return equipamentos
      .map((equip) => {
        const clientName = clienteMap.get(equip.cliente)?.nome ?? ''
        const tokens = [
          equip.equipamento,
          equip.marca,
          equip.modelo,
          equip.nun_serie,
          clientName,
        ]
          .filter(Boolean)
          .map((token) => token!.toLowerCase())

        const matches = term.length === 0 || tokens.some((token) => token.includes(term))
        const eligible = equip.status?.status === 'SA'

        return { equip, clientName, matches, eligible }
      })
      .filter((item) => item.matches)
  }, [equipamentos, equipSearch, clienteMap])

  const clienteSuggestions = useMemo(() => {
    const term = clienteSearch.trim().toLowerCase()
    if (!term) return clientes
    return clientes.filter((cliente) => (cliente.nome ?? '').toLowerCase().includes(term))
  }, [clientes, clienteSearch])

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (equipComboRef.current && !equipComboRef.current.contains(event.target as Node)) {
        setEquipOpen(false)
        setEquipActiveIndex(0)
      }
      if (clienteComboRef.current && !clienteComboRef.current.contains(event.target as Node)) {
        setClienteOpen(false)
        setClienteActiveIndex(0)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (mode === 'existing') {
      setClienteSearch('')
      setSelectedClienteId(null)
    } else {
      setEquipSearch('')
      setSelectedEquipId(null)
    }
  }, [mode])

  const handleExistingKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!equipOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setEquipOpen(true)
      return
    }
    if (!equipOpen) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setEquipActiveIndex((index) => Math.min(index + 1, equipmentsWithContext.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setEquipActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = equipmentsWithContext[equipActiveIndex]
      if (item && item.eligible) pickEquip(item.equip)
    } else if (event.key === 'Escape') {
      setEquipOpen(false)
    }
  }

  const handleClienteKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!clienteOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setClienteOpen(true)
      return
    }
    if (!clienteOpen) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setClienteActiveIndex((index) => Math.min(index + 1, clienteSuggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setClienteActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const cliente = clienteSuggestions[clienteActiveIndex]
      if (cliente) pickCliente(cliente)
    } else if (event.key === 'Escape') {
      setClienteOpen(false)
    }
  }

  const pickEquip = (equip: Equipamento) => {
    const clientName = clienteMap.get(equip.cliente)?.nome ?? ''
    setSelectedEquipId(equip.id)
    setEquipSearch(`${equip.equipamento}${clientName ? ` - ${clientName}` : ''}`)
    setEquipOpen(false)
  }

  const pickCliente = (cliente: Cliente) => {
    setSelectedClienteId(cliente.id)
    setClienteSearch(cliente.nome ?? '')
    setClienteOpen(false)
  }

  const handleEquipChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEquipSearch(event.target.value)
    setEquipOpen(true)
    setEquipActiveIndex(0)
    setSelectedEquipId(null)
  }

  const handleClienteChange = (event: ChangeEvent<HTMLInputElement>) => {
    setClienteSearch(event.target.value)
    setClienteOpen(true)
    setClienteActiveIndex(0)
    setSelectedClienteId(null)
  }

  const handleClienteCreated = (cliente: Cliente) => {
    setClientes((prev) => [...prev, cliente])
    pickCliente(cliente)
    setShowNovoCliente(false)
  }

  const resetState = () => {
    setEquipSearch('')
    setEquipOpen(false)
    setEquipActiveIndex(0)
    setSelectedEquipId(null)

    setForm({ equipamento: '', marca: '', modelo: '', cor: '', nun_serie: '' })
    setClienteSearch('')
    setClienteOpen(false)
    setClienteActiveIndex(0)
    setSelectedClienteId(null)
  }

  const buildEtiquetaData = async (
    equipId: number,
    fallback?: { equipamento?: string; qr_slug?: string | null },
  ): Promise<EtiquetaData | null> => {
    const label =
      fallback?.equipamento
      ?? equipamentos.find((item) => item.id === equipId)?.equipamento
      ?? ''

    if (fallback?.qr_slug) {
      return { id: equipId, equipamento: label, qr_slug: fallback.qr_slug }
    }

    try {
      const response = await api.get(`/equipamentos/api/v1/${equipId}/`)
      const data: (Equipamento & { qr_slug?: string }) | null = response.data ?? null
      if (data?.id && data.qr_slug) {
        return {
          id: data.id,
          equipamento: data.equipamento ?? label,
          qr_slug: data.qr_slug,
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados para impressao do QR code.', error)
    }

    return null
  }

  const closeModal = () => {
    resetState()
    onClose()
  }

  const submitExisting = async () => {
    if (!selectedEquipId) {
      alert('Selecione um equipamento com status SA para registrar a entrada.')
      return
    }

    const selected = equipamentos.find((equip) => equip.id === selectedEquipId)
    if (!selected) {
      alert('Equipamento nao encontrado.')
      return
    }
    if (selected.status?.status !== 'SA') {
      alert('Somente equipamentos em SA podem receber nova entrada.')
      return
    }

    try {
      setSubmittingExisting(true)
      const response = await api.post(`/equipamentos/api/v1/${selectedEquipId}/set_status/`, { status: 'EN' })
      const atualizado: Equipamento & { qr_slug?: string } = response.data

      const baseEquip = { ...selected, ...atualizado }
      setEquipamentos((prev) => prev.map((equip) => (equip.id === baseEquip.id ? { ...equip, ...baseEquip } : equip)))
      onAfterStatusChange?.(baseEquip.id, baseEquip.status.status as StatusCode)

      let qrSlug: string | null = baseEquip.qr_slug ?? selected.qr_slug ?? null

      if (!qrSlug) {
        try {
          const fetchResponse = await api.get(`/equipamentos/api/v1/${baseEquip.id}/`)
          const fetched: (Equipamento & { qr_slug?: string }) | null = fetchResponse.data ?? null
          qrSlug = fetched?.qr_slug ?? null
        } catch (fetchError) {
          console.error('Erro ao consultar QR code atual do equipamento.', fetchError)
        }
      }

      if (!qrSlug) {
        alert('Entrada registrada, mas não foi possível localizar o QR code atual para gerar um novo.')
        return
      }

      try {
        const rotateResponse = await api.post(`/q/${qrSlug}/rotate/`)
        const rotatedSlug: string | undefined = rotateResponse.data?.new_slug
        if (!rotatedSlug) {
          throw new Error('Resposta sem new_slug')
        }
        qrSlug = rotatedSlug
      } catch (rotateError) {
        console.error('Erro ao gerar novo QR code para o equipamento.', rotateError)
        alert('Entrada registrada, porém não foi possível gerar o novo QR code. Verifique as permissões e tente novamente.')
        return
      }

      const finalEquip = { ...baseEquip, qr_slug: qrSlug ?? undefined }
      setEquipamentos((prev) => prev.map((equip) => (equip.id === finalEquip.id ? { ...equip, ...finalEquip } : equip)))

      const etiqueta = await buildEtiquetaData(finalEquip.id, {
        equipamento: finalEquip.equipamento,
        qr_slug: qrSlug,
      })

      if (etiqueta) {
        setEtiquetaData(etiqueta)
        setShowEtiqueta(true)
        resetState()
      } else {
        alert('Entrada registrada, mas não foi possível preparar o QR code para impressão. Abra o equipamento para tentar novamente.')
        closeModal()
      }
    } catch (error) {
      console.error(error)
      alert('Não foi possível registrar a entrada. Tente novamente.')
    } finally {
      setSubmittingExisting(false)
    }
  }

  const submitNew = async () => {
    if (!form.equipamento.trim()) {
      alert('Informe o nome do equipamento.')
      return
    }
    if (!selectedClienteId) {
      alert('Selecione um cliente valido.')
      return
    }

    const payload: EquipamentoCreate = {
      ...form,
      cliente: selectedClienteId,
    }

    try {
      setSubmittingNew(true)
      const response = await api.post('/equipamentos/api/v1/', payload)
      const novo: Equipamento & { qr_slug?: string } = response.data

      setEquipamentos((prev) => [...prev, novo])
      onAfterStatusChange?.(novo.id, 'EN')

      const etiqueta = await buildEtiquetaData(novo.id, {
        equipamento: novo.equipamento,
        qr_slug: novo.qr_slug ?? null,
      })

      if (etiqueta) {
        setEtiquetaData(etiqueta)
        setShowEtiqueta(true)
        resetState()
      } else {
        alert('Entrada criada com sucesso, porém não foi possível preparar o QR code automaticamente. Abra o equipamento para imprimir.')
        closeModal()
      }
    } catch (error) {
      console.error(error)
      alert('Não foi possível criar a entrada. Verifique os campos e tente novamente.')
    } finally {
      setSubmittingNew(false)
    }
  }

  const selectedEquipInfo = useMemo(() => {
    if (!selectedEquipId) return null
    const item = equipmentsWithContext.find(({ equip }) => equip.id === selectedEquipId)
    if (!item) return null
    return {
      ...item,
      statusLabel: STATUS_LABEL_MAP[item.equip.status.status as StatusCode] ?? item.equip.status.status,
    }
  }, [equipmentsWithContext, selectedEquipId])

  const selectedEquipCliente = selectedEquipInfo
    ? clienteMap.get(selectedEquipInfo.equip.cliente) ?? null
    : null

  const selectedEquipFieldKey = selectedEquipInfo?.equip.id?.toString() ?? 'selected-equip'

  const selectedEquipContact = selectedEquipCliente
    ? selectedEquipCliente.telefone || selectedEquipCliente.email || ''
    : ''

  const selectedCliente = selectedClienteId ? clienteMap.get(selectedClienteId) ?? null : null

  const footer = (
    <>
      <Button
        type='button'
        variant='danger'
        onClick={closeModal}
        disabled={isSubmittingExisting || isSubmittingNew}
      >
        Cancelar
      </Button>
      {mode === 'existing' ? (
        <Button
          type='button'
          onClick={submitExisting}
          disabled={isSubmittingExisting || !selectedEquipId}
        >
          {isSubmittingExisting ? 'Registrando...' : 'Registrar entrada'}
        </Button>
      ) : (
        <Button
          type='button'
          onClick={submitNew}
          disabled={isSubmittingNew}
        >
          {isSubmittingNew ? 'Salvando...' : 'Salvar e imprimir QR'}
        </Button>
      )}
    </>
  )

  return (
    <>
      <ModalShell
        title='Registrar entrada'
        onClose={closeModal}
        size='xl'
        footer={footer}
        bodyClassName='modal-entrada-body'
      >
        <div className='mode-switch' role='tablist' aria-label='Modo de registro'>
          <button
            type='button'
            role='tab'
            aria-selected={mode === 'existing'}
            className={mode === 'existing' ? 'mode-switch__btn active' : 'mode-switch__btn'}
            onClick={() => setMode('existing')}
          >
            Equipamento existente
          </button>
          <button
            type='button'
            role='tab'
            aria-selected={mode === 'new'}
            className={mode === 'new' ? 'mode-switch__btn active' : 'mode-switch__btn'}
            onClick={() => setMode('new')}
          >
            Novo equipamento
          </button>
        </div>

        {mode === 'existing' ? (
          <div className='existing-pane'>
            <div className='combo-group' ref={equipComboRef}>
              <label className='combo-label' htmlFor='entrada-equipamento'>Equipamento</label>
              <input
                id='entrada-equipamento'
                className='combo-input'
                type='text'
                placeholder='Buscar por nome, cliente ou numero de serie'
                autoComplete='off'
                value={equipSearch}
                onChange={handleEquipChange}
                onFocus={() => setEquipOpen(true)}
                onKeyDown={handleExistingKey}
                role='combobox'
                aria-expanded={equipOpen}
                aria-controls='entrada-equipamento-listbox'
                aria-autocomplete='list'
              />
              {equipOpen && equipmentsWithContext.length > 0 && (
                <ul className='combo-suggestions' id='entrada-equipamento-listbox' role='listbox'>
                  {equipmentsWithContext.slice(0, 10).map(({ equip, clientName, eligible }, index) => (
                    <li
                      key={equip.id}
                      role='option'
                      aria-selected={equipActiveIndex === index}
                      aria-disabled={!eligible}
                      className={[
                        'combo-suggestion',
                        equipActiveIndex === index ? 'active' : '',
                        eligible ? '' : 'disabled',
                      ].join(' ').trim()}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => eligible && pickEquip(equip)}
                    >
                      <span className='combo-suggestion__title'>{equip.equipamento}</span>
                      <span className='combo-suggestion__meta'>
                        {clientName ? `${clientName} - ` : ''}
                        {equip.nun_serie || 'sem serie'}
                      </span>
                      {!eligible && (
                        <span className='combo-suggestion__badge'>
                          Indisponivel - {STATUS_LABEL_MAP[equip.status.status as StatusCode] ?? equip.status.status}
                        </span>
                      )}
                    </li>
                  ))}
                  {equipmentsWithContext.length === 0 && (
                    <li className='combo-suggestion muted'>Nenhum resultado</li>
                  )}
                </ul>
              )}
            </div>

            {selectedEquipInfo ? (
              <div className='form-grid form-grid--tight existing-grid' role='status' aria-live='polite'>
                <div className='grid-col-6'>
                  <InputCampo
                    label='Equipamento'
                    name={`view-equipamento-${selectedEquipFieldKey}`}
                    value={selectedEquipInfo.equip.equipamento ?? ''}
                    disabled
                  />
                </div>
                <div className='grid-col-6'>
                  <InputCampo
                    label='Status atual'
                    name={`view-status-${selectedEquipFieldKey}`}
                    value={selectedEquipInfo.statusLabel}
                    disabled
                  />
                </div>
                <div className='grid-col-6'>
                  <InputCampo
                    label='Marca'
                    name={`view-marca-${selectedEquipFieldKey}`}
                    value={selectedEquipInfo.equip.marca ?? ''}
                    disabled
                  />
                </div>
                <div className='grid-col-6'>
                  <InputCampo
                    label='Modelo'
                    name={`view-modelo-${selectedEquipFieldKey}`}
                    value={selectedEquipInfo.equip.modelo ?? ''}
                    disabled
                  />
                </div>
                <div className='grid-col-6'>
                  <InputCampo
                    label='Cor'
                    name={`view-cor-${selectedEquipFieldKey}`}
                    value={selectedEquipInfo.equip.cor ?? ''}
                    disabled
                  />
                </div>
                <div className='grid-col-6'>
                  <InputCampo
                    label='Numero de serie'
                    name={`view-serie-${selectedEquipFieldKey}`}
                    value={selectedEquipInfo.equip.nun_serie ?? ''}
                    disabled
                  />
                </div>
                <div className='grid-col-6'>
                  <InputCampo
                    label='Cliente'
                    name={`view-cliente-${selectedEquipFieldKey}`}
                    value={selectedEquipCliente?.nome ?? selectedEquipInfo.clientName ?? ''}
                    disabled
                  />
                </div>
                <div className='grid-col-6'>
                  <InputCampo
                    label='Contato'
                    name={`view-contato-${selectedEquipFieldKey}`}
                    value={selectedEquipContact || 'Não informado'}
                    disabled
                  />
                </div>
                <div className='grid-col-12'>
                  <InputCampo
                    label='QR code atual'
                    name={`view-qr-${selectedEquipFieldKey}`}
                    value={selectedEquipInfo.equip.qr_slug ?? 'Nao disponivel'}
                    disabled
                  />
                </div>
              </div>
            ) : (
              <p className='summary-placeholder existing-placeholder'>
                Busque um equipamento que esteja em SA para registrar uma nova entrada.
              </p>
            )}
          </div>
        ) : (
          <div className='new-pane'>
            <div className='form-grid form-grid--tight'>
              <div className='grid-col-4'>
                <InputCampo
                  label='Equipamento'
                  name='equipamento'
                  value={form.equipamento}
                  onChange={(event) => setForm((prev) => ({ ...prev, equipamento: event.target.value }))}
                />
              </div>
              <div className='grid-col-4'>
                <InputCampo
                  label='Marca'
                  name='marca'
                  value={form.marca}
                  onChange={(event) => setForm((prev) => ({ ...prev, marca: event.target.value }))}
                />
              </div>
              <div className='grid-col-4'>
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
              <div className='grid-col-12'>
                <div className='combo-group' ref={clienteComboRef}>
                  <label className='combo-label' htmlFor='entrada-cliente'>Cliente</label>
                  <div className='combo-inline'>
                    <input
                      id='entrada-cliente'
                      className='combo-input'
                      type='text'
                      placeholder='Buscar cliente'
                      autoComplete='off'
                      value={clienteSearch}
                      onChange={handleClienteChange}
                      onFocus={() => setClienteOpen(true)}
                      onKeyDown={handleClienteKey}
                      role='combobox'
                      aria-expanded={clienteOpen}
                      aria-controls='entrada-cliente-listbox'
                      aria-autocomplete='list'
                    />
                    <Button type='button' variant='secondary' onClick={() => setShowNovoCliente(true)}>
                      + Cliente
                    </Button>
                  </div>
                  {clienteOpen && (
                    <ul className='combo-suggestions' id='entrada-cliente-listbox' role='listbox'>
                      {clienteSuggestions.slice(0, 10).map((cliente, index) => (
                        <li
                          key={cliente.id}
                          role='option'
                          aria-selected={clienteActiveIndex === index}
                          className={['combo-suggestion', clienteActiveIndex === index ? 'active' : ''].join(' ').trim()}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => pickCliente(cliente)}
                        >
                          <span className='combo-suggestion__title'>{cliente.nome}</span>
                          <span className='combo-suggestion__meta'>{cliente.cpf || cliente.telefone || 'N/A'}</span>
                        </li>
                      ))}
                      {clienteSuggestions.length === 0 && (
                        <li className='combo-suggestion muted'>Nenhum cliente encontrado</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <div className='grid-col-12'>
                {selectedCliente ? (
                  <div className='selected-summary'>
                    <div className='summary-row'>
                      <span className='summary-label'>Cliente selecionado</span>
                      <span className='summary-value'>{selectedCliente.nome}</span>
                    </div>
                    <div className='summary-row'>
                      <span className='summary-label'>Contato</span>
                      <span className='summary-value'>{selectedCliente.telefone || selectedCliente.email || 'N/A'}</span>
                    </div>
                  </div>
                ) : (
                  <p className='summary-placeholder'>
                    Busque e selecione um cliente existente ou cadastre um novo.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </ModalShell>

      <EtiquetaQRModal
        open={showEtiqueta}
        onClose={() => setShowEtiqueta(false)}
        data={etiquetaData}
        autoPrint={false}
      />

      {showNovoCliente && (
        <ModalNovoCliente
          onClose={() => setShowNovoCliente(false)}
          setClientes={setClientes}
          onCreated={handleClienteCreated}
        />
      )}
    </>
  )
}
