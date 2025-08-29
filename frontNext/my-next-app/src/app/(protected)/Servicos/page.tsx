'use client'

import { useState, useEffect } from 'react'
import { Servico } from '@/types/servico/servico'
import TabelaServicos from '@/components/TabelaServicos'
import ModalServico   from '@/components/ModalServico'
import ModalNovoServico from '@/components/ModalNovoServico'
import '@/styles/servicos.css'

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [selServico, setSelServico] = useState<Servico | null>(null)
  const [showNovo, setShowNovo]     = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/servicos/api/v1/')
      .then(r => r.json())
      .then((data: Servico[]) => setServicos(data))
      .catch(console.error)
  }, [])

  return (
    <div className="serv-page">
      <div className="serv-header">
        <h1>🛠️ Serviços</h1>
      </div>

      <TabelaServicos
        servicos={servicos}
        onSelecionar={setSelServico}
        onNovo={() => setShowNovo(true)}
      />

      {selServico && (
        <ModalServico
          servico={selServico}
          onClose={() => setSelServico(null)}
          setServicos={setServicos}
        />
      )}

      {showNovo && (
        <ModalNovoServico
          onClose={() => setShowNovo(false)}
          setServicos={setServicos}
        />
      )}
    </div>
  )
}
