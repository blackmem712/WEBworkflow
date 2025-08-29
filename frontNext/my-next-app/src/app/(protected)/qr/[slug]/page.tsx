'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/services/api'

type QRResp = {
  equipamento_id: number
  equipamento: string | null
  status: 'EN' | 'OR' | 'MA' | 'GA' | 'SA' | null
  status_label: string | null
}

export default function QRPage() {
  const params = useParams() as { slug: string }
  const [data, setData] = useState<QRResp | null>(null)
  const [msg, setMsg]   = useState<string | null>(null)
  const [err, setErr]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    setErr(null)
    try {
      const resp = await api.get(`/q/${params.slug}/`)
      setData(resp.data)
    } catch (e: any) {
      setErr(e?.response?.data?.detail || 'Falha ao carregar QR')
    }
  }

  useEffect(() => { load() }, [params.slug])

  async function avancar() {
    setMsg(null); setErr(null); setLoading(true)
    try {
      const resp = await api.post(`/q/${params.slug}/`)
      setMsg(`Avançou de ${resp.data.from} → ${resp.data.to}`)
      await load()
    } catch (e: any) {
      const status = e?.response?.status
      const detail = e?.response?.data?.detail
      if (status === 401) setErr('Faça login para avançar o status.')
      else if (status === 403) setErr('Você não tem permissão para esta transição.')
      else setErr(detail || 'Não foi possível avançar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
      <h1>QR • Equipamento</h1>
      {!data && !err && <div>Carregando...</div>}
      {err && <div style={{ color: 'crimson' }}>{err}</div>}
      {data && (
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
          <p><b>ID:</b> {data.equipamento_id}</p>
          <p><b>Equipamento:</b> {data.equipamento || '-'}</p>
          <p><b>Status atual:</b> {data.status} {data.status_label ? `(${data.status_label})` : ''}</p>

          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button onClick={avancar} disabled={loading}>
              {loading ? 'Avançando...' : 'Avançar'}
            </button>
            <a href="/login">Entrar</a>
          </div>
          {msg && <div style={{ marginTop: 12, color: 'seagreen' }}>{msg}</div>}
        </div>
      )}
    </div>
  )
}
