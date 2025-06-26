'use client'

import { useState, useEffect } from 'react'
import { Funcionario } from '@/types/funcionario/funcionario'
import TabelaFuncionarios from '@/components/TabelaFuncionario'
import ModalFuncionario   from '@/components/ModalFuncionario'
import ModalNovoFuncionario from '@/components/ModalNovoFuncionario'
import '@/styles/funcionarios.css'

interface Cargo {
  id: number
  cargo: string    // 'RC','TC','GE'
}

interface Setor {
  id: number
  setor: string    // 'RE','OF','ES'
}

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [cargos, setCargos]             = useState<Cargo[]>([])
  const [setores, setSetores]           = useState<Setor[]>([])
  const [selFunc, setSelFunc]           = useState<Funcionario | null>(null)
  const [showNovo, setShowNovo]         = useState(false)

  useEffect(() => {
    fetch('/funcionarios/api/v1/')
      .then(r => r.json())
      .then((data: Funcionario[]) => setFuncionarios(data))
      .catch(console.error)

    fetch('/cargos/api/v1/')
      .then(r => r.json())
      .then((data: Cargo[]) => setCargos(data))
      .catch(console.error)

    fetch('/setores/api/v1/')
      .then(r => r.json())
      .then((data: Setor[]) => setSetores(data))
      .catch(console.error)
  }, [])

  return (
    <div className="func-page">
      <div className="func-header">
        <h1>👔 Funcionários</h1>
      </div>

      <TabelaFuncionarios
        funcionarios={funcionarios}
        cargos={cargos}
        setores={setores}
        onSelecionar={setSelFunc}
        onNovo={() => setShowNovo(true)}
      />

      {selFunc && (
        <ModalFuncionario
          funcionario={selFunc}
          cargos={cargos}
          setores={setores}
          onClose={() => setSelFunc(null)}
          setFuncionarios={setFuncionarios}
        />
      )}

      {showNovo && (
        <ModalNovoFuncionario
          onClose={() => setShowNovo(false)}
          setFuncionarios={setFuncionarios}
          cargos={cargos}
          setores={setores}
        />
      )}
    </div>
  )
}