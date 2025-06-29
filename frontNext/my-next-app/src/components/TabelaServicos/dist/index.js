'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var buton_1 = require("@/components/buton");
require("@/styles/components/tabelaServicos.css");
function TabelaServicos(_a) {
    var servicos = _a.servicos, onSelecionar = _a.onSelecionar, onNovo = _a.onNovo;
    var _b = react_1.useState(''), filtro = _b[0], setFiltro = _b[1];
    var filtrados = servicos.filter(function (s) {
        return s.nome.toLowerCase().includes(filtro.toLowerCase()) ||
            s.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
            s.valor.toString().includes(filtro);
    });
    return (React.createElement("div", { className: "tabela-serv-container" },
        React.createElement("div", { className: "tabela-controls" },
            React.createElement("input", { type: "text", placeholder: "Buscar nome, descri\u00E7\u00E3o ou valor...", value: filtro, onChange: function (e) { return setFiltro(e.target.value); }, className: "tabela-busca" }),
            React.createElement(buton_1["default"], { onClick: onNovo, variant: "primary" }, "+ Novo Serv.")),
        React.createElement("table", { className: "tabela-serv" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Nome"),
                    React.createElement("th", null, "Valor (R$)"),
                    React.createElement("th", null, "Descri\u00E7\u00E3o"))),
            React.createElement("tbody", null, filtrados.map(function (s) { return (React.createElement("tr", { key: s.id, onClick: function () { return onSelecionar(s); } },
                React.createElement("td", null, s.nome),
                React.createElement("td", null, s.valor.toFixed(2)),
                React.createElement("td", null, s.descricao))); })))));
}
exports["default"] = TabelaServicos;
