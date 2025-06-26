'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var buton_1 = require("@/components/buton");
require("@/styles/components/tabelaEquipamentos.css");
function TabelaEquipamentos(_a) {
    var equipamentos = _a.equipamentos, clientes = _a.clientes, onSelecionar = _a.onSelecionar, onNovo = _a.onNovo;
    var _b = react_1.useState(''), filtro = _b[0], setFiltro = _b[1];
    var filtrados = equipamentos.filter(function (e) {
        var _a, _b;
        return e.equipamento.toLowerCase().includes(filtro.toLowerCase()) ||
            e.marca.toLowerCase().includes(filtro.toLowerCase()) ||
            ((_b = (_a = clientes.find(function (c) { return c.id === e.cliente; })) === null || _a === void 0 ? void 0 : _a.nome) !== null && _b !== void 0 ? _b : '')
                .toLowerCase()
                .includes(filtro.toLowerCase());
    });
    return (React.createElement("div", { className: "tabela-equip-container" },
        React.createElement("div", { className: "tabela-controls" },
            React.createElement("input", { type: "text", placeholder: "Buscar equipamento, marca ou cliente...", value: filtro, onChange: function (e) { return setFiltro(e.target.value); }, className: "tabela-busca" }),
            React.createElement(buton_1["default"], { onClick: onNovo, variant: "primary" }, "+ Novo Equip.")),
        React.createElement("table", { className: "tabela-equip" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Equipamento"),
                    React.createElement("th", null, "Marca"),
                    React.createElement("th", null, "Modelo"),
                    React.createElement("th", null, "Cor"),
                    React.createElement("th", null, "S\u00E9rie"),
                    React.createElement("th", null, "Cliente"),
                    React.createElement("th", null, "Entrada"),
                    React.createElement("th", null, "Status"))),
            React.createElement("tbody", null, filtrados.map(function (e) {
                var cliente = clientes.find(function (c) { return c.id === e.cliente; });
                var dtEnt = new Date(e.status.date_entrada).toLocaleDateString();
                return (React.createElement("tr", { key: e.id, onClick: function () { return onSelecionar(e); } },
                    React.createElement("td", null, e.equipamento),
                    React.createElement("td", null, e.marca),
                    React.createElement("td", null, e.modelo),
                    React.createElement("td", null, e.cor),
                    React.createElement("td", null, e.nun_serie),
                    React.createElement("td", null, cliente === null || cliente === void 0 ? void 0 : cliente.nome),
                    React.createElement("td", null, dtEnt),
                    React.createElement("td", null,
                        React.createElement("span", { className: "status-card status-" + e.status.status }, e.status.status === 'EN' ? 'Entrada' : e.status.status))));
            })))));
}
exports["default"] = TabelaEquipamentos;
