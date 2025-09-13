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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var etiquetaQRModal_1 = require("@/app/(protected)/Equipamentos/[id]/etiqueta/etiquetaQRModal");
require("@/styles/components/modalEquipamento.css");
function ModalNovoEquipamento(_a) {
    var _this = this;
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
    // === NOVO: controle do modal de etiqueta ===
    var _h = react_1.useState(false), showEtiqueta = _h[0], setShowEtiqueta = _h[1];
    var _j = react_1.useState(null), etiquetaData = _j[0], setEtiquetaData = _j[1];
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
        setClientes(function (prev) { return __spreadArrays(prev, [novo]); });
        setSelectedId(novo.id);
        setSearch((_a = novo.nome) !== null && _a !== void 0 ? _a : '');
        setShowCliente(false);
    };
    var handleSalvar = function () { return __awaiter(_this, void 0, void 0, function () {
        var clienteId, exato, unico, body, r, novo_1, id, qr_slug, nome, r2, d2, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    clienteId = selectedClienteId;
                    // Se o usuário só digitou, tenta casar
                    if (!clienteId) {
                        exato = clientes.find(function (c) { var _a; return ((_a = c.nome) !== null && _a !== void 0 ? _a : '').toLowerCase().trim() === search.toLowerCase().trim(); });
                        unico = filtrados.length === 1 ? filtrados[0] : undefined;
                        if (exato)
                            clienteId = exato.id;
                        else if (unico)
                            clienteId = unico.id;
                        else {
                            alert('Selecione um cliente válido na lista de sugestões.');
                            return [2 /*return*/];
                        }
                    }
                    body = __assign(__assign({}, form), { cliente: clienteId });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch('http://127.0.0.1:8000/equipamentos/api/v1/', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body)
                        })];
                case 2:
                    r = _a.sent();
                    if (!r.ok)
                        throw new Error('Erro ao criar equipamento');
                    return [4 /*yield*/, r.json()
                        // Atualiza listagem externa
                    ];
                case 3:
                    novo_1 = _a.sent();
                    // Atualiza listagem externa
                    setEquipamentos(function (prev) { return __spreadArrays(prev, [novo_1]); });
                    id = novo_1 === null || novo_1 === void 0 ? void 0 : novo_1.id;
                    qr_slug = novo_1 === null || novo_1 === void 0 ? void 0 : novo_1.qr_slug;
                    nome = novo_1 === null || novo_1 === void 0 ? void 0 : novo_1.equipamento;
                    if (!((!qr_slug || !id) && id)) return [3 /*break*/, 6];
                    return [4 /*yield*/, fetch("http://127.0.0.1:8000/equipamentos/api/v1/" + id + "/")];
                case 4:
                    r2 = _a.sent();
                    if (!r2.ok) return [3 /*break*/, 6];
                    return [4 /*yield*/, r2.json()];
                case 5:
                    d2 = _a.sent();
                    qr_slug = qr_slug || (d2 === null || d2 === void 0 ? void 0 : d2.qr_slug);
                    nome = nome || (d2 === null || d2 === void 0 ? void 0 : d2.equipamento);
                    _a.label = 6;
                case 6:
                    if (!id || !qr_slug) {
                        alert('Equipamento criado, mas não foi possível obter o QR. Verifique o serializer (qr_slug).');
                        return [2 /*return*/];
                    }
                    setEtiquetaData({ id: id, qr_slug: qr_slug, equipamento: nome });
                    setShowEtiqueta(true);
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    console.error(err_1);
                    alert('Não foi possível salvar. Verifique os campos e tente novamente.');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "modal-overlay" },
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
                                filtrados.length === 0 && React.createElement("li", { className: "no-sug" }, "Nenhum cliente")))))),
                React.createElement("div", { className: "modal-buttons" },
                    React.createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar e imprimir QR"),
                    React.createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")),
                showCliente && (React.createElement(ModalNovoCliente_1["default"], { onClose: function () { return setShowCliente(false); }, setClientes: setClientes, onCreated: handleClienteCriado })))),
        React.createElement(etiquetaQRModal_1["default"], { open: showEtiqueta, onClose: function () { return setShowEtiqueta(false); }, data: etiquetaData, autoPrint: false })));
}
exports["default"] = ModalNovoEquipamento;
