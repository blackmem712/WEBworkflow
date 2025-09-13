// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que exigem login
const PROTECTED = [
  '/Home',                // A home verdadeira é "/"
  '/Clientes',
  '/Equipamentos',
  '/Fornecedores',
  '/Funcionarios',
  '/Orcamentos',
  '/Produtos',
  '/Servicos',
]

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  //liberar leitura pública do QR
  if (pathname.startsWith("/qr/")) return NextResponse.next()
  const hasAuth = req.cookies.get('auth')?.value === '1'
  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'))

  // Já logado em /login -> manda pra HOME "/"
  if (pathname === '/login' && hasAuth) {
    const url = req.nextUrl.clone()
    url.pathname = '/Home'  // Redireciona para a home protegida
    return NextResponse.redirect(url)
  }

  // Rota protegida sem login => manda para /login?next=...
  if (isProtected && !hasAuth) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/', '/login',
    '/Clientes/:path*', '/Equipamentos/:path*', '/Fornecedores/:path*',
    '/Funcionarios/:path*', '/Orcamentos/:path*', '/Produtos/:path*', '/Servicos/:path*',
  ],
}
