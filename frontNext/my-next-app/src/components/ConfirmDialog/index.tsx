'use client'

import { useEffect } from 'react'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'info',
}: ConfirmDialogProps) {
  useEffect(() => {
    if (open) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel()
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.body}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonCancel}`}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonConfirm} ${styles[variant]}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

