'use client'

import { ReactNode, useId } from 'react'
import '@/styles/components/modal-base.css'

type ModalShellSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalShellProps {
  title?: ReactNode
  children: ReactNode
  onClose: () => void
  size?: ModalShellSize
  footer?: ReactNode
  overlayClassName?: string
  surfaceClassName?: string
  bodyClassName?: string
  footerClassName?: string
  headerContent?: ReactNode
  hideCloseButton?: boolean
  role?: 'dialog' | 'alertdialog'
}

const join = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export default function ModalShell({
  title,
  children,
  onClose,
  size = 'lg',
  footer,
  overlayClassName,
  surfaceClassName,
  bodyClassName,
  footerClassName,
  headerContent,
  hideCloseButton = false,
  role = 'dialog',
}: ModalShellProps) {
  const titleId = useId()
  const labelledBy = title ? titleId : undefined

  return (
    <div
      className={join('modal-overlay', overlayClassName)}
      role={role}
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div className={join('modal-surface', `modal-surface--${size}`, surfaceClassName)}>
        {(title || !hideCloseButton || headerContent) && (
          <header className="modal-header">
            {title && (
              <h2 id={titleId} className="modal-title">
                {title}
              </h2>
            )}
            <div className="modal-header-actions">
              {headerContent}
              {!hideCloseButton && (
                <button
                  type="button"
                  className="modal-close"
                  onClick={onClose}
                  aria-label="Fechar modal"
                >
                  <span aria-hidden="true">A-</span>
                </button>
              )}
            </div>
          </header>
        )}

        <div className={join('modal-body', bodyClassName)}>
          {children}
        </div>

        {footer && (
          <footer className={join('modal-footer', footerClassName)}>
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}

