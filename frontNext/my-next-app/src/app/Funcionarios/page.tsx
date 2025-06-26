'use client'

import { useState, useEffect } from 'react'
import { Funcionario, Cargo, Setor } from '@/types/funcionario/funcionario'
import TabelaFuncionarios from '@/components/TabelaFuncionario'
import ModalFuncionario   from '@/components/ModalFuncionario'
import ModalNovoFuncionario from '@/components/ModalNovoFuncionario'
import '@/styles/funcionarios.css'


export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [cargos, setCargos]             = useState<Cargo[]>([])
  const [setores, setSetores]           = useState<Setor[]>([])
  const [selFunc, setSelFunc]           = useState<Funcionario | null>(null)
  const [showNovo, setShowNovo]         = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/funcionarios/api/v1/')
      .then(r => r.json())
      .then((data: Funcionario[]) => setFuncionarios(data))
      .catch(console.error)

    fetch('http://127.0.0.1:8000/cargos/api/v1/')
      .then(r => r.json())
      .then((data: Cargo[]) => setCargos(data))
      .catch(console.error)

    fetch('http://127.0.0.1:8000/setores/api/v1/')
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