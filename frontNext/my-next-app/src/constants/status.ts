// src/constants/status.ts


export const STATUS_LIST = [
  { code: 'EN', label: 'Entrada'      },
  { code: 'OR', label: 'Orçamento'    },
  { code: 'MA', label: 'Manutenção'   },
  { code: 'GA', label: 'Entrega'      },
  { code: 'SA', label: 'Saída'        },
] as const

export type StatusCode = typeof STATUS_LIST[number]['code']