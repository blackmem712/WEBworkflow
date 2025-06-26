'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var react_1 = require("react");
var InputCampo_1 = require("@/components/InputCampo");
var buton_1 = require("@/components/buton");
var ModalNovoCliente_1 = require("@/components/ModalNovoCliente");
require("@/styles/components/modalEquipamento.css");
function ModalEquipamento(_a) {
    var _b;
    var equipamento = _a.equipamento, clientes = _a.clientes, setClientes = _a.setClientes, setEquipamentos = _a.setEquipamentos, onClose = _a.onClose;
    // Estado do formulário (todos os campos de Equipamento menos status)
    var _c = react_1.useState((function (_a) {
        var status = _a.status, rest = __rest(_a, ["status"]);
        return rest;
    })(equipamento)), form = _c[0], setForm = _c[1];
    // Para campo de busca de cliente
    var initialCliente = clientes.find(function (c) { return c.id === equipamento.cliente; });
    var _d = react_1.useState((_b = initialCliente === null || initialCliente === void 0 ? void 0 : initialCliente.nome) !== null && _b !== void 0 ? _b : ''), search = _d[0], setSearch = _d[1];
    var _e = react_1.useState(false), showSug = _e[0], setShowSug = _e[1];
    var _f = react_1.useState(false), showCliente = _f[0], setShowCliente = _f[1];
    var sugRef = react_1.useRef(null);
    // Fecha dropdown de sugestões ao clicar fora
    react_1.useEffect(function () {
        function onClickOutside(e) {
            if (sugRef.current && !sugRef.current.contains(e.target)) {
                setShowSug(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return function () { return document.removeEventListener('mousedown', onClickOutside); };
    }, []);
    // Seleciona cliente da lista de sugestões
    var handleSelectCliente = function (c) {
        var _a;
        setForm(function (prev) { return (__assign(__assign({}, prev), { cliente: c.id })); });
        setSearch((_a = c.nome) !== null && _a !== void 0 ? _a : '');
        setShowSug(false);
    };
    // Envia PATCH para atualizar o equipamento
    var handleSalvar = function () {
        fetch("http://127.0.0.1:8000/equipamentos/api/v1/" + equipamento.id + "/", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error('Erro ao salvar');
            return res.json();
        })
            .then(function (updated) {
            setEquipamentos(function (prev) {
                return prev.map(function (e) { return (e.id === updated.id ? updated : e); });
            });
            onClose();
        })["catch"](console.error);
    };
    // Filtra sugestões de clientes conforme texto digitado
    var sugestoes = clientes.filter(function (c) { var _a; return ((_a = c.nome) !== null && _a !== void 0 ? _a : '').toLowerCase().includes(search.toLowerCase()); });
    // Formata data de entrada
    var dtEnt = new Date(equipamento.status.date_entrada)
        .toLocaleString();
    return (React.createElement("div", { className: "modal-overlay" },
        React.createElement("div", { className: "modal-equip wide" },
            React.createElement("h2", null, "Editar Equipamento"),
            React.createElement("div", { className: "form-grid" },
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Equipamento", name: "equipamento", value: form.equipamento, onChange: function (e) { return setForm(__assign(__assign({}, form), { equipamento: e.target.value })); } })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Marca", name: "marca", value: form.marca, onChange: function (e) { return setForm(__assign(__assign({}, form), { marca: e.target.value })); } })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Modelo", name: "modelo", value: form.modelo, onChange: function (e) { return setForm(__assign(__assign({}, form), { modelo: e.target.value })); } })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Cor", name: "cor", value: form.cor, onChange: function (e) { return setForm(__assign(__assign({}, form), { cor: e.target.value })); } })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "N\u00BA S\u00E9rie", name: "nun_serie", value: form.nun_serie, onChange: function (e) { return setForm(__assign(__assign({}, form), { nun_serie: e.target.value })); } })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement("label", null, "Data de Entrada"),
                    React.createElement("p", { className: "date-field" }, dtEnt)),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement("label", null, "Status"),
                    React.createElement("div", { className: "status-card status-" + equipamento.status.status }, equipamento.status.status === 'EN' ? 'Entrada' : equipamento.status.status)),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement("label", { htmlFor: "cliente-search", className: "input-label" }, "Cliente"),
                    React.createElement("div", { className: "search-wrap" },
                        React.createElement("input", { id: "cliente-search", className: "search-input", type: "text", placeholder: "Buscar cliente...", value: search, onChange: function (e) { setSearch(e.target.value); setShowSug(true); }, onFocus: function () { return setShowSug(true); } }),
                        React.createElement(buton_1["default"], { variant: "secondary", onClick: function () { return setShowCliente(true); } }, "+ Cliente")),
                    showSug && (React.createElement("ul", { className: "suggestions", ref: sugRef },
                        sugestoes.slice(0, 8).map(function (c) { return (React.createElement("li", { key: c.id, onClick: function () { return handleSelectCliente(c); } }, c.nome)); }),
                        sugestoes.length === 0 && (React.createElement("li", { className: "no-sug" }, "Nenhum cliente encontrado")))))),
            React.createElement("div", { className: "modal-buttons" },
                React.createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar"),
                React.createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")),
            showCliente && (React.createElement(ModalNovoCliente_1["default"], { onClose: function () { return setShowCliente(false); }, setClientes: setClientes })))));
}
exports["default"] = ModalEquipamento;
