'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var buton_1 = require("@/components/buton");
require("@/styles/components/tabelaFuncionario.css");
var CARGO_LABELS = {
    TC: 'Técnico',
    GE: 'Gerente',
    RC: 'Recepcionista'
};
var SETOR_LABELS = {
    RE: 'Recepção',
    OF: 'Oficina',
    ES: 'Estoque'
};
function TabelaFuncionarios(_a) {
    var funcionarios = _a.funcionarios, cargos = _a.cargos, setores = _a.setores, onSelecionar = _a.onSelecionar, onNovo = _a.onNovo;
    var _b = react_1.useState(''), filtro = _b[0], setFiltro = _b[1];
    var cargoCode = function (id) { var _a; return (_a = cargos.find(function (c) { return c.id === Number(id); })) === null || _a === void 0 ? void 0 : _a.cargo; };
    var setorCode = function (id) { var _a; return (_a = setores.find(function (s) { return s.id === Number(id); })) === null || _a === void 0 ? void 0 : _a.setor; };
    var cargoLabel = function (id) {
        var code = cargoCode(id);
        return code ? CARGO_LABELS[code] : '';
    };
    var setorLabel = function (id) {
        var code = setorCode(id);
        return code ? SETOR_LABELS[code] : '';
    };
    var filtrados = funcionarios.filter(function (f) {
        var _a, _b, _c, _d, _e, _f;
        var c = cargoCode((_a = f.cargo_funcionario) === null || _a === void 0 ? void 0 : _a.cargo);
        var s = setorCode((_b = f.cargo_funcionario) === null || _b === void 0 ? void 0 : _b.setor);
        return (((_c = f.nome) !== null && _c !== void 0 ? _c : '').toLowerCase().includes(filtro.toLowerCase()) ||
            ((_d = f.email) !== null && _d !== void 0 ? _d : '').toLowerCase().includes(filtro.toLowerCase()) ||
            (c && ((_e = CARGO_LABELS[c]) === null || _e === void 0 ? void 0 : _e.toLowerCase().includes(filtro.toLowerCase()))) ||
            (s && ((_f = SETOR_LABELS[s]) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(filtro.toLowerCase()))));
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
                    React.createElement("td", null, cargoLabel((_a = f.cargo_funcionario) === null || _a === void 0 ? void 0 : _a.cargo)),
                    React.createElement("td", null, setorLabel((_b = f.cargo_funcionario) === null || _b === void 0 ? void 0 : _b.setor))));
            })))));
}
exports["default"] = TabelaFuncionarios;
