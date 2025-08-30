'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente }     from '@/types/cliente/cliente'
import { Servico }     from '@/types/servico/servico'
import { Produto }     from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import { Orcamento }   from '@/types/orcamento/orcamento'
import ModalNovoOrcamento          from '@/components/ModalNovoOrcamento'
import ModalVisualizarOrcamento    from '@/components/ModalVisualizarOrcamento'
import { STATUS_LIST, StatusCode } from '@/constants/status'
import '@/styles/kanban.css'
import { api } from '@/services/api' // <— usa axios com Bearer + refresh

const LS_KEY = 'kanban_equipment_status_v1'

// Utils de LocalStorage
function loadOverrides(): Record<string, StatusCode> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
function saveOverride(id: number, code: StatusCode) {
  const map = loadOverrides()
  map[id] = code
  localStorage.setItem(LS_KEY, JSON.stringify(map))
}
function removeOverride(id: number) {
  const map = loadOverrides()
  delete map[id]
  localStorage.setItem(LS_KEY, JSON.stringify(map))
}

export default function ProtectedHome() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [clientes, setClientes]         = useState<Cliente[]>([])
  const [servicos, setServicos]         = useState<Servico[]>([])
  const [produtos, setProdutos]         = useState<Produto[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [orcamentos, setOrcamentos]     = useState<Orcamento[]>([])

  // Modal: Novo orçamento (ao clicar em EN)
  const [newOrcEquip, setNewOrcEquip]   = useState<Equipamento | null>(null)
  const [showOrcModal, setShowOrcModal] = useState(false)

  // Modal: Visualizar/Responsabilizar (ao clicar em OR/MA)
  const [selOrcamento, setSelOrcamento] = useState<Orcamento | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewMode, setViewMode] = useState<'assign' | 'maintenance'>('assign')

  // flags de carregamento para aplicar overrides 1x
  const overridesAppliedRef = useRef(false)

  // fetch inicial (autenticado via interceptor)
  useEffect(() => {
    Promise.all([
      api.get('/equipamentos/api/v1/'),
      api.get('/pessoas/api/v1/'),
      api.get('/servicos/api/v1/'),
      api.get('/produtos/api/v1/'),
      api.get('/funcionarios/api/v1/'),
      api.get('/orcamentos/api/v1/'),
    ])
      .then(([eq, cl, se, pr, fu, or]) => {
        setEquipamentos(eq.data)
        setClientes(cl.data)
        setServicos(se.data)
        setProdutos(pr.data)
        setFuncionarios(fu.data)
        setOrcamentos(or.data)
      })
      .catch(console.error)
  }, [])

  // Mapa clienteId → nome
  const clientMap = useMemo(() => {
    const m = new Map<number, string>()
    clientes.forEach(c => m.set(c.id, c.nome))
    return m
  }, [clientes])

  // Regras de negócio (coerção do status desejado)
  const enforceRules = (equipId: number, desired: StatusCode): StatusCode => {
    const hasOrc = orcamentos.some(o => o.equipamento === equipId)
    // Regra 1: tem orçamento → não pode ficar em EN
    if (hasOrc && desired === 'EN') return 'OR'
    // Regra 2: não tem orçamento → não pode ficar em OR
    if (!hasOrc && desired === 'OR') return 'EN'
    return desired
  }

  // Aplica overrides salvos no LS (apenas 1 vez, após dados carregados)
  useEffect(() => {
    if (overridesAppliedRef.current) return
    if (equipamentos.length === 0) return
    const map = loadOverrides()
    if (Object.keys(map).length === 0) {
      overridesAppliedRef.current = true
      return
    }

    setEquipamentos(prev =>
      prev.map(e => {
        const desired = map[e.id]
        if (!desired) return e
        const coerced = enforceRules(e.id, desired)
        if (coerced !== desired) saveOverride(e.id, coerced) // ajusta LS se conflitar com regras
        if (coerced !== e.status.status) {
          return { ...e, status: { ...e.status, status: coerced } }
        }
        return e
      })
    )
    overridesAppliedRef.current = true
  }, [equipamentos, orcamentos])

  // Agrupa por status
  const grouped = useMemo(() => {
    return STATUS_LIST.reduce<Record<StatusCode, Equipamento[]>>(
      (acc, { code }) => {
        acc[code] = equipamentos.filter(e => e.status.status === code)
        return acc
      },
      {} as any
    )
  }, [equipamentos])

  // Drag & drop → move + salva no LS + PATCH backend
  const onDragEnd = (res: DropResult) => {
    const { source, destination, draggableId } = res
    if (!destination || destination.droppableId === source.droppableId) return

    const equipId  = Number(draggableId)
    let newStatus  = destination.droppableId as StatusCode

    // Regras locais
    newStatus = enforceRules(equipId, newStatus)

    // Atualiza local
    setEquipamentos(prev =>
      prev.map(e =>
        e.id === equipId ? { ...e, status: { ...e.status, status: newStatus } } : e
      )
    )

    // Salva no LS
    saveOverride(equipId, newStatus)

    // PATCH backend — usa 'novo_status' (o backend lê isso e chama registrar_status)
    api.patch(`/equipamentos/api/v1/${equipId}/`, { novo_status: newStatus })
      .catch((err) => {
        console.error(err)
        // rollback simples se der erro
        setEquipamentos(prev =>
          prev.map(e =>
            e.id === equipId ? { ...e, status: { ...e.status, status: (source.droppableId as StatusCode) } } : e
          )
        )
        removeOverride(equipId)
        alert(err?.response?.data?.detail || 'Falha ao atualizar status (verifique permissões).')
      })
  }

  const onCardClick = (code: StatusCode, eq: Equipamento) => {
    if (code === 'EN') {
      setNewOrcEquip(eq)
      setShowOrcModal(true)
      return
    }
    if (code === 'OR') {
      const orc = orcamentos.find(o => o.equipamento === eq.id) || null
      if (!orc) return
      setSelOrcamento(orc)
      setViewMode('assign')          // atribuir técnico + enviar p/ MA
      setShowViewModal(true)
      return
    }
    if (code === 'MA') {
      const orc = orcamentos.find(o => o.equipamento === eq.id) || null
      if (!orc) return
      setSelOrcamento(orc)
      setViewMode('maintenance')     // concluir manutenção (vai p/ GA)
      setShowViewModal(true)
      return
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {STATUS_LIST.map(({ code, label }) => (
            <Droppable key={code} droppableId={code}>
              {(provDrop, snapDrop) => (
                <div
                  className="kanban-column"
                  ref={provDrop.innerRef}
                  {...provDrop.droppableProps}
                >
                  <h2 className="column-header">{label}</h2>
                  <div
                    className={`column-body ${snapDrop.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    {grouped[code].map((eq, idx) => (
                      <Draggable key={eq.id.toString()} draggableId={eq.id.toString()} index={idx}>
                        {(provDrag, snapDrag) => (
                          <div
                            ref={provDrag.innerRef}
                            {...provDrag.draggableProps}
                            {...provDrag.dragHandleProps}
                            className={`kanban-card ${snapDrag.isDragging ? 'dragging' : ''}`}
                            onClick={() => onCardClick(code as StatusCode, eq)}
                          >
                            <h3 className="card-title">{eq.equipamento}</h3>
                            <p className="card-client">
                              Cliente: {clientMap.get(eq.cliente) ?? '—'}
                            </p>
                            <p className="card-date">
                              Entrada:{' '}
                              {eq.status.date_entrada
                                ? new Date(eq.status.date_entrada!).toLocaleDateString()
                                : '—'}
                            </p>
                            <p className="card-series">Série: {eq.nun_serie}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provDrop.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modal: Novo Orçamento (EN) */}
      {showOrcModal && newOrcEquip && (
        <ModalNovoOrcamento
          clientes={clientes}
          initialEquip={newOrcEquip}
          initialClienteName={clientMap.get(newOrcEquip.cliente)!}
          equipamentos={equipamentos}
          servicos={servicos}
          produtos={produtos}
          funcionarios={funcionarios}
          onClose={() => {
            setShowOrcModal(false)
            setNewOrcEquip(null)
          }}
          setOrcamentos={setOrcamentos}
          setEquipamentos={(updater) => {
            // intercepta para também gravar no LS quando virar OR
            setEquipamentos(prev => {
              const next = typeof updater === 'function' ? (updater as any)(prev) : (updater as Equipamento[])
              next.forEach(e => {
                if (e.status.status === 'OR') saveOverride(e.id, 'OR')
              })
              return next
            })
          }}
        />
      )}

      {/* Modal: Visualizar/Responsabilizar (OR/MA) */}
      {showViewModal && selOrcamento && (() => {
        const eq = equipamentos.find(e => e.id === selOrcamento.equipamento)
        if (!eq) return null
        const cli = clientes.find(c => c.id === eq.cliente)
        if (!cli) return null
        return (
          <ModalVisualizarOrcamento
            mode={viewMode}
            orcamento={selOrcamento}
            cliente={cli}
            equipamento={eq}
            servicos={servicos}
            produtos={produtos}
            funcionarios={funcionarios}
            onClose={() => {
              setShowViewModal(false)
              setSelOrcamento(null)
            }}
            setOrcamentos={setOrcamentos}
            readOnlyTech={viewMode === 'maintenance'}
            setEquipamentos={(updater) => {
              // intercepta para gravar no LS quando virar MA/GA
              setEquipamentos(prev => {
                const next = typeof updater === 'function' ? (updater as any)(prev) : (updater as Equipamento[])
                next.forEach(e => {
                  if (e.status.status === 'MA') saveOverride(e.id, 'MA')
                  if (e.status.status === 'GA') saveOverride(e.id, 'GA')
                })
                return next
              })
            }}
          />
        )
      })()}
    </>
  )
}
