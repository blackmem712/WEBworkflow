// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = [
  '/Home',
  '/Clientes',
  '/Equipamentos',
  '/Fornecedores',
  '/Funcionarios',
  '/Orcamentos',
  '/Produtos',
  '/Servicos',
]

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const { pathname } = url

  // liberar leitura pAoblica do QR
  if (pathname.startsWith('/qr/')) return NextResponse.next()

  const hasAuth = req.cookies.get('auth')?.value === '1'
  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'))

  // jA! logado em /login -> manda pra Home (ou para redirect se existir)
  if (pathname === '/login' && hasAuth) {
    const dest = url.searchParams.get('redirect') || '/Home'
    const redir = url.clone(); redir.pathname = dest; redir.search = ''
    return NextResponse.redirect(redir)
  }

  // Rota protegida sem login => /login?redirect=<rota>
  if (isProtected && !hasAuth) {
    const redir = url.clone()
    redir.pathname = '/login'
    redir.searchParams.set('redirect', pathname + (url.search ? url.search : ''))
    return NextResponse.redirect(redir)
  }

  return NextResponse.next()
}

// Ajuste: garantir que o middleware rode em /Home tambA(c)m
export const config = {
  matcher: [
    '/', '/login', '/Home',
    '/Clientes/:path*', '/Equipamentos/:path*', '/Fornecedores/:path*',
    '/Funcionarios/:path*', '/Orcamentos/:path*', '/Produtos/:path*', '/Servicos/:path*',
    // nA?o precisa incluir /qr aqui; mas se incluir, mantA(c)m o early return acima
  ],
}

