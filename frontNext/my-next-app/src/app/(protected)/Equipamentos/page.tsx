'use client'

import { useState, useEffect } from 'react'
import { Equipamento } from '@/types/equipamento/equipamento'
import { Cliente } from '@/types/cliente/cliente'
import TabelaEquipamentos from '@/components/TabelaEquipamentos/index'
import ModalEquipamento from '@/components/ModalEquipamento/index'
import ModalNovoEquipamento from '@/components/ModalNovoEquipamento/index'
import { EquipmentIcon } from '@/components/icons'
import { PageTitle } from '@/components/PageTitle'
import '@/styles/equipamentos.css'

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [clientes, setClientes]         = useState<Cliente[]>([])
  const [selEquip, setSelEquip]         = useState<Equipamento | null>(null)
  const [showNovo, setShowNovo]         = useState(false)

  // Fetch equipamentos
  useEffect(() => {
    fetch('http://127.0.0.1:8000/equipamentos/api/v1/')
      .then(r => r.json())
      .then((data: Equipamento[]) => setEquipamentos(data))
      .catch(console.error)
  }, [])

  // Fetch clientes (para select)
  useEffect(() => {
    fetch('http://127.0.0.1:8000/pessoas/api/v1/')
      .then(r => r.json())
      .then((data: Cliente[]) => setClientes(data))
      .catch(console.error)
  }, [])

  return (
    <div className="equip-page">
      <div className="equip-header">
        <PageTitle icon={<EquipmentIcon size={28} />}>Equipamentos</PageTitle>
      </div>

      <TabelaEquipamentos
        equipamentos={equipamentos}
        clientes={clientes}
        onSelecionar={setSelEquip}
        onNovo={() => setShowNovo(true)}
      />

      {selEquip && (
        <ModalEquipamento
          equipamento={selEquip}
          clientes={clientes}
          onClose={() => setSelEquip(null)}
          setEquipamentos={setEquipamentos}
          setClientes={setClientes}
        />
      )}

      {showNovo && (
        <ModalNovoEquipamento
          onClose={() => setShowNovo(false)}
          setEquipamentos={setEquipamentos}
          clientes={clientes}
          setClientes={setClientes}
        />
      )}
    </div>
  )
}
