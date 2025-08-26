// src/components/ModalNovoOrcamento/index.tsx
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
var buton_1 = require("@/components/buton");
require("@/styles/components/modalOrcamento.css");
function ModalNovoOrcamento(_a) {
    var clientes = _a.clientes, initialEquip = _a.initialEquip, initialClienteName = _a.initialClienteName, equipamentos = _a.equipamentos, servicos = _a.servicos, produtos = _a.produtos, funcionarios = _a.funcionarios, onClose = _a.onClose, setOrcamentos = _a.setOrcamentos, setEquipamentos = _a.setEquipamentos;
    // ==== FALLBACKS SEGUROS (evitam .filter em undefined) ====
    var clientesList = Array.isArray(clientes) ? clientes : [];
    var equipamentosList = Array.isArray(equipamentos) ? equipamentos : [];
    var servicosList = Array.isArray(servicos) ? servicos : [];
    var produtosList = Array.isArray(produtos) ? produtos : [];
    var funcionariosList = Array.isArray(funcionarios) ? funcionarios : [];
    // helpers no topo do componente (ModalNovoOrcamento e ModalVisualizarOrcamento)
    var cargoIsTCorGE = function (cargo) {
        if (cargo == null)
            return false;
        if (typeof cargo === 'number')
            return cargo === 2 || cargo === 3; // 2=TC, 3=GE
        return cargo === 'TC' || cargo === 'GE';
    };
    var cargoLabel = function (cargo) {
        var _a;
        if (cargo == null)
            return '';
        if (typeof cargo === 'number')
            return (_a = { 1: 'RC', 2: 'TC', 3: 'GE' }[cargo]) !== null && _a !== void 0 ? _a : String(cargo);
        return cargo;
    };
    // Estados básicos (pré-preenchidos quando vem do card EN)
    var _b = react_1.useState(initialEquip ? initialEquip.cliente : null), clienteId = _b[0], setClienteId = _b[1];
    var _c = react_1.useState(initialEquip ? initialEquip.id : null), equipId = _c[0], setEquipId = _c[1];
    var clienteNome = react_1.useState(initialClienteName || '')[0];
    var _d = react_1.useState(''), observacao = _d[0], setObservacao = _d[1];
    // Responsável (deve ser um vínculo Cargo_funcionario com cargo TC/GE)
    var _e = react_1.useState(null), respId = _e[0], setRespId = _e[1];
    // Linhas dinâmicas
    var _f = react_1.useState([]), services = _f[0], setServices = _f[1];
    var _g = react_1.useState([]), products = _g[0], setProducts = _g[1];
    react_1.useEffect(function () {
        if (initialEquip) {
            setClienteId(initialEquip.cliente);
            setEquipId(initialEquip.id);
        }
    }, [initialEquip]);
    // Handlers de linhas (serviços)
    var addServiceRow = function () { return setServices(function (prev) { return __spreadArrays(prev, [0]); }); };
    var removeServiceRow = function (i) { return setServices(function (prev) { return prev.filter(function (_, idx) { return idx !== i; }); }); };
    var changeService = function (i, val) {
        return setServices(function (prev) { return prev.map(function (v, idx) { return (idx === i ? val : v); }); });
    };
    // Handlers de linhas (produtos)
    var addProductRow = function () { return setProducts(function (prev) { return __spreadArrays(prev, [0]); }); };
    var removeProductRow = function (i) { return setProducts(function (prev) { return prev.filter(function (_, idx) { return idx !== i; }); }); };
    var changeProduct = function (i, val) {
        return setProducts(function (prev) { return prev.map(function (v, idx) { return (idx === i ? val : v); }); });
    };
    // Salvar (POST) — agora COM cargo_funcionario (obrigatório)
    var handleSalvar = function () {
        if (!equipId) {
            alert('Selecione um equipamento.');
            return;
        }
        if (respId == null) {
            alert('Selecione o responsável pelo orçamento.');
            return;
        }
        var body = {
            observacao: observacao,
            equipamento: equipId,
            servico: services.filter(function (id) { return id !== 0; }),
            produto: products.filter(function (id) { return id !== 0; }),
            cargo_funcionario: respId
        };
        fetch('http://127.0.0.1:8000/orcamentos/api/v1/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error('Erro ao criar orçamento');
            return res.json();
        })
            .then(function (novo) {
            setOrcamentos(function (prev) { return __spreadArrays(prev, [novo]); });
            // move equipamento para "OR" imediatamente
            setEquipamentos(function (prev) {
                return prev.map(function (e) {
                    return e.id === equipId ? __assign(__assign({}, e), { status: __assign(__assign({}, e.status), { status: 'OR' }) }) : e;
                });
            });
            // persiste no backend o status OR
            fetch("http://127.0.0.1:8000/equipamentos/api/v1/" + equipId + "/", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'OR' })
            })["catch"](console.error);
            onClose();
        })["catch"](function (err) {
            console.error(err);
            alert('Não foi possível salvar o orçamento.');
        });
    };
    return (react_1["default"].createElement("div", { className: "modal-overlay" },
        react_1["default"].createElement("div", { className: "modal-orc wide" },
            react_1["default"].createElement("h2", null, "Novo Or\u00E7amento"),
            react_1["default"].createElement("div", { className: "form-grid" },
                react_1["default"].createElement("div", { className: "grid-col-6" },
                    react_1["default"].createElement("label", null, "Cliente"),
                    react_1["default"].createElement("select", { value: clienteId !== null && clienteId !== void 0 ? clienteId : '', disabled: !!initialEquip, onChange: function (e) { return setClienteId(e.target.value ? Number(e.target.value) : null); } },
                        react_1["default"].createElement("option", { value: "" }, initialEquip ? clienteNome : 'Selecione...'),
                        clientesList.map(function (c) { return (react_1["default"].createElement("option", { key: c.id, value: c.id }, c.nome)); }))),
                react_1["default"].createElement("div", { className: "grid-col-6" },
                    react_1["default"].createElement("label", null, "Equipamento"),
                    react_1["default"].createElement("select", { value: equipId !== null && equipId !== void 0 ? equipId : '', disabled: !!initialEquip, onChange: function (e) { return setEquipId(e.target.value ? Number(e.target.value) : null); } },
                        react_1["default"].createElement("option", { value: "" }, initialEquip ? initialEquip.equipamento : 'Selecione...'),
                        equipamentosList
                            .filter(function (e) { return e.cliente === clienteId; })
                            .map(function (e) { return (react_1["default"].createElement("option", { key: e.id, value: e.id }, e.equipamento)); }))),
                react_1["default"].createElement("div", { className: "grid-col-6" },
                    react_1["default"].createElement("label", null, "Respons\u00E1vel"),
                    react_1["default"].createElement("select", { value: respId !== null && respId !== void 0 ? respId : '', onChange: function (e) { return setRespId(e.target.value ? Number(e.target.value) : null); } },
                        react_1["default"].createElement("option", { value: "" }, funcionariosList.length ? 'Selecione o responsável...' : 'Carregando responsáveis...'),
                        funcionariosList
                            .filter(function (f) { return f.cargo_funcionario && cargoIsTCorGE(f.cargo_funcionario.cargo); })
                            .map(function (f) {
                            var _a, _b;
                            return (react_1["default"].createElement("option", { key: f.id, value: f.cargo_funcionario.id },
                                f.nome,
                                " \u2014 ",
                                cargoLabel((_b = (_a = f.cargo_funcionario) === null || _a === void 0 ? void 0 : _a.cargo) !== null && _b !== void 0 ? _b : null)));
                        }))),
                react_1["default"].createElement("div", { className: "grid-col-12" },
                    react_1["default"].createElement("label", null, "Observa\u00E7\u00E3o"),
                    react_1["default"].createElement("textarea", { rows: 3, value: observacao, onChange: function (e) { return setObservacao(e.target.value); }, placeholder: "Detalhes do or\u00E7amento..." }))),
            react_1["default"].createElement("div", { className: "entries-section" },
                react_1["default"].createElement("h3", null, "Servi\u00E7os"),
                react_1["default"].createElement("table", { className: "entries-table" },
                    react_1["default"].createElement("thead", null,
                        react_1["default"].createElement("tr", null,
                            react_1["default"].createElement("th", null, "Servi\u00E7o"),
                            react_1["default"].createElement("th", { style: { width: '1rem' } }))),
                    react_1["default"].createElement("tbody", null, services.map(function (srvId, i) { return (react_1["default"].createElement("tr", { key: i },
                        react_1["default"].createElement("td", null,
                            react_1["default"].createElement("select", { value: srvId !== null && srvId !== void 0 ? srvId : '', onChange: function (e) { return changeService(i, Number(e.target.value)); } },
                                react_1["default"].createElement("option", { value: "" }, "Selecione..."),
                                servicosList.map(function (s) {
                                    var _a;
                                    return (react_1["default"].createElement("option", { key: s.id, value: s.id },
                                        s.nome,
                                        " \u2014 R$ ",
                                        Number((_a = s.valor) !== null && _a !== void 0 ? _a : 0).toFixed(2)));
                                }))),
                        react_1["default"].createElement("td", null,
                            react_1["default"].createElement("button", { type: "button", onClick: function () { return removeServiceRow(i); }, className: "btn-remove-row" }, "\u00D7")))); }))),
                react_1["default"].createElement(buton_1["default"], { variant: "secondary", onClick: addServiceRow }, "+ Adicionar Servi\u00E7o")),
            react_1["default"].createElement("div", { className: "entries-section" },
                react_1["default"].createElement("h3", null, "Produtos"),
                react_1["default"].createElement("table", { className: "entries-table" },
                    react_1["default"].createElement("thead", null,
                        react_1["default"].createElement("tr", null,
                            react_1["default"].createElement("th", null, "Produto"),
                            react_1["default"].createElement("th", { style: { width: '1rem' } }))),
                    react_1["default"].createElement("tbody", null, products.map(function (prdId, i) { return (react_1["default"].createElement("tr", { key: i },
                        react_1["default"].createElement("td", null,
                            react_1["default"].createElement("select", { value: prdId !== null && prdId !== void 0 ? prdId : '', onChange: function (e) { return changeProduct(i, Number(e.target.value)); } },
                                react_1["default"].createElement("option", { value: "" }, "Selecione..."),
                                produtosList.map(function (p) {
                                    var _a;
                                    return (react_1["default"].createElement("option", { key: p.id, value: p.id },
                                        p.nome,
                                        " \u2014 R$ ",
                                        Number((_a = p.preco) !== null && _a !== void 0 ? _a : 0).toFixed(2)));
                                }))),
                        react_1["default"].createElement("td", null,
                            react_1["default"].createElement("button", { type: "button", onClick: function () { return removeProductRow(i); }, className: "btn-remove-row" }, "\u00D7")))); }))),
                react_1["default"].createElement(buton_1["default"], { variant: "secondary", onClick: addProductRow }, "+ Adicionar Produto")),
            react_1["default"].createElement("div", { className: "modal-buttons" },
                react_1["default"].createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar"),
                react_1["default"].createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")))));
}
exports["default"] = ModalNovoOrcamento;
