// src/app/page.tsx
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
exports.__esModule = true;
var react_1 = require("react");
var dnd_1 = require("@hello-pangea/dnd");
var ModalNovoOrcamento_1 = require("@/components/ModalNovoOrcamento");
var ModalVisualizarOrcamento_1 = require("@/components/ModalVisualizarOrcamento");
var status_1 = require("@/constants/status");
require("@/styles/kanban.css");
var LS_KEY = 'kanban_equipment_status_v1';
// Utils de LocalStorage
function loadOverrides() {
    try {
        var raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : {};
    }
    catch (_a) {
        return {};
    }
}
function saveOverride(id, code) {
    var map = loadOverrides();
    map[id] = code;
    localStorage.setItem(LS_KEY, JSON.stringify(map));
}
function removeOverride(id) {
    var map = loadOverrides();
    delete map[id];
    localStorage.setItem(LS_KEY, JSON.stringify(map));
}
function HomePage() {
    var _a = react_1.useState([]), equipamentos = _a[0], setEquipamentos = _a[1];
    var _b = react_1.useState([]), clientes = _b[0], setClientes = _b[1];
    var _c = react_1.useState([]), servicos = _c[0], setServicos = _c[1];
    var _d = react_1.useState([]), produtos = _d[0], setProdutos = _d[1];
    var _e = react_1.useState([]), funcionarios = _e[0], setFuncionarios = _e[1];
    var _f = react_1.useState([]), orcamentos = _f[0], setOrcamentos = _f[1];
    // Modal: Novo orçamento (ao clicar em EN)
    var _g = react_1.useState(null), newOrcEquip = _g[0], setNewOrcEquip = _g[1];
    var _h = react_1.useState(false), showOrcModal = _h[0], setShowOrcModal = _h[1];
    // Modal: Visualizar/Responsabilizar (ao clicar em OR)
    var _j = react_1.useState(null), selOrcamento = _j[0], setSelOrcamento = _j[1];
    var _k = react_1.useState(false), showViewModal = _k[0], setShowViewModal = _k[1];
    // flags de carregamento para aplicar overrides 1x
    var overridesAppliedRef = react_1.useRef(false);
    react_1.useEffect(function () {
        // fetch inicial
        fetch('http://127.0.0.1:8000/equipamentos/api/v1/')
            .then(function (r) { return r.json(); }).then(setEquipamentos)["catch"](console.error);
        fetch('http://127.0.0.1:8000/pessoas/api/v1/')
            .then(function (r) { return r.json(); }).then(setClientes)["catch"](console.error);
        fetch('http://127.0.0.1:8000/servicos/api/v1/')
            .then(function (r) { return r.json(); }).then(setServicos)["catch"](console.error);
        fetch('http://127.0.0.1:8000/produtos/api/v1/')
            .then(function (r) { return r.json(); }).then(setProdutos)["catch"](console.error);
        fetch('http://127.0.0.1:8000/funcionarios/api/v1/')
            .then(function (r) { return r.json(); }).then(setFuncionarios)["catch"](console.error);
        fetch('http://127.0.0.1:8000/orcamentos/api/v1/')
            .then(function (r) { return r.json(); }).then(setOrcamentos)["catch"](console.error);
    }, []);
    // Mapa clienteId → nome
    var clientMap = react_1.useMemo(function () {
        var m = new Map();
        clientes.forEach(function (c) { return m.set(c.id, c.nome); });
        return m;
    }, [clientes]);
    // Regras de negócio (coerção do status desejado)
    var enforceRules = function (equipId, desired) {
        var hasOrc = orcamentos.some(function (o) { return o.equipamento === equipId; });
        // Regra 1: tem orçamento → não pode ficar em EN
        if (hasOrc && desired === 'EN')
            return 'OR';
        // Regra 2: não tem orçamento → não pode ficar em OR
        if (!hasOrc && desired === 'OR')
            return 'EN';
        return desired;
    };
    // Aplica overrides salvos no LS (apenas 1 vez, após dados carregados)
    react_1.useEffect(function () {
        if (overridesAppliedRef.current)
            return;
        if (equipamentos.length === 0)
            return;
        // Espera orcamentos para poder aplicar as regras
        var ready = orcamentos !== undefined;
        if (!ready)
            return;
        var map = loadOverrides();
        if (Object.keys(map).length === 0) {
            overridesAppliedRef.current = true;
            return;
        }
        setEquipamentos(function (prev) {
            return prev.map(function (e) {
                var desired = map[e.id];
                if (!desired)
                    return e;
                var coerced = enforceRules(e.id, desired);
                if (coerced !== desired)
                    saveOverride(e.id, coerced); // ajusta LS se conflitar com regras
                if (coerced !== e.status.status) {
                    return __assign(__assign({}, e), { status: __assign(__assign({}, e.status), { status: coerced }) });
                }
                return e;
            });
        });
        overridesAppliedRef.current = true;
    }, [equipamentos, orcamentos]);
    // Agrupa por status
    var grouped = react_1.useMemo(function () {
        return status_1.STATUS_LIST.reduce(function (acc, _a) {
            var code = _a.code;
            acc[code] = equipamentos.filter(function (e) { return e.status.status === code; });
            return acc;
        }, {});
    }, [equipamentos]);
    // Drag & drop → move + salva no LS + PATCH backend
    var onDragEnd = function (res) {
        var source = res.source, destination = res.destination, draggableId = res.draggableId;
        if (!destination || destination.droppableId === source.droppableId)
            return;
        var equipId = Number(draggableId);
        var newStatus = destination.droppableId;
        // Regras
        newStatus = enforceRules(equipId, newStatus);
        // Atualiza local
        setEquipamentos(function (prev) {
            return prev.map(function (e) {
                return e.id === equipId ? __assign(__assign({}, e), { status: __assign(__assign({}, e.status), { status: newStatus }) }) : e;
            });
        });
        // Salva no LS
        saveOverride(equipId, newStatus);
        // PATCH backend (seu endpoint pode exigir outro payload; ajuste se necessário)
        fetch("http://127.0.0.1:8000/equipamentos/api/v1/" + equipId + "/", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })["catch"](console.error);
    };
    // Clique do card: EN → abre NOVO orçamento | OR → abre VISUALIZAR
    var onCardClick = function (code, eq) {
        if (code === 'EN') {
            setNewOrcEquip(eq);
            setShowOrcModal(true);
            return;
        }
        if (code === 'OR') {
            var orc = orcamentos.find(function (o) { return o.equipamento === eq.id; }) || null;
            if (!orc)
                return;
            setSelOrcamento(orc);
            setShowViewModal(true);
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(dnd_1.DragDropContext, { onDragEnd: onDragEnd },
            React.createElement("div", { className: "kanban-board" }, status_1.STATUS_LIST.map(function (_a) {
                var code = _a.code, label = _a.label;
                return (React.createElement(dnd_1.Droppable, { key: code, droppableId: code }, function (provDrop, snapDrop) { return (React.createElement("div", __assign({ className: "kanban-column", ref: provDrop.innerRef }, provDrop.droppableProps),
                    React.createElement("h2", { className: "column-header" }, label),
                    React.createElement("div", { className: "column-body " + (snapDrop.isDraggingOver ? 'dragging-over' : '') },
                        grouped[code].map(function (eq, idx) { return (React.createElement(dnd_1.Draggable, { key: eq.id.toString(), draggableId: eq.id.toString(), index: idx }, function (provDrag, snapDrag) {
                            var _a;
                            return (React.createElement("div", __assign({ ref: provDrag.innerRef }, provDrag.draggableProps, provDrag.dragHandleProps, { className: "kanban-card " + (snapDrag.isDragging ? 'dragging' : ''), onClick: function () { return onCardClick(code, eq); } }),
                                React.createElement("h3", { className: "card-title" }, eq.equipamento),
                                React.createElement("p", { className: "card-client" },
                                    "Cliente: ", (_a = clientMap.get(eq.cliente)) !== null && _a !== void 0 ? _a : '—'),
                                React.createElement("p", { className: "card-date" },
                                    "Entrada:",
                                    ' ',
                                    eq.status.date_entrada
                                        ? new Date(eq.status.date_entrada).toLocaleDateString()
                                        : '—'),
                                React.createElement("p", { className: "card-series" },
                                    "S\u00E9rie: ",
                                    eq.nun_serie)));
                        })); }),
                        provDrop.placeholder))); }));
            }))),
        showOrcModal && newOrcEquip && (React.createElement(ModalNovoOrcamento_1["default"], { clientes: clientes, initialEquip: newOrcEquip, initialClienteName: clientMap.get(newOrcEquip.cliente), equipamentos: equipamentos, servicos: servicos, produtos: produtos, onClose: function () {
                setShowOrcModal(false);
                setNewOrcEquip(null);
            }, setOrcamentos: setOrcamentos, setEquipamentos: function (updater) {
                // intercepta para também gravar no LS quando virar OR
                setEquipamentos(function (prev) {
                    var next = typeof updater === 'function' ? updater(prev) : updater;
                    // acha o id movido pra OR e salva
                    next.forEach(function (e) {
                        if (e.status.status === 'OR')
                            saveOverride(e.id, 'OR');
                    });
                    return next;
                });
            } })),
        showViewModal && selOrcamento && (function () {
            var eq = equipamentos.find(function (e) { return e.id === selOrcamento.equipamento; });
            if (!eq)
                return null;
            var cli = clientes.find(function (c) { return c.id === eq.cliente; });
            if (!cli)
                return null;
            return (React.createElement(ModalVisualizarOrcamento_1["default"], { orcamento: selOrcamento, cliente: cli, equipamento: eq, servicos: servicos, produtos: produtos, funcionarios: funcionarios, onClose: function () {
                    setShowViewModal(false);
                    setSelOrcamento(null);
                }, setOrcamentos: setOrcamentos, setEquipamentos: function (updater) {
                    // intercepta para gravar no LS quando virar MA
                    setEquipamentos(function (prev) {
                        var next = typeof updater === 'function' ? updater(prev) : updater;
                        next.forEach(function (e) {
                            if (e.status.status === 'MA')
                                saveOverride(e.id, 'MA');
                        });
                        return next;
                    });
                } }));
        })()));
}
exports["default"] = HomePage;
