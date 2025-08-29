// src/app/fornecedores/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Fornecedor } from '@/types/fornecedor/fornecedor'
import { Produto }    from '@/types/produto/produto'
import TabelaFornecedores   from '@/components/TabelaFornecedor'
import ModalFornecedor      from '@/components/ModalFornecedor'
import ModalNovoFornecedor  from '@/components/ModalNovoFornecedor'
import '@/styles/fornecedores.css'

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [produtos, setProdutos]         = useState<Produto[]>([])
  const [selForn, setSelForn]           = useState<Fornecedor | null>(null)
  const [showNovo, setShowNovo]         = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/fornecedores/api/v1/')
      .then(r => r.json())
      .then((data: Fornecedor[]) => setFornecedores(data))
      .catch(console.error)

    fetch('http://127.0.0.1:8000/produtos/api/v1/')
      .then(r => r.json())
      .then((data: Produto[]) => setProdutos(data))
      .catch(console.error)
  }, [])

  return (
    <div className="forn-page">
      <div className="forn-header">
        <h1>🏭 Fornecedores</h1>
      </div>

      <TabelaFornecedores
        fornecedores={fornecedores}
        produtos={produtos}
        onSelecionar={setSelForn}
        onNovo={() => setShowNovo(true)}
      />

      {selForn && (
        <ModalFornecedor
          fornecedor={selForn}
          produtos={produtos}
          onClose={() => setSelForn(null)}
          setFornecedores={setFornecedores}
        />
      )}

      {showNovo && (
        <ModalNovoFornecedor
          produtos={produtos}
          onClose={() => setShowNovo(false)}
          setFornecedores={setFornecedores}
        />
      )}
    </div>
  )
}
