'use client'

import AuthGuard from '@/components/AuthGuard/AuthGuard'
import AppHeader from '@/components/AppHeader/AppHeader'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppHeader />
      <main style={{ padding: 16, maxWidth: 1200, margin: '0 auto' }}>{children}</main>
    </AuthGuard>
  )
}
