'use client';
"use strict";
exports.__esModule = true;
var NavLink_1 = require("@/components/NavLink/NavLink");
var api_1 = require("@/services/api");
var navigation_1 = require("next/navigation");
function AppHeader() {
    var router = navigation_1.useRouter();
    function logout() {
        api_1.clearTokens();
        router.push('/login');
    }
    return (React.createElement("header", { style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 20
        } },
        React.createElement("b", { style: { fontSize: 18 } }, "Oficina \u2022 Sistema"),
        React.createElement("nav", { style: { display: 'flex', gap: 8, marginLeft: 16 } },
            React.createElement(NavLink_1["default"], { href: "/(protected)" }, "In\u00EDcio"),
            React.createElement(NavLink_1["default"], { href: "/(protected)/clientes" }, "Clientes"),
            React.createElement(NavLink_1["default"], { href: "/(protected)/equipamentos" }, "Equipamentos"),
            React.createElement(NavLink_1["default"], { href: "/(protected)/funcionarios" }, "Funcion\u00E1rios"),
            React.createElement(NavLink_1["default"], { href: "/(protected)/servicos" }, "Servi\u00E7os"),
            React.createElement(NavLink_1["default"], { href: "/(protected)/produtos" }, "Produtos"),
            React.createElement(NavLink_1["default"], { href: "/(protected)/fornecedores" }, "Fornecedores"),
            React.createElement(NavLink_1["default"], { href: "/(protected)/orcamentos" }, "Or\u00E7amentos")),
        React.createElement("div", { style: { marginLeft: 'auto' } },
            React.createElement("button", { onClick: logout, style: { padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' } }, "Sair"))));
}
exports["default"] = AppHeader;
