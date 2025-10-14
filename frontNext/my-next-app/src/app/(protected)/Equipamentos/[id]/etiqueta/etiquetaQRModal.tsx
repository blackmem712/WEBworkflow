'use client'
import { useEffect, useMemo } from 'react'
import QRCode from 'react-qr-code'
import css from './EtiquetaQRModal.module.css'

export type EtiquetaData = {
  id: number
  qr_slug: string
  equipamento?: string | null
}

type Props = {
  open: boolean
  onClose: () => void
  data: EtiquetaData | null
  autoPrint?: boolean  // coloque true se quiser abrir a janela de impressao automaticamente
}

export default function EtiquetaQRModal({ open, onClose, data, autoPrint = false }: Props) {
  const base = "http://localhost:3000"
  const qrUrl = useMemo(() => (data ? `${base}/qr/${data.qr_slug}` : ''), [base, data])

  useEffect(() => {
    if (open && autoPrint) {
      const t = setTimeout(() => window.print(), 300)
      return () => clearTimeout(t)
    }
  }, [open, autoPrint])

  if (!open || !data) return null

  return (
    <div className={css.backdrop} role="dialog" aria-modal="true">
      <div className={css.modal}>
        <header className={css.header}>
          <h3>Imprimir QR - Equipamento #{data.id}</h3>
          <button className={css.x} onClick={onClose} aria-label="Fechar">x</button>
        </header>

        {/* Area imprimivel */}
        <div className={`${css.label} ${css.printArea}`}>
          <div className={css.qrBox}>
            <QRCode value={qrUrl} size={180} />
          </div>
          <div className={css.info}>
            <strong className={css.eqName} title={data.equipamento || ''}>
              {data.equipamento || 'Sem nome'}
            </strong>
            <small className={css.url}>{qrUrl}</small>
            <small className={css.hint}>Escaneie para ver o status</small>
          </div>
        </div>

        <footer className={css.actions}>
          <button onClick={() => window.print()} className={css.btnPrimary}>Imprimir</button>
          <button onClick={() => navigator.clipboard?.writeText(qrUrl)} className={css.btnGhost}>Copiar link</button>
          <button onClick={onClose} className={css.btnGhost}>Fechar</button>
        </footer>
      </div>
    </div>
  )
}
