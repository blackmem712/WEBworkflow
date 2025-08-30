'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearTokens } from '@/services/api'

type Item = { href: string; label: string; icon?: string }

const items: Item[] = [
  { href: '/Home',              label: 'Início',        icon: '🏠' },
  { href: '/Clientes',      label: 'Clientes',      icon: '👤' },
  { href: '/Equipamentos',  label: 'Equipamentos',  icon: '🧰' },
  { href: '/Funcionarios',  label: 'Funcionários',  icon: '🧑‍🔧' },
  { href: '/Servicos',      label: 'Serviços',      icon: '🧾' },
  { href: '/Produtos',      label: 'Produtos',      icon: '📦' },
  { href: '/Fornecedores',  label: 'Fornecedores',  icon: '🏭' },
  { href: '/Orcamentos',    label: 'Orçamentos',    icon: '💸' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function isActive(href: string) {
    // marca ativo na rota exata (ajuste para startsWith se quiser marcar pais)
    return pathname === href
  }

  function logout() {
    // remove presença de sessão (middleware) + tokens (axios)
    document.cookie = 'auth=; path=/; max-age=0'
    clearTokens()
    router.push('/login')
  }

  return (
    <>
      {/* opcional: cabeçalho/logo da sidebar */}
      {/* <div className="sidebar-header">⚙️</div> */}

      <nav
        className="nav-links"
        style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item${isActive(item.href) ? ' active' : ''}`}
          >
            {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
            {item.label}
          </Link>
        ))}

        <div style={{ flex: 1 }} />

        <button
          type="button"
          onClick={logout}
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
          ⎋ Sair
        </button>
      </nav>
    </>
  )
}