'use client';
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
require("@/styles/layout.css");
var navigation_1 = require("next/navigation");
function Sidebar() {
    var pathname = navigation_1.usePathname();
    var links = [
        { href: '/', label: '🏠 Home' },
        { href: '/Clientes', label: '👤 Clientes' },
        { href: '/Equipamentos', label: '🧰 Equipamentos' },
        { href: '/Orcamentos', label: '💰 Orçamentos' },
        { href: '/Funcionarios', label: '👔 Funcionarios' },
        { href: '/Servicos', label: '🛠️ Servicos' },
        { href: '/Produtos', label: '📦 Produtos' },
        { href: '/Fornecedores', label: '🏭 Fornecedores' },
    ];
    return (React.createElement("aside", { className: "sidebar-hover" },
        React.createElement("div", { className: "sidebar-header" }, "\uD83D\uDCCA"),
        React.createElement("nav", { className: "nav-links" }, links.map(function (_a) {
            var href = _a.href, label = _a.label;
            return (React.createElement(link_1["default"], { key: href, href: href, className: "nav-item " + (pathname === href ? 'active' : '') },
                React.createElement("span", null, label)));
        }))));
}
exports["default"] = Sidebar;
