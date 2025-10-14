'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { api } from '@/services/api' // axios com Bearer + refresh

import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente }     from '@/types/cliente/cliente'
import { Servico }     from '@/types/servico/servico'
import { Produto }     from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import { Orcamento }   from '@/types/orcamento/orcamento'

import ModalEntradaEquipamento  from '@/components/ModalEntradaEquipamento'
import ModalNovoOrcamento       from '@/components/ModalNovoOrcamento'
import ModalVisualizarOrcamento from '@/components/ModalVisualizarOrcamento'
import ModalEntrega             from '@/components/ModalEntrega'
import { STATUS_LIST, StatusCode } from '@/constants/status'
import '@/styles/kanban.css'

const LS_KEY = 'kanban_equipment_status_v1'
const API = (p: string) => `http://127.0.0.1:8000${p}`

// ---------------- LocalStorage helpers ----------------
function loadOverrides(): Record<string, StatusCode> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
}
function saveOverride(id: number, code: StatusCode) {
  const map = loadOverrides(); map[id] = code; localStorage.setItem(LS_KEY, JSON.stringify(map))
}
function removeOverride(id: number) {
  const map = loadOverrides(); delete map[id]; localStorage.setItem(LS_KEY, JSON.stringify(map))
}

export default function ProtectedHome() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [clientes, setClientes]         = useState<Cliente[]>([])
  const [servicos, setServicos]         = useState<Servico[]>([])
  const [produtos, setProdutos]         = useState<Produto[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [orcamentos, setOrcamentos]     = useState<Orcamento[]>([])

  // Modal: Novo orAamento (EN)
  const [newOrcEquip, setNewOrcEquip]   = useState<Equipamento | null>(null)
  const [showOrcModal, setShowOrcModal] = useState(false)

  // Modal: Visualizar / Responsabilizar (OR/MA)
  const [selOrcamento, setSelOrcamento]   = useState<Orcamento | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewMode, setViewMode] = useState<'assign' | 'maintenance'>('assign')

  // Modal: Entrega (GA) e RelatA?rio (SA)
  const [deliveryEquip, setDeliveryEquip] = useState<Equipamento | null>(null)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [reportEquip, setReportEquip] = useState<Equipamento | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showEntradaModal, setShowEntradaModal] = useState(false)

  // --------- Filtros ---------
  const [filterCliente, setFilterCliente] = useState<string>('')
  const [filterTecnico, setFilterTecnico] = useState<string>('')
  const [filterMarca, setFilterMarca]     = useState<string>('')
  const [filterDesde, setFilterDesde]     = useState<string>('') // yyyy-mm-dd
  const [filterAte, setFilterAte]         = useState<string>('') // yyyy-mm-dd

  const overridesAppliedRef = useRef(false)
  const search = useSearchParams()
  const router = useRouter()

  // ---------------- Fetch inicial ----------------
  const onCardClick2 = (code: StatusCode, eq: Equipamento) => {
    if (code === 'GA') {
      setDeliveryEquip(eq)
      setShowDeliveryModal(true)
      return
    }
    if (code === 'SA') {
      setReportEquip(eq)
      setShowReportModal(true)
      return
    }
    onCardClick(code, eq)
  }

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
        setProdotos(pr.data as any) // typo? garantir cast
        setFuncionarios(fu.data)
        setOrcamentos(or.data)
      })
      .catch(console.error)
  }, [])

  // corrige typo caso precise
  function setProdotos(data: Produto[]) { setProdutos(data) }

  // ---------------- Mapa clienteId a?? nome ----------------
  const clientMap = useMemo(() => {
    const m = new Map<number, string>()
    clientes.forEach(c => m.set(c.id, c.nome ?? ''))
    return m
  }, [clientes])

  // ---------------- Regras de negA?cio ----------------
  const enforceRules = (equipId: number, desired: StatusCode): StatusCode => {
    const hasOrc = orcamentos.some(o => o.equipamento === equipId)
    if (hasOrc && desired === 'EN') return 'OR'
    if (!hasOrc && desired === 'OR') return 'EN'
    return desired
  }

  // ---------------- Aplica overrides 1x ----------------
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
        if (coerced !== desired) saveOverride(e.id, coerced)
        if (coerced !== e.status.status) {
          return { ...e, status: { ...e.status, status: coerced } }
        }
        return e
      })
    )
    overridesAppliedRef.current = true
  }, [equipamentos, orcamentos])

  // ---------------- Agrupa por status ----------------
  // Mapeia tecnico por equipamento (a partir do orcamento mais recente)
  const techMap = useMemo(() => {
    const map = new Map<number, string>()
    const byEquip = new Map<number, number>() // equipId -> max orc id
    orcamentos.forEach(o => {
      const prev = byEquip.get(o.equipamento) || 0
      if (o.id > prev) byEquip.set(o.equipamento, o.id)
    })
    byEquip.forEach((orcId, equipId) => {
      const o = orcamentos.find(x => x.id === orcId)
      const f = funcionarios.find(fn => fn.cargo_funcionario && fn.cargo_funcionario.id === (o?.cargo_funcionario || -1))
      if (f && f.nome) map.set(equipId, f.nome)
    })
    return map
  }, [orcamentos, funcionarios])

  // Opcoes para selects
  const clienteOptions = useMemo(() => {
    return clientes.map(c => c.nome).filter(Boolean) as string[]
  }, [clientes])
  const tecnicoOptions = useMemo(() => {
    const set = new Set<string>()
    funcionarios.forEach(f => { if (f?.nome) set.add(f.nome) })
    return Array.from(set)
  }, [funcionarios])
  const marcaOptions = useMemo(() => {
    const set = new Set<string>()
    equipamentos.forEach(e => { if (e?.marca) set.add(e.marca) })
    return Array.from(set)
  }, [equipamentos])

  // Aplica filtros
  const filteredEquipamentos = useMemo(() => {
    const dMin = filterDesde ? new Date(filterDesde + 'T00:00:00') : null
    const dMax = filterAte ? new Date(filterAte + 'T23:59:59') : null
    return equipamentos.filter(e => {
      if (filterCliente) {
        const nomeCli = clientMap.get(e.cliente) || ''
        if (nomeCli !== filterCliente) return false
      }
      if (filterTecnico) {
        const nomeTec = techMap.get(e.id) || ''
        if (nomeTec !== filterTecnico) return false
      }
      if (filterMarca && e.marca !== filterMarca) return false
      if (dMin || dMax) {
        const dt = e.status?.date_entrada ? new Date(e.status.date_entrada) : null
        if (dt) {
          if (dMin && dt < dMin) return false
          if (dMax && dt > dMax) return false
        }
      }
      return true
    })
  }, [equipamentos, filterCliente, filterTecnico, filterMarca, filterDesde, filterAte, clientMap, techMap])

  const grouped = useMemo(() => {
    return STATUS_LIST.reduce<Record<StatusCode, Equipamento[]>>(
      (acc, { code }) => {
        acc[code] = filteredEquipamentos.filter(e => e.status.status === code)
        return acc
      },
      {} as any
    )
  }, [filteredEquipamentos])

  // ---------------- Drag & Drop ----------------
  const onDragEnd = (res: DropResult) => {
    const { source, destination, draggableId } = res
    if (!destination || destination.droppableId === source.droppableId) return

    const equipId  = Number(draggableId)
    let newStatus  = destination.droppableId as StatusCode
    newStatus = enforceRules(equipId, newStatus)

    setEquipamentos(prev =>
      prev.map(e =>
        e.id === equipId ? { ...e, status: { ...e.status, status: newStatus } } : e
      )
    )
    saveOverride(equipId, newStatus)

    api.patch(`/equipamentos/api/v1/${equipId}/`, { novo_status: newStatus })
      .catch((err) => {
        console.error(err)
        setEquipamentos(prev =>
          prev.map(e =>
            e.id === equipId ? { ...e, status: { ...e.status, status: (source.droppableId as StatusCode) } } : e
          )
        )
        removeOverride(equipId)
        alert(err?.response?.data?.detail || 'Falha ao atualizar status (verifique permissA?es).')
      })
  }

  // ---------------- Clique no card ----------------
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
      setViewMode('assign')          // atribuir tecnico + enviar p/ MA
      setShowViewModal(true)
      return
    }
    if (code === 'MA') {
      const orc = orcamentos.find(o => o.equipamento === eq.id) || null
      if (!orc) return
      setSelOrcamento(orc)
      setViewMode('maintenance')     // concluir manutenAA?o (vai p/ GA)
      setShowViewModal(true)
      return
    }
  }

  // ---------------- ABERTURA VIA QUERY (QR a?? Login a?? Home) ----------------
  useEffect(() => {
    const open = search.get('open')
    const orc  = search.get('orc')
    if (!open || !orc) return

    const fetchAndOpen = async (mode: 'assign' | 'maintenance') => {
      try {
        const r = await api.get(`/orcamentos/api/v1/${orc}/`)
        const o: Orcamento = r.data
        setSelOrcamento(o)
        setViewMode(mode)
        setShowViewModal(true)
      } catch (e) {
        console.error(e)
      } finally {
        // limpa a query para evitar reabertura em refresh
        router.replace('/Home')
      }
    }

    // abrir modal de entrega especificamente
    if (open === 'registrar_entrega') {
      ;(async () => {
        try {
          const r = await api.get(`/orcamentos/api/v1/${orc}/`)
          const o: Orcamento = r.data
          const eq = equipamentos.find(e => e.id === o.equipamento)
          if (eq) {
            setDeliveryEquip(eq)
            setShowDeliveryModal(true)
          }
        } catch (e) { console.error(e) }
        finally { router.replace('/Home') }
      })()
      return
    }

    if (open === 'atribuir_manutencao') {
      fetchAndOpen('assign')
    } else if (open === 'concluir_manutencao' || open === 'registrar_entrega') {
      fetchAndOpen('maintenance') // ajuste aqui se vocAa tiver um modo especA?fico de entrega
    }
  }, [search, router, equipamentos])

  // ---------------- Metricas topo ----------------
  const metrics = useMemo(() => {
    const total = equipamentos.length
    const counts: Record<StatusCode, number> = { EN: 0, OR: 0, MA: 0, GA: 0, SA: 0 }
    equipamentos.forEach(e => { counts[e.status.status] = (counts[e.status.status] || 0) + 1 })
    const eqWithOrc = new Set(orcamentos.map(o => o.equipamento))
    const comOrc = Array.from(eqWithOrc).length
    const semOrc = total - comOrc
    return { total, counts, comOrc, semOrc }
  }, [equipamentos, orcamentos])

  return (
    <>
      <div className="home-actions">
        <button
          type="button"
          className="btn"
          onClick={() => setShowEntradaModal(true)}
        >
          Entrada
        </button>
      </div>

      {/* Filtros topo */}
      <div className="filters-bar">
        <div className="filters-grid">
          <div className="filter">
            <label>Cliente</label>
            <select value={filterCliente} onChange={(e) => setFilterCliente(e.target.value)}>
              <option value="">Todos</option>
              {clienteOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="filter">
            <label>Tecnico</label>
            <select value={filterTecnico} onChange={(e) => setFilterTecnico(e.target.value)}>
              <option value="">Todos</option>
              {tecnicoOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="filter">
            <label>Marca</label>
            <select value={filterMarca} onChange={(e) => setFilterMarca(e.target.value)}>
              <option value="">Todas</option>
              {marcaOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="filter">
            <label>Desde</label>
            <input type="date" value={filterDesde} onChange={(e) => setFilterDesde(e.target.value)} />
          </div>
          <div className="filter">
            <label>Ate</label>
            <input type="date" value={filterAte} onChange={(e) => setFilterAte(e.target.value)} />
          </div>

          <div className="filter actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => { setFilterCliente(''); setFilterTecnico(''); setFilterMarca(''); setFilterDesde(''); setFilterAte('') }}
            >
              Limpar
            </button>
            <button type="button" className="btn ghost">Aplicar</button>
          </div>
        </div>
      </div>

      {/* Resumo topo */}
      <div className="kanban-header">
        <div className="summary-cards">
          <div className="summary-card info">
            <div className="sc-title">Total de Equipamentos</div>
            <div className="sc-value">{metrics.total}</div>
          </div>
          <div className="summary-card en">
            <div className="sc-title">Entrada</div>
            <div className="sc-value">{metrics.counts.EN}</div>
          </div>
          <div className="summary-card or">
            <div className="sc-title">Orcamento</div>
            <div className="sc-value">{metrics.counts.OR}</div>
          </div>
          <div className="summary-card ma">
            <div className="sc-title">Manutencao</div>
            <div className="sc-value">{metrics.counts.MA}</div>
          </div>
          <div className="summary-card ga">
            <div className="sc-title">Entrega</div>
            <div className="sc-value">{metrics.counts.GA}</div>
          </div>
          <div className="summary-card sa">
            <div className="sc-title">Saida</div>
            <div className="sc-value">{metrics.counts.SA}</div>
          </div>
        </div>
      </div>

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
                  <h2 className="column-header"><span className="ch-title">{label}</span><span className="ch-count">{grouped[code].length}</span></h2>
                  <div className={`column-body ${snapDrop.isDraggingOver ? 'dragging-over' : ''}`}>
                    {grouped[code].length === 0 && (
                      <div className="column-empty">Nenhum item nesta etapa</div>
                    )}
                    {grouped[code].map((eq, idx) => (
                      <Draggable key={eq.id.toString()} draggableId={eq.id.toString()} index={idx}>
                        {(provDrag, snapDrag) => (
                          <div
                            ref={provDrag.innerRef}
                            {...provDrag.draggableProps}
                            {...provDrag.dragHandleProps}
                            className={`kanban-card status-${(code as string).toLowerCase()} ${snapDrag.isDragging ? 'dragging' : ''}`}
                            onClick={() => onCardClick2(code as StatusCode, eq)}
                          >
                            <h3 className="card-title">{eq.equipamento}</h3>
                            <p className="card-client">
                              Cliente: {clientMap.get(eq.cliente) ?? 'N/A'}
                            </p>
                            <p className="card-date">
                              Entrada:{' '}
                              {eq.status.date_entrada
                                ? new Date(eq.status.date_entrada!).toLocaleDateString()
                                : 'N/A'}
                            </p>
                            <p className="card-series">Serie: {eq.nun_serie}</p>
                            <div className="card-tags">
                              {eq.marca && <span className="tag">{eq.marca}</span>}
                              {eq.modelo && <span className="tag">{eq.modelo}</span>}
                              {eq.cor && <span className="tag mute">{eq.cor}</span>}
                              {!orcamentos.some(o => o.equipamento === eq.id) && (
                                <span className="tag alert">Sem orcamento</span>
                              )}
                              {eq.status.date_entrada && (
                                <span className="tag time">
                                  {(() => {
                                    const d = new Date(eq.status.date_entrada)
                                    const now = new Date()
                                    const ms = now.getTime() - d.getTime()
                                    const days = Math.floor(ms / 86400000)
                                    const hours = Math.floor((ms % 86400000) / 3600000)
                                    return days > 0 ? `${days}d ${hours}h` : `${hours}h`
                                  })()}
                                </span>
                              )}
                            </div>
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

      {showEntradaModal && (
        <ModalEntradaEquipamento
          onClose={() => setShowEntradaModal(false)}
          equipamentos={equipamentos}
          clientes={clientes}
          setEquipamentos={setEquipamentos}
          setClientes={setClientes}
          onAfterStatusChange={(id, status) => saveOverride(id, status)}
        />
      )}

      {/* Modal: Novo OrAamento (EN) */}
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
            // intercepta para tambem gravar no LS quando virar OR
            setEquipamentos(prev => {
              const next = typeof updater === 'function' ? (updater as (prev: Equipamento[]) => Equipamento[])(prev) : updater
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
                const next = typeof updater === 'function' ? (updater as (prev: Equipamento[]) => Equipamento[])(prev) : updater
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

      {/* Modal: Entrega (GA) */}
      {showDeliveryModal && deliveryEquip && (() => {
        const cli = clientes.find(c => c.id === deliveryEquip.cliente)
        if (!cli) return null
        const orcs = orcamentos.filter(o => o.equipamento === deliveryEquip.id)
        const lastOrc = orcs.sort((a, b) => a.id - b.id)[orcs.length - 1] || null
        return (
          <ModalEntrega
            mode="delivery"
            equipamento={deliveryEquip}
            cliente={cli}
            orcamento={lastOrc}
            servicos={servicos}
            produtos={produtos}
            funcionarios={funcionarios}
            onClose={() => { setShowDeliveryModal(false); setDeliveryEquip(null) }}
            setEquipamentos={(updater) => {
              setEquipamentos(prev => {
                const next = typeof updater === 'function' ? (updater as (prev: Equipamento[]) => Equipamento[])(prev) : updater
                next.forEach(e => { if (e.status.status === 'SA') saveOverride(e.id, 'SA') })
                return next
              })
            }}
            onAfterSetSaida={(id) => saveOverride(id, 'SA')}
          />
        )
      })()}

      {/* Modal: RelatA?rio (SA) */}
      {showReportModal && reportEquip && (() => {
        const cli = clientes.find(c => c.id === reportEquip.cliente)
        if (!cli) return null
        const orcs = orcamentos.filter(o => o.equipamento === reportEquip.id)
        const lastOrc = orcs.sort((a, b) => a.id - b.id)[orcs.length - 1] || null
        return (
          <ModalEntrega
            mode="report"
            equipamento={reportEquip}
            cliente={cli}
            orcamento={lastOrc}
            servicos={servicos}
            produtos={produtos}
            funcionarios={funcionarios}
            onClose={() => { setShowReportModal(false); setReportEquip(null) }}
          />
        )
      })()}
    </>
  )
}














