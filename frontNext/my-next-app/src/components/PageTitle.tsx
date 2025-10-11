import { ReactNode } from 'react'

type PageTitleProps = {
  icon?: ReactNode
  children: ReactNode
}

export function PageTitle({ icon, children }: PageTitleProps) {
  return (
    <h1 className="page-title">
      {icon && (
        <span className="page-title-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </h1>
  )
}
