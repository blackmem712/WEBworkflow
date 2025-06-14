import Sidebar from '@/components/Sidebar'

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo à Home</h1>
        <p className="text-gray-700">
          Aqui vai o conteúdo principal da sua página. Você pode adicionar cards,
          gráficos, listas ou qualquer outro componente React.
        </p>
      </main>
    </div>
  )
}
