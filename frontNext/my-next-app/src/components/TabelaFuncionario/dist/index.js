'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var buton_1 = require("@/components/buton");
require("@/styles/components/tabelaFuncionario.css");
var CARGO_LABELS = {
    RC: 'Recepcionista', TC: 'Técnico', GE: 'Gerente'
};
var SETOR_LABELS = {
    RE: 'Recepção', OF: 'Oficina', ES: 'Estoque'
};
function TabelaFuncionarios(_a) {
    var funcionarios = _a.funcionarios, cargos = _a.cargos, setores = _a.setores, onSelecionar = _a.onSelecionar, onNovo = _a.onNovo;
    var _b = react_1.useState(''), filtro = _b[0], setFiltro = _b[1];
    var filtrados = funcionarios.filter(function (f) {
        var _a, _b, _c, _d, _e, _f;
        return ((_a = f.nome) !== null && _a !== void 0 ? _a : '').toLowerCase().includes(filtro.toLowerCase()) ||
            ((_b = f.email) !== null && _b !== void 0 ? _b : '').toLowerCase().includes(filtro.toLowerCase()) || ((_d = CARGO_LABELS[(_c = f.cargo_funcionario.cargo) !== null && _c !== void 0 ? _c : '']) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(filtro.toLowerCase())) || ((_f = SETOR_LABELS[(_e = f.cargo_funcionario.setor) !== null && _e !== void 0 ? _e : '']) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(filtro.toLowerCase()));
    });
    return (React.createElement("div", { className: "tabela-func-container" },
        React.createElement("div", { className: "tabela-controls" },
            React.createElement("input", { type: "text", placeholder: "Buscar nome, email, cargo ou setor...", value: filtro, onChange: function (e) { return setFiltro(e.target.value); }, className: "tabela-busca" }),
            React.createElement(buton_1["default"], { onClick: onNovo, variant: "primary" }, "+ Novo Func.")),
        React.createElement("table", { className: "tabela-func" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Nome"),
                    React.createElement("th", null, "Email"),
                    React.createElement("th", null, "Telefone"),
                    React.createElement("th", null, "Cargo"),
                    React.createElement("th", null, "Setor"))),
            React.createElement("tbody", null, filtrados.map(function (f) {
                var _a, _b;
                return (React.createElement("tr", { key: f.id, onClick: function () { return onSelecionar(f); } },
                    React.createElement("td", null, f.nome),
                    React.createElement("td", null, f.email),
                    React.createElement("td", null, f.telefone),
                    React.createElement("td", null, CARGO_LABELS[(_a = f.cargo_funcionario.cargo) !== null && _a !== void 0 ? _a : '']),
                    React.createElement("td", null, SETOR_LABELS[(_b = f.cargo_funcionario.setor) !== null && _b !== void 0 ? _b : ''])));
            })))));
}
exports["default"] = TabelaFuncionarios;
