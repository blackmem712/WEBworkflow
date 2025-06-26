export interface CargoFuncionario {
  cargo: string | null
  setor: string | null
}

export interface Funcionario {
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
  cargo_funcionario: CargoFuncionario
}

/** Novo tipo para formular */
export type FuncionarioForm = Omit<Funcionario, 'cargo_funcionario'> & {
  cargo: string | null
  setor: string | null
}
