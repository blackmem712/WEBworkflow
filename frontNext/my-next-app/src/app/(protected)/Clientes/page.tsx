'use client'

import { useState, useEffect } from 'react'
import { Cliente } from '@/types/cliente/cliente'
import TabelaClientes from '@/components/TabelaClientes'
import ModalCliente from '@/components/ModalCliente'
import ModalNovoCliente from '@/components/ModalNovoCliente'
import { ClientsIcon } from '@/components/icons'
import { PageTitle } from '@/components/PageTitle'


export default function ClientesPage() {
  const [clientes, setClientes]             = useState<Cliente[]>([])
  const [clienteSelecionado, setClienteSel] = useState<Cliente | null>(null)
  const [showNovo, setShowNovo]             = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/pessoas/api/v1/')
      .then(res => res.json())
      .then(data => setClientes(data))
  }, [])

  return (
    <div className="clientes-page">
      <div className="clientes-header">
        <PageTitle icon={<ClientsIcon size={28} />}>Clientes</PageTitle>
      </div>

      <TabelaClientes
        clientes={clientes}
        onSelecionar={setClienteSel}
        onNovo={() => setShowNovo(true)}
      />

      {clienteSelecionado && (
        <ModalCliente
          cliente={clienteSelecionado}
          onClose={() => setClienteSel(null)}
          setClientes={setClientes}
        />
      )}

      {showNovo && (
        <ModalNovoCliente
          onClose={() => setShowNovo(false)}
          setClientes={setClientes}
        />
      )}
    </div>
  )
}
