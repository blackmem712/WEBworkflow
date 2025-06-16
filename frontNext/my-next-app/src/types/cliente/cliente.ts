// src/types/cliente.ts
export interface Cliente {
  id: number
  nome: string | null
  cpf: string | null
  email: string | null
  cep: number | null
  rua: string | null
  numero: number | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  telefone: string | null
}
