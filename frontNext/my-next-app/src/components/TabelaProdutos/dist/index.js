// src/components/TabelaProdutos.tsx
'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var buton_1 = require("@/components/buton");
require("@/styles/components/tabelaProdutos.css");
function TabelaProdutos(_a) {
    var produtos = _a.produtos, onSelecionar = _a.onSelecionar, onNovo = _a.onNovo;
    var _b = react_1.useState(''), filtro = _b[0], setFiltro = _b[1];
    var filtrados = produtos.filter(function (p) {
        return p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
            p.marca.toLowerCase().includes(filtro.toLowerCase()) ||
            p.modelo.toLowerCase().includes(filtro.toLowerCase()) ||
            p.preco.toString().includes(filtro) ||
            p.descricao.toLowerCase().includes(filtro.toLowerCase());
    });
    return (React.createElement("div", { className: "tabela-prod-container" },
        React.createElement("div", { className: "tabela-controls" },
            React.createElement("input", { type: "text", placeholder: "Buscar nome, marca, modelo, pre\u00E7o ou descri\u00E7\u00E3o...", value: filtro, onChange: function (e) { return setFiltro(e.target.value); }, className: "tabela-busca" }),
            React.createElement(buton_1["default"], { onClick: onNovo, variant: "primary" }, "+ Novo Prod.")),
        React.createElement("table", { className: "tabela-prod" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Nome"),
                    React.createElement("th", null, "Marca"),
                    React.createElement("th", null, "Modelo"),
                    React.createElement("th", null, "Pre\u00E7o (R$)"),
                    React.createElement("th", null, "Descri\u00E7\u00E3o"))),
            React.createElement("tbody", null, filtrados.map(function (p) { return (React.createElement("tr", { key: p.id, onClick: function () { return onSelecionar(p); } },
                React.createElement("td", null, p.nome),
                React.createElement("td", null, p.marca),
                React.createElement("td", null, p.modelo),
                React.createElement("td", null, p.preco.toFixed(2)),
                React.createElement("td", null, p.descricao))); })))));
}
exports["default"] = TabelaProdutos;
