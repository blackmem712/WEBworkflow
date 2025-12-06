'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { Orcamento }   from '@/types/orcamento/orcamento'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Servico }     from '@/types/servico/servico'
import { Produto }     from '@/types/produto/produto'
import { Funcionario } from '@/types/funcionario/funcionario'
import { Cliente }     from '@/types/cliente/cliente'

import TabelaOrcamentos   from '@/components/TabelaOrcamentos'
import ModalOrcamento     from '@/components/ModalOrcamento'
import ModalNovoOrcamento from '@/components/ModalNovoOrcamento'
import { PageTitle } from '@/components/PageTitle'
import { BudgetIcon } from '@/components/icons'

import '@/styles/orcamentos.css'

const API = (p: string) => `http://127.0.0.1:8000${p}`

async function fetchClientePorId(id: number): Promise<Cliente | null> {
  for (const base of ['/pessoas/api/v1', '/clientes/api/v1']) {
    try {
      const r = await fetch(API(`${base}/${id}/`))
      if (r.ok) return (await r.json()) as Cliente
    } catch {}
  }
  return null
}

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos]     = useState<Orcamento[]>([])
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [servicos, setServicos]         = useState<Servico[]>([])
  const [produtos, setProdutos]         = useState<Produto[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [clientes, setClientes]         = useState<Cliente[]>([])

  const [selOrc, setSelOrc]             = useState<Orcamento | null>(null)
  const [showNovo, setShowNovo]         = useState(false)

  // dados para o cabeçalho do modal "Novo Orçamento" quando vier do QR
  const [equipDoModal, setEquipDoModal]     = useState<Equipamento | null>(null)
  const [clienteDoModal, setClienteDoModal] = useState<Cliente | null>(null)

  const search = useSearchParams()
  const router = useRouter()

  // Carregar listas base
  useEffect(() => {
    fetch(API('/orcamentos/api/v1/'))
      .then(r => r.json())
      .then((data: Orcamento[]) => setOrcamentos(data))
      .catch(console.error)

    fetch(API('/equipamentos/api/v1/'))
      .then(r => r.json())
      .then((data: Equipamento[]) => setEquipamentos(data))
      .catch(console.error)

    fetch(API('/servicos/api/v1/'))
      .then(r => r.json())
      .then((data: Servico[]) => setServicos(data))
      .catch(console.error)

    fetch(API('/produtos/api/v1/'))
      .then(r => r.json())
      .then((data: Produto[]) => setProdutos(data))
      .catch(console.error)

    fetch(API('/funcionarios/api/v1/'))
      .then(r => r.json())
      .then((data: Funcionario[]) => setFuncionarios(data))
      .catch(console.error)

    // clientes (pessoas -> fallback clientes)
    ;(async () => {
      try {
        const r1 = await fetch(API('/pessoas/api/v1/'))
        if (r1.ok) {
          setClientes(await r1.json())
          return
        }
      } catch {}
      try {
        const r2 = await fetch(API('/clientes/api/v1/'))
        if (r2.ok) setClientes(await r2.json())
      } catch {}
    })()
  }, [])

  // Abrir "Novo Orçamento" quando vindo do QR: ?open=novo_orcamento&equip=<id>
  useEffect(() => {
    const open  = search.get('open')
    const equip = search.get('equip')
    if (open === 'novo_orcamento') {
      setShowNovo(true)

      if (equip) {
        ;(async () => {
          try {
            const re = await fetch(API(`/equipamentos/api/v1/${equip}/`))
            if (re.ok) {
              const eq: Equipamento = await re.json()
              setEquipDoModal(eq)
              if ((eq as any).cliente) {
                const cli = await fetchClientePorId((eq as any).cliente as number)
                setClienteDoModal(cli)
              }
            }
          } catch {}
        })()
      }

      // limpa a query para não reabrir ao dar refresh
      const clean = equip ? `/Orcamentos?equip=${encodeURIComponent(equip)}` : '/Orcamentos'
      router.replace(clean)
    }
  }, [search, router])

  // Abrir o MESMO modal do card de OrAamento: ?open=atribuir_manutencao&orc=<id>
  useEffect(() => {
    const open = search.get('open')
    const orc  = search.get('orc')
    if (open === 'atribuir_manutencao' && orc) {
      ;(async () => {
        try {
          const r = await fetch(API(`/orcamentos/api/v1/${orc}/`), { cache: 'no-store' })
          if (r.ok) {
            const o: Orcamento = await r.json()
            setSelOrc(o)
          }
        } finally {
          router.replace('/Orcamentos')
        }
      })()
    }
  }, [search, router])

  // Abrir modal para concluir manutenção: ?open=concluir_manutencao&orc=<id>
  useEffect(() => {
    const open = search.get('open')
    const orc  = search.get('orc')
    if (open === 'concluir_manutencao' && orc) {
      ;(async () => {
        try {
          const r = await fetch(API(`/orcamentos/api/v1/${orc}/`), { cache: 'no-store' })
          if (r.ok) setSelOrc(await r.json())
        } finally {
          router.replace('/Orcamentos')
        }
      })()
    }
  }, [search, router])

  // Abrir modal para registrar entrega: ?open=registrar_entrega&orc=<id>
  useEffect(() => {
    const open = search.get('open')
    const orc  = search.get('orc')
    if (open === 'registrar_entrega' && orc) {
      ;(async () => {
        try {
          const r = await fetch(API(`/orcamentos/api/v1/${orc}/`), { cache: 'no-store' })
          if (r.ok) setSelOrc(await r.json())
        } finally {
          router.replace('/Orcamentos')
        }
      })()
    }
  }, [search, router])

  return (
    <div className="orc-page">
      <div className="orc-header">
        <PageTitle icon={<BudgetIcon size={28} />}>Orçamentos</PageTitle>
      </div>

      <TabelaOrcamentos
        orcamentos={orcamentos}
        equipamentos={equipamentos}
        servicos={servicos}
        produtos={produtos}
        funcionarios={funcionarios}
        onSelecionar={setSelOrc}
        onNovo={() => setShowNovo(true)}
      />

      {selOrc && (
        <ModalOrcamento
          orcamento={selOrc}
          equipamentos={equipamentos}
          servicos={servicos}
          produtos={produtos}
          funcionarios={funcionarios}
          onClose={() => setSelOrc(null)}
          setOrcamentos={setOrcamentos}
        />
      )}

      {showNovo && (
        <ModalNovoOrcamento
          clientes={clientes}
          equipamentos={equipamentos}
          servicos={servicos}
          produtos={produtos}
          funcionarios={funcionarios}
          onClose={() => setShowNovo(false)}
          setOrcamentos={setOrcamentos}
          // setEquipamentos={setEquipamentos} // descomente se o modal aceitar
          initialEquip={equipDoModal ?? undefined}
          initialClienteName={clienteDoModal?.nome ?? undefined}
        />
      )}
    </div>
  )
}

