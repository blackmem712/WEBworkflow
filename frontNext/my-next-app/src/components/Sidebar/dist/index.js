'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var api_1 = require("@/services/api");
var icons_1 = require("@/components/icons");
var items = [
    { href: '/Home', label: 'Início', icon: React.createElement(icons_1.HomeIcon, { size: 18 }) },
    { href: '/Clientes', label: 'Clientes', icon: React.createElement(icons_1.ClientsIcon, { size: 18 }) },
    { href: '/Equipamentos', label: 'Equipamentos', icon: React.createElement(icons_1.EquipmentIcon, { size: 18 }) },
    { href: '/Funcionarios', label: 'Funcionários', icon: React.createElement(icons_1.TeamIcon, { size: 18 }) },
    { href: '/Servicos', label: 'Serviços', icon: React.createElement(icons_1.ServicesIcon, { size: 18 }) },
    { href: '/Produtos', label: 'Produtos', icon: React.createElement(icons_1.ProductsIcon, { size: 18 }) },
    { href: '/Fornecedores', label: 'Fornecedores', icon: React.createElement(icons_1.SuppliersIcon, { size: 18 }) },
    { href: '/Orcamentos', label: 'Orçamentos', icon: React.createElement(icons_1.BudgetIcon, { size: 18 }) }
];
function Sidebar() {
    var pathname = (0, navigation_1.usePathname)();
    var router = (0, navigation_1.useRouter)();
    function isActive(href) {
        return pathname === href;
    }
    function logout() {
        document.cookie = 'auth=; path=/; max-age=0';
        (0, api_1.clearTokens)();
        router.push('/login');
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "sidebar-brand", "aria-label": "SGEE" },
            React.createElement("img", { src: "/images/sgee-logomark.png", width: 44, height: 44, className: "sidebar-logo sidebar-logo--compact", alt: "SGEE" }),
            React.createElement("img", { src: "/images/sgee-logo.png", width: 220, height: 70, className: "sidebar-logo sidebar-logo--expanded", alt: "SGEE" })),
        React.createElement("nav", { className: "nav-links", style: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' } },
            items.map(function (item) { return (React.createElement(link_1["default"], { key: item.href, href: item.href, className: "nav-item" + (isActive(item.href) ? ' active' : ''), title: item.label },
                React.createElement("span", { className: "nav-icon", "aria-hidden": "true" }, item.icon),
                React.createElement("span", { className: "nav-label" }, item.label))); }),
            React.createElement("div", { style: { flex: 1 } }),
            React.createElement("button", { type: "button", onClick: logout, className: "nav-item logout", style: {
                    textAlign: 'left',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                }, "aria-label": "Sair", title: "Sair" },
                React.createElement("span", { className: "nav-icon", "aria-hidden": "true" }, React.createElement(icons_1.LogoutIcon, { size: 18 })),
                React.createElement("span", { className: "nav-label" }, "Sair")))));
}
exports["default"] = Sidebar;
