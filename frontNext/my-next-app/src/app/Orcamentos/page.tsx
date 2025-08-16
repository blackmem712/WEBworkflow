'use client'

import { useState, useEffect } from 'react'

import { Orcamento }      from '@/types/orcamento/orcamento'
import { Equipamento }    from '@/types/equipamento/equipamento'
import { Servico }        from '@/types/servico/servico'
import { Produto }        from '@/types/produto/produto'
import { Funcionario }    from '@/types/funcionario/funcionario'
import { Cliente }        from '@/types/cliente/cliente'
import TabelaOrcamentos   from '@/components/TabelaOrcamentos'
import ModalOrcamento     from '@/components/ModalOrcamento'
import ModalNovoOrcamento from '@/components/ModalNovoOrcamento'
import '@/styles/orcamentos.css'

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos]         = useState<Orcamento[]>([])
  const [equipamentos, setEquipamentos]     = useState<Equipamento[]>([])
  const [servicos, setServicos]             = useState<Servico[]>([])
  const [produtos, setProdutos]             = useState<Produto[]>([])
  const [funcionarios, setFuncionarios]     = useState<Funcionario[]>([])
  const [clientes, setClientes]         = useState<Cliente[]>([])
  const [selOrc, setSelOrc]                 = useState<Orcamento | null>(null)
  const [showNovo, setShowNovo]             = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/orcamentos/api/v1/')
      .then(r => r.json()).then((data: Orcamento[]) => setOrcamentos(data)).catch(console.error)
    fetch('http://127.0.0.1:8000/equipamentos/api/v1/')
      .then(r => r.json()).then((data: Equipamento[]) => setEquipamentos(data)).catch(console.error)
    fetch('http://127.0.0.1:8000/servicos/api/v1/')
      .then(r => r.json()).then((data: Servico[]) => setServicos(data)).catch(console.error)
    fetch('http://127.0.0.1:8000/produtos/api/v1/')
      .then(r => r.json()).then((data: Produto[]) => setProdutos(data)).catch(console.error)
    fetch('http://127.0.0.1:8000/funcionarios/api/v1/')
      .then(r => r.json()).then((data: Funcionario[]) => setFuncionarios(data)).catch(console.error)
  }, [])

  return (
    <div className="orc-page">
      <div className="orc-header">
        <h1>🧾 Orçamentos</h1>
      </div>

      <TabelaOrcamentos
        orcamentos={orcamentos}
        equipamentos={equipamentos}
        servicos={servicos}
        produtos={produtos}
        funcionarios={funcionarios}
        onSelecionar={setSelOrc}
        onNovo={() => setShowNovo(true)}
      />

      {selOrc && (
        <ModalOrcamento
          orcamento={selOrc}
          equipamentos={equipamentos}
          servicos={servicos}
          produtos={produtos}
          funcionarios={funcionarios}
          onClose={() => setSelOrc(null)}
          setOrcamentos={setOrcamentos}
        />
      )}

      {showNovo && (
        <ModalNovoOrcamento
          clientes={clientes} 
          equipamentos={equipamentos}
          servicos={servicos}
          produtos={produtos}
          funcionarios={funcionarios}
          onClose={() => setShowNovo(false)}
          setOrcamentos={setOrcamentos}
        />
      )}
    </div>
  )
}
