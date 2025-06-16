'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '@/styles/components/breadcrumb.css'

export default function Breadcrumb() {
  const pathname = usePathname() || '/'
  const segments = pathname.split('/').filter(Boolean)

  // Monta crumbs: Home sempre, depois cada segmento
  const crumbs = [
    { label: 'Home', href: '/' },
    ...segments.map((seg, idx) => {
      const href = '/' + segments.slice(0, idx + 1).join('/')
      const label = seg.charAt(0).toUpperCase() + seg.slice(1)
      return { label, href }
    })
  ]

  return (
    <nav className="breadcrumb">
      <ul>
        {crumbs.map((crumb, i) => (
          <li key={i}>
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
