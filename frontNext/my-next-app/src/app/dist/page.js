'use client';
"use strict";
exports.__esModule = true;
var Sidebar_1 = require("@/components/Sidebar");
var link_1 = require("next/link");
require("./home.css");
function HomePage() {
    return (React.createElement("div", { className: "home-container" },
        React.createElement(Sidebar_1["default"], null),
        React.createElement("main", { className: "home-main" },
            React.createElement("h1", { className: "home-title" }, "Bem-vindo \uD83D\uDC4B"),
            React.createElement("p", { className: "home-subtitle" }, "Gerencie seus clientes, equipamentos e or\u00E7amentos de forma r\u00E1pida e eficiente."),
            React.createElement("div", { className: "home-cards" },
                React.createElement(link_1["default"], { href: "/clientes", className: "home-card" },
                    React.createElement("h2", null, "\uD83D\uDC64 Clientes"),
                    React.createElement("p", null, "Gerencie os cadastros dos seus clientes.")),
                React.createElement(link_1["default"], { href: "/equipamentos", className: "home-card" },
                    React.createElement("h2", null, "\uD83E\uDDF0 Equipamentos"),
                    React.createElement("p", null, "Veja os equipamentos cadastrados e seus status.")),
                React.createElement(link_1["default"], { href: "/orcamentos", className: "home-card" },
                    React.createElement("h2", null, "\uD83D\uDCB0 Or\u00E7amentos"),
                    React.createElement("p", null, "Crie e acompanhe or\u00E7amentos com facilidade."))))));
}
exports["default"] = HomePage;
