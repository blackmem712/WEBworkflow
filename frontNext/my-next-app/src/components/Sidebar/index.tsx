'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { clearTokens } from '@/services/api'
import ConfirmDialog from '@/components/ConfirmDialog'
import {
  BudgetIcon,
  ClientsIcon,
  EquipmentIcon,
  HomeIcon,
  LogoutIcon,
  ProductsIcon,
  ServicesIcon,
  SuppliersIcon,
  TeamIcon,
} from '@/components/icons'

type Item = { href: string; label: string; icon: ReactNode }

const items: Item[] = [
  { href: '/Home', label: 'Início', icon: <HomeIcon size={18} /> },
  { href: '/Clientes', label: 'Clientes', icon: <ClientsIcon size={18} /> },
  { href: '/Equipamentos', label: 'Equipamentos', icon: <EquipmentIcon size={18} /> },
  { href: '/Funcionarios', label: 'Funcionários', icon: <TeamIcon size={18} /> },
  { href: '/Servicos', label: 'Serviços', icon: <ServicesIcon size={18} /> },
  { href: '/Produtos', label: 'Produtos', icon: <ProductsIcon size={18} /> },
  { href: '/Fornecedores', label: 'Fornecedores', icon: <SuppliersIcon size={18} /> },
  { href: '/Orcamentos', label: 'Orçamentos', icon: <BudgetIcon size={18} /> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  function isActive(href: string) {
    // marca ativo na rota exata (ajuste para startsWith se quiser marcar pais)
    return pathname === href
  }

  function handleLogout() {
    // remove presença de sessão (middleware) + tokens (axios)
    document.cookie = 'auth=; path=/; max-age=0'
    clearTokens()
    router.push('/login')
  }

  return (
    <>
      <div className="sidebar-brand" aria-label="SGEE">
        <Image
          src="/images/sgee-logomark.png"
          alt="SGEE"
          width={44}
          height={44}
          className="sidebar-logo sidebar-logo--compact"
          priority
        />
        <Image
          src="/images/sgee-logo.png"
          alt="SGEE"
          width={220}
          height={70}
          className="sidebar-logo sidebar-logo--expanded"
          priority
        />
      </div>

      <nav
        className="nav-links"
        style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item${isActive(item.href) ? ' active' : ''}`}
            title={item.label}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}

        <div style={{ flex: 1 }} />

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="nav-item logout"
          style={{
            textAlign: 'left',
            width: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Sair"
          title="Sair"
        >
          <span className="nav-icon" aria-hidden="true">
            <LogoutIcon size={18} />
          </span>
          <span className="nav-label">Sair</span>
        </button>
      </nav>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Confirmar saída"
        message="Tem certeza que deseja sair do sistema?"
        confirmText="Sair"
        cancelText="Cancelar"
        variant="warning"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  )
}

