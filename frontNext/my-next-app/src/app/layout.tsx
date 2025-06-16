
// app/layout.tsx
// app/layout.tsx
import Sidebar from '@/components/Sidebar';
import '@/styles/layout.css';
import Breadcrumb from '@/components/Breadcrumb'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <div className="layout-container">
          <Sidebar />
          <main className="layout-content">
            <Breadcrumb />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
