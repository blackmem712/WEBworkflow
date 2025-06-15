
// app/layout.tsx
import Sidebar from '@/components/Sidebar';
import '@/styles/layout.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      
      <body>
      
        <div className="layout">
           
          <main className="content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
