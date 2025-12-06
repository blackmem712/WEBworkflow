// src/app/qr/[slug]/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import '@/styles/qr.css'

type StatusCode = 'EN' | 'OR' | 'MA' | 'GA' | 'SA'

type QRPublic = {
  equipamento_id: number
  equipamento?: string | null
  cliente_nome?: string | null
  status: StatusCode | null
  status_label?: string | null
  date_entrada?: string | null
  orcamento?: {
    id: number
    tecnico?: {
      id: number | null
      nome?: string | null
      cargo?: string | null        // codigo (ex.: 'TC')
      cargo_label?: string | null  // legivel (ex.: 'Tecnico')
    } | null
    servicos?: { id: number; nome: string; valor?: number | null }[]
    produtos?: { id: number; nome: string; preco?: number | null }[]
  } | null
}

const API = (path: string) => `http://127.0.0.1:8000${path}`

const STATUS_LABEL: Record<StatusCode, string> = {
  EN: 'Recepcao',
  OR: 'Orcamento',
  MA: 'Manutencao',
  GA: 'Entrega',
  SA: 'Saida',
}

export default function QRPage() {
  const router = useRouter()
  const { slug } = useParams<{ slug: string }>() // hook novo do app router

  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [qr, setQR] = useState<QRPublic | null>(null)

  useEffect(() => {
    if (!slug) return
    let alive = true
    ;(async () => {
      try {
        const r = await fetch(API(`/q/${slug}/`), { cache: 'no-store' })
        if (!r.ok) throw new Error(`QR ${r.status}`)
        const data: QRPublic = await r.json()
        if (!alive) return
        setQR(data)
        setErr(null)
      } catch (e: any) {
        setErr(e.message || 'Falha ao carregar')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [slug])

  const statusCode: StatusCode = (qr?.status ?? 'EN') as StatusCode

  const chegadaFmt = useMemo(() => {
    const dt = qr?.date_entrada
    if (!dt) return '-'
    try {
      const d = new Date(dt)
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(d)
    } catch { return dt }
  }, [qr?.date_entrada])

  function goToLoginRedirect(destino: string) {
    if (!destino) return
    router.replace(`/login?redirect=${encodeURIComponent(destino)}`)
  }

  // CTA por status - agora MA e GA tambem vao para a Home (Kanban)
  const { ctaLabel, ctaDest, ctaEnabled } = useMemo(() => {
    if (!qr) return { ctaLabel: '', ctaDest: '', ctaEnabled: false }

    switch (statusCode) {
      case 'EN': {
        const dest = `/Orcamentos?open=novo_orcamento&equip=${encodeURIComponent(String(qr.equipamento_id))}`
        return { ctaLabel: 'Cadastrar orcamento', ctaDest: dest, ctaEnabled: !!qr.equipamento_id }
      }
      case 'OR': {
        const orcId = qr.orcamento?.id
        const dest = `/Home?open=atribuir_manutencao&orc=${encodeURIComponent(String(orcId ?? ''))}`
        return { ctaLabel: 'Atribuir manutencao', ctaDest: dest, ctaEnabled: !!orcId }
      }
      case 'MA': {
        const orcId = qr.orcamento?.id
        const dest = `/Home?open=concluir_manutencao&orc=${encodeURIComponent(String(orcId ?? ''))}`
        return { ctaLabel: 'Concluir manutencao', ctaDest: dest, ctaEnabled: !!orcId }
      }
      case 'GA': {
        const orcId = qr.orcamento?.id
        const dest = `/Home?open=registrar_entrega&orc=${encodeURIComponent(String(orcId ?? ''))}`
        return { ctaLabel: 'Registrar entrega', ctaDest: dest, ctaEnabled: !!orcId }
      }
      case 'SA':
      default:
        return { ctaLabel: '', ctaDest: '', ctaEnabled: false }
    }
  }, [qr, statusCode])

  if (loading) {
    return <div className="qr-wrap"><div className="qr-card"><p>Carregando...</p></div></div>
  }
  if (err || !qr) {
    return <div className="qr-wrap"><div className="qr-card error"><h2>Não foi possível carregar</h2><p>{err || 'Tente novamente.'}</p></div></div>
  }

  // Helper para render do tecnico com label legivel
  const tecnicoLegivel = qr.orcamento?.tecnico?.nome
    ? `${qr.orcamento.tecnico.nome}${
        qr.orcamento.tecnico.cargo_label
          ? ' - ' + qr.orcamento.tecnico.cargo_label
          : qr.orcamento.tecnico.cargo
            ? ' - ' + qr.orcamento.tecnico.cargo
            : ''
      }`
    : '-'

  return (
    <div className="qr-wrap">
      {/* Cabecalho sempre mostra o status vigente */}
      <header className="qr-header">
        <div className="qr-title">
          <span className="qr-chip">{STATUS_LABEL[statusCode]}</span>
          <h1>{qr.equipamento || 'Equipamento'}</h1>
          <p className="qr-sub">{qr.cliente_nome ? `Cliente: ${qr.cliente_nome}` : 'Cliente não informado'}</p>
        </div>
      </header>

      {/* Cartao base com dados comuns (inclui Manutencao tambem) */}
      <section className="qr-card">
        <div className="qr-row">
          <span className="qr-key">Etapa:</span>
          <span className="qr-val">{STATUS_LABEL[statusCode]}</span>
        </div>
        <div className="qr-row">
          <span className="qr-key">Data de entrada:</span>
          <span className="qr-val">{chegadaFmt}</span>
        </div>
        <div className="qr-row">
          <span className="qr-key">Cliente:</span>
          <span className="qr-val">{qr.cliente_nome || '-'}</span>
        </div>
      </section>

      {/* Resumo de orcamento - aparece em OR, MA e GA (sempre que backend mandar) */}
      {qr.orcamento && (
        <section className="qr-card">
          <div className="qr-row">
            <span className="qr-key">Tecnico</span>
            <span className="qr-val">{tecnicoLegivel}</span>
          </div>

          <div className="qr-row">
            <span className="qr-key">Servicos</span>
            <span className="qr-val">{(qr.orcamento.servicos?.length || 0)} item(ns)</span>
          </div>
          {qr.orcamento.servicos?.map(s => (
            <div key={s.id} className="qr-row" style={{ paddingLeft: 10 }}>
              <span className="qr-key">{s.nome}</span>
              <span className="qr-val">{s.valor != null ? `R$ ${Number(s.valor).toFixed(2)}` : '-'}</span>
            </div>
          ))}

          <div className="qr-row">
            <span className="qr-key">Produtos</span>
            <span className="qr-val">{(qr.orcamento.produtos?.length || 0)} item(ns)</span>
          </div>
          {qr.orcamento.produtos?.map(p => (
            <div key={p.id} className="qr-row" style={{ paddingLeft: 10 }}>
              <span className="qr-key">{p.nome}</span>
              <span className="qr-val">{p.preco != null ? `R$ ${Number(p.preco).toFixed(2)}` : '-'}</span>
            </div>
          ))}
        </section>
      )}

      {/* CTA fixo no rodape (EN / OR / MA / GA) */}
      {ctaEnabled && (
        <div className="qr-action">
          <button
            className="qr-btn primary"
            onClick={() => goToLoginRedirect(ctaDest)}
          >
            {ctaLabel}
          </button>
        </div>
      )}
    </div>
  )
}
