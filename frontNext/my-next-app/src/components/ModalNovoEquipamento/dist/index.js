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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var InputCampo_1 = require("@/components/InputCampo");
var buton_1 = require("@/components/buton");
var ModalNovoCliente_1 = require("@/components/ModalNovoCliente");
require("@/styles/components/modalEquipamento.css");
function ModalNovoEquipamento(_a) {
    var onClose = _a.onClose, setEquipamentos = _a.setEquipamentos, clientes = _a.clientes, setClientes = _a.setClientes;
    var _b = react_1.useState({
        equipamento: '', marca: '', modelo: '', cor: '', nun_serie: '', cliente: 0
    }), form = _b[0], setForm = _b[1];
    var _c = react_1.useState(''), search = _c[0], setSearch = _c[1];
    var _d = react_1.useState(false), showSug = _d[0], setShowSug = _d[1];
    var _e = react_1.useState(false), showCliente = _e[0], setShowCliente = _e[1];
    var sugRef = react_1.useRef(null);
    // atualiza cliente no form quando search corresponde exatamente a um nome
    var handleSelect = function (c) {
        var _a;
        setForm(function (prev) { return (__assign(__assign({}, prev), { cliente: c.id })); });
        setSearch((_a = c.nome) !== null && _a !== void 0 ? _a : '');
        setShowSug(false);
    };
    // fecha sugestões ao clicar fora
    react_1.useEffect(function () {
        var handler = function (e) {
            if (sugRef.current && !sugRef.current.contains(e.target))
                setShowSug(false);
        };
        document.addEventListener('mousedown', handler);
        return function () { return document.removeEventListener('mousedown', handler); };
    }, []);
    var handleSalvar = function () {
        fetch('http://127.0.0.1:8000/equipamentos/api/v1/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(function (r) {
            if (!r.ok)
                throw new Error('Erro');
            return r.json();
        })
            .then(function (novo) {
            setEquipamentos(function (prev) { return __spreadArrays(prev, [novo]); });
            onClose();
        })["catch"](console.error);
    };
    var filtrados = clientes.filter(function (c) { var _a; return ((_a = c.nome) !== null && _a !== void 0 ? _a : '').toLowerCase().includes(search.toLowerCase()); });
    return (React.createElement("div", { className: "modal-overlay" },
        React.createElement("div", { className: "modal-equip wide" },
            React.createElement("h2", null, "Novo Equipamento"),
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
                    React.createElement("label", { htmlFor: "cliente-search", className: "input-label" }, "Cliente"),
                    React.createElement("div", { className: "search-wrap" },
                        React.createElement("input", { id: "cliente-search", className: "search-input", type: "text", placeholder: "Buscar cliente...", value: search, onChange: function (e) { setSearch(e.target.value); setShowSug(true); }, onFocus: function () { return setShowSug(true); } }),
                        React.createElement(buton_1["default"], { variant: "secondary", onClick: function () { return setShowCliente(true); } }, "+ Cliente")),
                    showSug && (React.createElement("ul", { className: "suggestions", ref: sugRef },
                        filtrados.slice(0, 8).map(function (c) { return (React.createElement("li", { key: c.id, onClick: function () { return handleSelect(c); } }, c.nome)); }),
                        filtrados.length === 0 && React.createElement("li", { className: "no-sug" }, "Nenhum cliente"))))),
            React.createElement("div", { className: "modal-buttons" },
                React.createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar"),
                React.createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")),
            showCliente && (React.createElement(ModalNovoCliente_1["default"], { onClose: function () { return setShowCliente(false); }, setClientes: setClientes })))));
}
exports["default"] = ModalNovoEquipamento;
