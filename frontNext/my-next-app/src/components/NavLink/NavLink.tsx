'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        textDecoration: 'none',
        background: active ? '#111' : '#f3f4f6',
        color: active ? '#fff' : '#111',
        fontWeight: active ? 600 : 500,
      }}
    >
      {children}
    </Link>
  )
}
