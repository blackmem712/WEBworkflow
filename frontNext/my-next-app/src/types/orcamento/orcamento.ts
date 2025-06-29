// src/types/orcamento.ts
export interface Orcamento {
  id: number
  observacao: string
  equipamento: number
  servico: number[]
  produto: number[]
  cargo_funcionario: number
}
