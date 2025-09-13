"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Head from "next/head"
import styles from "./styles.module.css"
import { api } from "@/services/api"

type StatusCode = "EN" | "OR" | "MA" | "GA" | "SA" | null
type QRData = { equipamento_id: number; equipamento: string | null; status: StatusCode; status_label: string | null }
const ADVANCEABLE: StatusCode[] = ["OR","MA","GA"] // adicione "EN" se liberar EN→OR

export default function QRSlugPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const [data, setData] = useState<QRData | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [posting, setPosting] = useState(false)

  async function load() {
    setErr(null); setMsg(null); setLoading(true)
    try { const r = await api.get(`/q/${slug}/`); setData(r.data as QRData) }
    catch (e: any) { setErr(e?.response?.data?.detail ?? "QR inválido ou indisponível.") }
    finally { setLoading(false) }
  }

  async function avancar() {
    if (!data) return
    setPosting(true); setErr(null); setMsg(null)
    try {
      const r = await api.post(`/q/${slug}/`)
      if (r.data?.ok) { setMsg("Status avançado com sucesso."); await load() }
      else setErr("Não foi possível avançar o status.")
    } catch (e: any) {
      if (e?.response?.status === 401) { router.push(`/login?redirect=${encodeURIComponent(`/qr/${slug}`)}`); return }
      setErr(e?.response?.data?.detail ?? "Falha ao avançar o status.")
    } finally { setPosting(false) }
  }

  useEffect(() => { load() }, [slug])

  const canAdvance = useMemo(() => !!data?.status && ADVANCEABLE.includes(data.status), [data?.status])

  const Card = useMemo(() => {
    switch (data?.status) {
      case "EN": return Entrada
      case "OR": return Orcamento
      case "MA": return Manutencao
      case "GA": return ProntoGarantia
      case "SA": return ProntoEntrega
      default:   return Desconhecido
    }
  }, [data?.status])

  return (
    <>
      <Head><meta name="robots" content="noindex,nofollow" /></Head>
      <main className={styles.wrap}>
        <div className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.title}>Status do Equipamento</h1>
            {data?.equipamento && <p className={styles.sub} title={data.equipamento}>{data.equipamento}</p>}
          </header>

          {loading && <p className={styles.muted}>Carregando…</p>}
          {err && <p className={styles.err}>{err}</p>}

          {!loading && !err && data && (
            <>
              <div className={styles.statusHeader}>
                <span className={styles.badge}>{data.status ?? "-"}</span>
                <span className={styles.statusLabel}>{data.status_label ?? "Indefinido"}</span>
                <span className={styles.idMuted}>ID #{data.equipamento_id}</span>
              </div>

              <section className={styles.content}><Card /></section>

              <footer className={styles.footer}>
                <button className={styles.btnPrimary} onClick={avancar} disabled={!canAdvance || posting}
                  title={!canAdvance ? "Sem transição automática a partir deste status." : ""}>
                  {posting ? "Processando…" : "Avançar status"}
                </button>
                <button className={styles.btnGhost}
                  onClick={() => router.push(`/login?redirect=${encodeURIComponent(`/qr/${slug}`)}`)}>
                  Entrar para ações
                </button>
              </footer>

              {msg && <p className={styles.ok}>{msg}</p>}
            </>
          )}
        </div>
      </main>
    </>
  )
}

function Entrada(){return(<div><h2 className="s-en">Recebido na recepção</h2><ul className="bullets"><li>Aguardando triagem</li><li>Sem orçamento ainda</li></ul></div>)}
function Orcamento(){return(<div><h2 className="s-or">Em orçamento</h2><ul className="bullets"><li>Diagnóstico feito</li><li>Aguardando aprovação</li></ul></div>)}
function Manutencao(){return(<div><h2 className="s-ma">Em manutenção</h2><ul className="bullets"><li>Peças reservadas</li><li>Execução em andamento</li></ul></div>)}
function ProntoGarantia(){return(<div><h2 className="s-ga">Pronto (garantia/revisão)</h2><ul className="bullets"><li>Testes concluídos</li><li>Verificação final</li></ul></div>)}
function ProntoEntrega(){return(<div><h2 className="s-sa">Pronto para entrega</h2><ul className="bullets"><li>Disponível para retirada</li><li>Levar documento</li></ul></div>)}
function Desconhecido(){return(<div><h2>Status indisponível</h2><p>Não foi possível identificar o status atual.</p></div>)}
