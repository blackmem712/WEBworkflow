// src/components/TabelaFornecedores.tsx
'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var buton_1 = require("@/components/buton");
require("@/styles/components/tabelaFornecedores.css");
function TabelaFornecedores(_a) {
    var fornecedores = _a.fornecedores, produtos = _a.produtos, onSelecionar = _a.onSelecionar, onNovo = _a.onNovo;
    var _b = react_1.useState(''), filtro = _b[0], setFiltro = _b[1];
    var nomesProdutos = function (ids) {
        return produtos
            .filter(function (p) { return ids.includes(p.id); })
            .map(function (p) { return p.nome; })
            .join(', ');
    };
    var filtrados = fornecedores.filter(function (f) {
        return f.nome.toLowerCase().includes(filtro.toLowerCase()) ||
            f.cnpj.includes(filtro) ||
            f.telefone.includes(filtro) ||
            nomesProdutos(f.produtos).toLowerCase().includes(filtro.toLowerCase());
    });
    return (React.createElement("div", { className: "tabela-forn-container" },
        React.createElement("div", { className: "tabela-controls" },
            React.createElement("input", { type: "text", placeholder: "Buscar nome, CNPJ, telefone ou produtos...", value: filtro, onChange: function (e) { return setFiltro(e.target.value); }, className: "tabela-busca" }),
            React.createElement(buton_1["default"], { onClick: onNovo, variant: "primary" }, "+ Novo Forn.")),
        React.createElement("table", { className: "tabela-forn" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Nome"),
                    React.createElement("th", null, "CNPJ"),
                    React.createElement("th", null, "Telefone"),
                    React.createElement("th", null, "Produtos"))),
            React.createElement("tbody", null, filtrados.map(function (f) { return (React.createElement("tr", { key: f.id, onClick: function () { return onSelecionar(f); } },
                React.createElement("td", null, f.nome),
                React.createElement("td", null, f.cnpj),
                React.createElement("td", null, f.telefone),
                React.createElement("td", null, nomesProdutos(f.produtos)))); })))));
}
exports["default"] = TabelaFornecedores;
