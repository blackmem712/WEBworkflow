// src/app/(protected)/layout.tsx
'use client'

import dynamic from 'next/dynamic'
import Breadcrumb from '@/components/Breadcrumb'
import '@/styles/layout.css'
import '@/styles/pages.css'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-container">
      <div className="sidebar-hover">
        <Sidebar />
      </div>
      <main className="layout-content">
        <Breadcrumb />
        {children}
      </main>
    </div>
  )
}
