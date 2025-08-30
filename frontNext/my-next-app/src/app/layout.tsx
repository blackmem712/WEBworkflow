// src/app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oficina',
  description: 'Sistema',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}
