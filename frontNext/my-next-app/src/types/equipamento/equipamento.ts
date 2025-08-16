export type StatusCode = 'EN' | 'OR' | 'MA' | 'GA' | 'SA'

export interface StatusInfo {
  status: StatusCode
  date_entrada: string          
  date_saida: string | null
}
 

 
 // src/types/equipamento.ts
export interface Equipamento {
  id: number
  equipamento: string
  marca: string
  modelo: string
  cor: string
  nun_serie: string
  cliente: number
  status: StatusInfo
}