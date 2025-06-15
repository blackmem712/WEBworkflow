'use client'

import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import './home.css'

export default function HomePage() {
  return (
    <div className="home-container">
      <Sidebar />
      <main className="home-main">
        <h1 className="home-title">Bem-vindo 👋</h1>
        <p className="home-subtitle">Gerencie seus clientes, equipamentos e orçamentos de forma rápida e eficiente.</p>

        <div className="home-cards">
          <Link href="/clientes" className="home-card">
            <h2>👤 Clientes</h2>
            <p>Gerencie os cadastros dos seus clientes.</p>
          </Link>

          <Link href="/equipamentos" className="home-card">
            <h2>🧰 Equipamentos</h2>
            <p>Veja os equipamentos cadastrados e seus status.</p>
          </Link>

          <Link href="/orcamentos" className="home-card">
            <h2>💰 Orçamentos</h2>
            <p>Crie e acompanhe orçamentos com facilidade.</p>
          </Link>
        </div>
      </main>
    </div>
  )
}