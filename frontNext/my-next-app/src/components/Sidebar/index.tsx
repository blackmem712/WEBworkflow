'use client'
import { useState } from 'react'
import Link from 'next/link'
import '@/styles/layout.css'
import { usePathname } from 'next/navigation'


export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: '🏠 Home' },
    { href: '/Clientes', label: '👤 Clientes' },
    { href: '/Equipamentos', label: '🧰 Equipamentos' },
    { href: '/Orcamentos', label: '💰 Orçamentos' },
    { href: '/Funcionarios', label: '👔 Funcionarios' },
    { href: '/Servicos', label: '🛠️ Servicos' },
    { href: '/Produtos', label: '📦 Produtos' },
    { href: '/Fornecedores', label: '🏭 Fornecedores' },
  ]

  return (
    <aside className="sidebar-hover">
      <div className="sidebar-header">📊</div>
      <nav className="nav-links">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-item ${pathname === href ? 'active' : ''}`}
          >
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}