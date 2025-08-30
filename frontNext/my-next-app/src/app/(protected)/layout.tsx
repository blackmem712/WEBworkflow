// src/app/(protected)/layout.tsx
'use client'

import dynamic from 'next/dynamic'
import '@/styles/layout.css' // importa o CSS global que você mostrou

// a sua Sidebar; se ela já renderiza os links, ótimo
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-container">
      {/* wrapper com a classe que o seu CSS espera */}
      <div className="sidebar-hover">
        {/* se você tinha um header/branding dentro da sidebar, pode deixar aqui */}
        {/* <div className="sidebar-header">⚙️</div> */}
        <Sidebar />
      </div>

      {/* conteúdo SEM position: fixed, irmão da sidebar */}
      <main className="layout-content">
        {children}
      </main>
    </div>
  )
}