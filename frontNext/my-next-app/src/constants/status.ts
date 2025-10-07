// src/constants/status.ts


export const STATUS_LIST = [
  { code: 'EN', label: 'Entrada'      },
  { code: 'OR', label: 'Orcamento'    },
  { code: 'MA', label: 'Manutencao'   },
  { code: 'GA', label: 'Entrega'      },
  { code: 'SA', label: 'Saida'        },
] as const

export type StatusCode = typeof STATUS_LIST[number]['code']
