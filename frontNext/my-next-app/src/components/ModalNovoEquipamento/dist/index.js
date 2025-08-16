// src/components/ModalNovoEquipamento/index.tsx
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
        equipamento: '', marca: '', modelo: '', cor: '', nun_serie: ''
    }), form = _b[0], setForm = _b[1];
    // Auto-complete
    var _c = react_1.useState(''), search = _c[0], setSearch = _c[1];
    var _d = react_1.useState(null), selectedClienteId = _d[0], setSelectedId = _d[1];
    var _e = react_1.useState(false), showSug = _e[0], setShowSug = _e[1];
    var _f = react_1.useState(0), activeIndex = _f[0], setActiveIndex = _f[1];
    var comboRef = react_1.useRef(null);
    // Modal novo cliente
    var _g = react_1.useState(false), showCliente = _g[0], setShowCliente = _g[1];
    // Fecha sugestões clicando fora de todo o combobox
    react_1.useEffect(function () {
        var onDown = function (e) {
            if (comboRef.current && !comboRef.current.contains(e.target)) {
                setShowSug(false);
                setActiveIndex(0);
            }
        };
        document.addEventListener('mousedown', onDown);
        return function () { return document.removeEventListener('mousedown', onDown); };
    }, []);
    // Filtragem
    var filtrados = clientes.filter(function (c) { var _a; return ((_a = c.nome) !== null && _a !== void 0 ? _a : '').toLowerCase().includes(search.toLowerCase()); });
    var pickByIndex = function (idx) {
        var _a;
        var c = filtrados[idx];
        if (!c)
            return;
        setSelectedId(c.id);
        setSearch((_a = c.nome) !== null && _a !== void 0 ? _a : '');
        setShowSug(false);
    };
    var handleKey = function (e) {
        if (!showSug && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            setShowSug(true);
            return;
        }
        if (!showSug)
            return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(function (i) { return Math.min(i + 1, filtrados.length - 1); });
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(function (i) { return Math.max(i - 1, 0); });
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            pickByIndex(activeIndex);
        }
        else if (e.key === 'Escape') {
            setShowSug(false);
        }
    };
    var handleSearchChange = function (e) {
        var val = e.target.value;
        setSearch(val);
        setShowSug(true);
        setActiveIndex(0);
        // Limpamos o ID selecionado se o usuário voltar a digitar
        setSelectedId(null);
    };
    var handleSelect = function (c) {
        var _a;
        setSelectedId(c.id);
        setSearch((_a = c.nome) !== null && _a !== void 0 ? _a : '');
        setShowSug(false);
    };
    // (Opcional) Se seu ModalNovoCliente suportar callback onCreated
    var handleClienteCriado = function (novo) {
        var _a;
        // Atualiza lista externa
        setClientes(function (prev) { return __spreadArrays(prev, [novo]); });
        // Já seleciona esse cliente no combobox
        setSelectedId(novo.id);
        setSearch((_a = novo.nome) !== null && _a !== void 0 ? _a : '');
        setShowCliente(false);
    };
    var handleSalvar = function () {
        var clienteId = selectedClienteId;
        // Se o usuário só digitou, tenta casar:
        if (!clienteId) {
            // 1) match exato (case-insensitive)
            var exato = clientes.find(function (c) { var _a; return ((_a = c.nome) !== null && _a !== void 0 ? _a : '').toLowerCase().trim() === search.toLowerCase().trim(); });
            // 2) se não houver exato, se houver só 1 filtrado, assume-o
            var unico = filtrados.length === 1 ? filtrados[0] : undefined;
            if (exato) {
                clienteId = exato.id;
            }
            else if (unico) {
                clienteId = unico.id;
            }
            else {
                alert('Selecione um cliente válido na lista de sugestões.');
                return;
            }
        }
        var body = __assign(__assign({}, form), { cliente: clienteId });
        fetch('http://127.0.0.1:8000/equipamentos/api/v1/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(function (r) {
            if (!r.ok)
                throw new Error('Erro ao criar equipamento');
            return r.json();
        })
            .then(function (novo) {
            setEquipamentos(function (prev) { return __spreadArrays(prev, [novo]); });
            onClose();
        })["catch"](function (err) {
            console.error(err);
            alert('Não foi possível salvar. Verifique os campos e tente novamente.');
        });
    };
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
                    React.createElement("div", { className: "search-wrap", ref: comboRef },
                        React.createElement("input", { id: "cliente-search", className: "search-input", type: "text", placeholder: "Buscar cliente...", autoComplete: "off", value: search, onChange: handleSearchChange, onFocus: function () { return setShowSug(true); }, onKeyDown: handleKey, "aria-autocomplete": "list", "aria-expanded": showSug, "aria-controls": "cliente-suggestions", role: "combobox" }),
                        React.createElement(buton_1["default"], { variant: "secondary", onClick: function () { return setShowCliente(true); } }, "+ Cliente"),
                        showSug && (React.createElement("ul", { id: "cliente-suggestions", className: "suggestions", role: "listbox" },
                            filtrados.slice(0, 8).map(function (c, i) { return (React.createElement("li", { key: c.id, role: "option", "aria-selected": i === activeIndex, className: i === activeIndex ? 'active' : '', onMouseDown: function (e) { return e.preventDefault(); }, onClick: function () { return handleSelect(c); } }, c.nome)); }),
                            filtrados.length === 0 && (React.createElement("li", { className: "no-sug" }, "Nenhum cliente"))))))),
            React.createElement("div", { className: "modal-buttons" },
                React.createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar"),
                React.createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")),
            showCliente && (
            // Se seu ModalNovoCliente expõe onCreated, passe o callback; caso não, remova a prop.
            React.createElement(ModalNovoCliente_1["default"], { onClose: function () { return setShowCliente(false); }, setClientes: setClientes, onCreated: handleClienteCriado })))));
}
exports["default"] = ModalNovoEquipamento;
