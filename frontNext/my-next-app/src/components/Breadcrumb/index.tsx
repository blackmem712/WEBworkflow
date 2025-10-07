'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '@/styles/components/breadcrumb.css'

const LABEL_MAP: Record<string, string> = {
  home: 'Home',
  equipamentos: 'Equipamentos',
  clientes: 'Clientes',
  funcionarios: 'Funcionarios',
  fornecedores: 'Fornecedores',
  orcamentos: 'Orcamentos',
  servicos: 'Servicos',
  qr: 'QR',
  login: 'Login',
}

function toTitle(slug: string) {
  const normalized = slug.replace(/[-_]/g, ' ')
  return normalized.replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function Breadcrumb() {
  const pathname = usePathname() || '/'
  const segments = pathname.split('/').filter(Boolean)

  const crumbs = [
    { label: 'Inicio', href: '/' },
    ...segments.map((segment, idx) => {
      const key = decodeURIComponent(segment)
      const href = '/' + segments.slice(0, idx + 1).join('/')
      const label = LABEL_MAP[key.toLowerCase()] ?? toTitle(key)
      return { label, href }
    })
  ]

  return (
    <nav className="breadcrumb" aria-label="Navegacao">
      <ul>
        {crumbs.map((crumb, i) => (
          <li key={crumb.href}>
            {i > 0 && <span className="sep">/</span>}
            {i < crumbs.length - 1 ? (
              <Link href={crumb.href} className="crumb-link">
                {crumb.label}
              </Link>
            ) : (
              <span className="crumb-current">{crumb.label}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
