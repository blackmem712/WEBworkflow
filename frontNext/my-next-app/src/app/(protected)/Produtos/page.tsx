// src/app/produtos/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Produto } from '@/types/produto/produto'
import TabelaProdutos from '@/components/TabelaProdutos'
import ModalProduto   from '@/components/ModalProduto'
import ModalNovoProduto from '@/components/ModalNovoProduto'
import '@/styles/produtos.css'

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [selProd, setSelProd]   = useState<Produto | null>(null)
  const [showNovo, setShowNovo] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/produtos/api/v1/')
      .then(r => r.json())
      .then((data: Produto[]) => setProdutos(data))
      .catch(console.error)
  }, [])

  return (
    <div className="prod-page">
      <div className="prod-header">
        <h1>📦 Produtos</h1>
      </div>

      <TabelaProdutos
        produtos={produtos}
        onSelecionar={setSelProd}
        onNovo={() => setShowNovo(true)}
      />

      {selProd && (
        <ModalProduto
          produto={selProd}
          onClose={() => setSelProd(null)}
          setProdutos={setProdutos}
        />
      )}

      {showNovo && (
        <ModalNovoProduto
          onClose={() => setShowNovo(false)}
          setProdutos={setProdutos}
        />
      )}
    </div>
  )
}
