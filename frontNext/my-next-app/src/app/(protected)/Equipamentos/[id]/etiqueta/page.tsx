
"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import styles from "./print.module.css"
import { api } from "@/services/api"

type Equip = { id:number; qr_slug:string; equipamento?:string }

export default function EtiquetaPage(){
  const { id } = useParams() as { id:string }
  const [eq, setEq] = useState<Equip | null>(null)

  useEffect(() => { (async () => {
    const { data } = await api.get(`/equipamentos/api/v1/${id}/`)
    setEq({ id:data.id, qr_slug:data.qr_slug, equipamento:data.equipamento })
  })() }, [id])

  if(!eq) return <div className={styles.page}>Carregando...</div>

  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/,"")
  const publicUrl = `${base}/qr/${eq.qr_slug}`

  return (
    <div className={styles.page}>
      <div className={styles.label}>
        <div className={styles.qr}><QRCode value={publicUrl} size={180} /></div>
        <div className={styles.txt}>
          <strong>Equipamento #{eq.id}</strong>
          <span className={styles.eqName} title={eq.equipamento || ""}>{eq.equipamento || "Sem nome"}</span>
          <small>{publicUrl}</small>
        </div>
      </div>
      <div className={styles.actions}><button onClick={() => window.print()}>Imprimir</button></div>
    </div>
  )
}
