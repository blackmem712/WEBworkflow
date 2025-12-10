'use client'

import { useState } from 'react'
import NavLink from '@/components/NavLink/NavLink'
import { clearTokens } from '@/services/api'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function AppHeader() {
  const router = useRouter()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  function handleLogout() {
    clearTokens()
    router.push('/login')
  }
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        background: '#fff',
        zIndex: 20,
      }}
    >
      <b style={{ fontSize: 18 }}>Oficina → Sistema</b>

      <nav style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
        <NavLink href="/(protected)">Início</NavLink>
        <NavLink href="/(protected)/clientes">Clientes</NavLink>
        <NavLink href="/(protected)/equipamentos">Equipamentos</NavLink>
        <NavLink href="/(protected)/funcionarios">Funcionários</NavLink>
        <NavLink href="/(protected)/servicos">Serviços</NavLink>
        <NavLink href="/(protected)/produtos">Produtos</NavLink>
        <NavLink href="/(protected)/fornecedores">Fornecedores</NavLink>
        <NavLink href="/(protected)/orcamentos">Orçamentos</NavLink>
      </nav>

      <div style={{ marginLeft: 'auto' }}>
        <button onClick={() => setShowLogoutConfirm(true)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}>
          Sair
        </button>
      </div>

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
    </header>
  )
}

