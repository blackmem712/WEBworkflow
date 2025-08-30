'use client';
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var api_1 = require("@/services/api");
var items = [
    { href: '/Home', label: 'Início', icon: '🏠' },
    { href: '/Clientes', label: 'Clientes', icon: '👤' },
    { href: '/Equipamentos', label: 'Equipamentos', icon: '🧰' },
    { href: '/Funcionarios', label: 'Funcionários', icon: '🔧' },
    { href: '/Servicos', label: 'Serviços', icon: '🧾' },
    { href: '/Produtos', label: 'Produtos', icon: '📦' },
    { href: '/Fornecedores', label: 'Fornecedores', icon: '🏭' },
    { href: '/Orcamentos', label: 'Orçamentos', icon: '💸' },
];
function Sidebar() {
    var pathname = navigation_1.usePathname();
    var router = navigation_1.useRouter();
    function isActive(href) {
        // marca ativo na rota exata (ajuste para startsWith se quiser marcar pais)
        return pathname === href;
    }
    function logout() {
        // remove presença de sessão (middleware) + tokens (axios)
        document.cookie = 'auth=; path=/; max-age=0';
        api_1.clearTokens();
        router.push('/login');
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("nav", { className: "nav-links", style: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' } },
            items.map(function (item) { return (React.createElement(link_1["default"], { key: item.href, href: item.href, className: "nav-item" + (isActive(item.href) ? ' active' : '') },
                item.icon && React.createElement("span", { style: { marginRight: 8 } }, item.icon),
                item.label)); }),
            React.createElement("div", { style: { flex: 1 } }),
            React.createElement("button", { type: "button", onClick: logout, className: "nav-item logout", style: {
                    textAlign: 'left',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                }, "aria-label": "Sair", title: "Sair" }, "\u238B Sair"))));
}
exports["default"] = Sidebar;
