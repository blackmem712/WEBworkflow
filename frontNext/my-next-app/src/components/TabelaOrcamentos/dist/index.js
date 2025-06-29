'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var buton_1 = require("@/components/buton");
require("@/styles/components/tabelaOrcamentos.css");
function TabelaOrcamentos(_a) {
    var orcamentos = _a.orcamentos, equipamentos = _a.equipamentos, servicos = _a.servicos, produtos = _a.produtos, funcionarios = _a.funcionarios, onSelecionar = _a.onSelecionar, onNovo = _a.onNovo;
    var _b = react_1.useState(''), filtro = _b[0], setFiltro = _b[1];
    var eqLabel = function (id) { var _a, _b; return (_b = (_a = equipamentos.find(function (e) { return e.id === id; })) === null || _a === void 0 ? void 0 : _a.equipamento) !== null && _b !== void 0 ? _b : ''; };
    var servLabels = function (ids) {
        return servicos.filter(function (s) { return ids.includes(s.id); }).map(function (s) { return s.nome; }).join(', ');
    };
    var prodLabels = function (ids) {
        return produtos.filter(function (p) { return ids.includes(p.id); }).map(function (p) { return p.nome; }).join(', ');
    };
    var funcName = function (cfId) {
        var _a;
        var f = funcionarios.find(function (f) { var _a; return ((_a = f.cargo_funcionario) === null || _a === void 0 ? void 0 : _a.id) === cfId; });
        return (_a = f === null || f === void 0 ? void 0 : f.nome) !== null && _a !== void 0 ? _a : '';
    };
    var filtrados = orcamentos.filter(function (o) {
        return o.observacao.toLowerCase().includes(filtro.toLowerCase()) ||
            eqLabel(o.equipamento).toLowerCase().includes(filtro.toLowerCase()) ||
            servLabels(o.servico).toLowerCase().includes(filtro.toLowerCase()) ||
            prodLabels(o.produto).toLowerCase().includes(filtro.toLowerCase()) ||
            funcName(o.cargo_funcionario).toLowerCase().includes(filtro.toLowerCase());
    });
    return (React.createElement("div", { className: "tabela-orc-container" },
        React.createElement("div", { className: "tabela-controls" },
            React.createElement("input", { type: "text", placeholder: "Buscar observa\u00E7\u00E3o, equipamento, servi\u00E7o, produto ou respons\u00E1vel...", value: filtro, onChange: function (e) { return setFiltro(e.target.value); }, className: "tabela-busca" }),
            React.createElement(buton_1["default"], { onClick: onNovo, variant: "primary" }, "+ Novo Orc.")),
        React.createElement("table", { className: "tabela-orc" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Observa\u00E7\u00E3o"),
                    React.createElement("th", null, "Equipamento"),
                    React.createElement("th", null, "Servi\u00E7os"),
                    React.createElement("th", null, "Produtos"),
                    React.createElement("th", null, "Respons\u00E1vel"))),
            React.createElement("tbody", null, filtrados.map(function (o) { return (React.createElement("tr", { key: o.id, onClick: function () { return onSelecionar(o); } },
                React.createElement("td", null, o.observacao),
                React.createElement("td", null, eqLabel(o.equipamento)),
                React.createElement("td", null, servLabels(o.servico)),
                React.createElement("td", null, prodLabels(o.produto)),
                React.createElement("td", null, funcName(o.cargo_funcionario)))); })))));
}
exports["default"] = TabelaOrcamentos;
