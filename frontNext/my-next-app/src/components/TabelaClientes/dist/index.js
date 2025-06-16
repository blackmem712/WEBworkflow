'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("@/styles/components/tabelaClientes.css");
var buton_1 = require("@/components/buton");
function TabelaClientes(_a) {
    var clientes = _a.clientes, onSelecionar = _a.onSelecionar, onNovo = _a.onNovo;
    var _b = react_1.useState(''), filtro = _b[0], setFiltro = _b[1];
    var filtrados = clientes.filter(function (c) {
        var _a, _b;
        return ((_a = c.nome) !== null && _a !== void 0 ? _a : '').toLowerCase().includes(filtro.toLowerCase()) ||
            ((_b = c.email) !== null && _b !== void 0 ? _b : '').toLowerCase().includes(filtro.toLowerCase());
    });
    return (React.createElement("div", { className: "tabela-container" },
        React.createElement("h2", null, "Clientes cadastrados"),
        React.createElement("div", { className: "tabela-controls" },
            React.createElement("input", { type: "text", placeholder: "Buscar por nome ou email...", value: filtro, onChange: function (e) { return setFiltro(e.target.value); }, className: "tabela-busca" }),
            React.createElement(buton_1["default"], { onClick: onNovo, variant: "primary" }, "+ Novo Cliente")),
        React.createElement("table", { className: "tabela-clientes" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Nome"),
                    React.createElement("th", null, "Email"),
                    React.createElement("th", null, "Telefone"),
                    React.createElement("th", null, "Cidade"))),
            React.createElement("tbody", null, filtrados.map(function (cliente) { return (React.createElement("tr", { key: cliente.id, onClick: function () { return onSelecionar(cliente); }, className: "tabela-row" },
                React.createElement("td", null, cliente.nome),
                React.createElement("td", null, cliente.email),
                React.createElement("td", null, cliente.telefone),
                React.createElement("td", null, cliente.cidade + " - " + cliente.estado))); })))));
}
exports["default"] = TabelaClientes;
