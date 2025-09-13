"use strict";
exports.__esModule = true;
exports.config = exports.middleware = void 0;
// middleware.ts
var server_1 = require("next/server");
// Rotas que exigem login
var PROTECTED = [
    '/Home',
    '/Clientes',
    '/Equipamentos',
    '/Fornecedores',
    '/Funcionarios',
    '/Orcamentos',
    '/Produtos',
    '/Servicos',
];
function middleware(req) {
    var _a;
    var _b = req.nextUrl, pathname = _b.pathname, searchParams = _b.searchParams;
    //liberar leitura pública do QR
    if (pathname.startsWith("/qr/"))
        return server_1.NextResponse.next();
    var hasAuth = ((_a = req.cookies.get('auth')) === null || _a === void 0 ? void 0 : _a.value) === '1';
    var isProtected = PROTECTED.some(function (p) { return pathname === p || pathname.startsWith(p + '/'); });
    // Já logado em /login -> manda pra HOME "/"
    if (pathname === '/login' && hasAuth) {
        var url = req.nextUrl.clone();
        url.pathname = '/Home'; // Redireciona para a home protegida
        return server_1.NextResponse.redirect(url);
    }
    // Rota protegida sem login => manda para /login?next=...
    if (isProtected && !hasAuth) {
        var url = req.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('next', pathname + (searchParams.toString() ? "?" + searchParams.toString() : ''));
        return server_1.NextResponse.redirect(url);
    }
    return server_1.NextResponse.next();
}
exports.middleware = middleware;
exports.config = {
    matcher: [
        '/', '/login',
        '/Clientes/:path*', '/Equipamentos/:path*', '/Fornecedores/:path*',
        '/Funcionarios/:path*', '/Orcamentos/:path*', '/Produtos/:path*', '/Servicos/:path*',
    ]
};
