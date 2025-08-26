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
var buton_1 = require("@/components/buton");
require("@/styles/components/modalOrcamento.css"); // <- CSS escopado para este modal
// Helpers para aceitar cargo numérico OU string
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
function ModalVisualizarOrcamento(_a) {
    var _b, _c;
    var orcamento = _a.orcamento, cliente = _a.cliente, equipamento = _a.equipamento, servicos = _a.servicos, produtos = _a.produtos, funcionarios = _a.funcionarios, onClose = _a.onClose, setOrcamentos = _a.setOrcamentos, setEquipamentos = _a.setEquipamentos, givenMode = _a.mode, readOnlyTech = _a.readOnlyTech;
    // modo deduzido pelo status, caso não seja informado via prop
    var derivedMode = givenMode !== null && givenMode !== void 0 ? givenMode : (((_b = equipamento.status) === null || _b === void 0 ? void 0 : _b.status) === 'MA' ? 'maintenance' : 'assign');
    var isMaintenance = derivedMode === 'maintenance';
    var isReadOnlyTech = readOnlyTech !== null && readOnlyTech !== void 0 ? readOnlyTech : isMaintenance;
    var _d = react_1.useState((_c = orcamento.cargo_funcionario) !== null && _c !== void 0 ? _c : null), techId = _d[0], setTechId = _d[1];
    var handleTechChange = function (e) {
        setTechId(e.target.value ? Number(e.target.value) : null);
    };
    // Atribui técnico e envia p/ MA
    var handleSalvar = function () {
        if (techId == null)
            return;
        // 1) Atribui técnico ao orçamento
        fetch("http://127.0.0.1:8000/orcamentos/api/v1/" + orcamento.id + "/", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cargo_funcionario: techId })
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error('Erro ao atribuir técnico');
            return res.json();
        })
            .then(function (updated) {
            // 2) Atualiza store de orçamentos
            setOrcamentos(function (prev) { return prev.map(function (o) { return o.id === updated.id ? updated : o; }); });
            // 3) Atualiza equipamento p/ MA
            return fetch("http://127.0.0.1:8000/equipamentos/api/v1/" + equipamento.id + "/", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'MA' })
            });
        })
            .then(function (res) {
            if (!res || !res.ok)
                throw new Error('Erro ao mudar equipamento para MA');
            // 4) Reflita no front
            setEquipamentos(function (prev) {
                return prev.map(function (e) {
                    return e.id === equipamento.id ? __assign(__assign({}, e), { status: __assign(__assign({}, e.status), { status: 'MA' }) }) : e;
                });
            });
            onClose();
        })["catch"](function (err) {
            console.error(err);
            alert('Não foi possível atribuir técnico/enviar para manutenção.');
        });
    };
    // Conclui manutenção e envia p/ GA (Entrega)
    var handleConcluir = function () {
        fetch("http://127.0.0.1:8000/equipamentos/api/v1/" + equipamento.id + "/", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'GA' })
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error('Erro ao concluir manutenção');
            // Atualiza front
            setEquipamentos(function (prev) {
                return prev.map(function (e) {
                    return e.id === equipamento.id ? __assign(__assign({}, e), { status: __assign(__assign({}, e.status), { status: 'GA' }) }) : e;
                });
            });
            onClose();
        })["catch"](function (err) {
            console.error(err);
            alert('Não foi possível concluir a manutenção.');
        });
    };
    return (react_1["default"].createElement("div", { className: "mvo modal-overlay" },
        react_1["default"].createElement("div", { className: "mvo modal-window" },
            react_1["default"].createElement("h2", { className: "mvo title" }, "Or\u00E7amento"),
            react_1["default"].createElement("div", { className: "mvo summary" },
                react_1["default"].createElement("p", null,
                    react_1["default"].createElement("strong", null, "Cliente:"),
                    " ",
                    cliente.nome),
                react_1["default"].createElement("p", null,
                    react_1["default"].createElement("strong", null, "Equipamento:"),
                    " ",
                    equipamento.equipamento),
                react_1["default"].createElement("p", null,
                    react_1["default"].createElement("strong", null, "S\u00E9rie:"),
                    " ",
                    equipamento.nun_serie)),
            react_1["default"].createElement("div", { className: "mvo entries-section" },
                react_1["default"].createElement("h3", null, "Servi\u00E7os"),
                react_1["default"].createElement("table", { className: "mvo entries-table" },
                    react_1["default"].createElement("thead", null,
                        react_1["default"].createElement("tr", null,
                            react_1["default"].createElement("th", null, "Servi\u00E7o"),
                            react_1["default"].createElement("th", null, "Valor (R$)"))),
                    react_1["default"].createElement("tbody", null, orcamento.servico.map(function (sid) {
                        var _a;
                        var s = servicos.find(function (x) { return x.id === sid; });
                        return s ? (react_1["default"].createElement("tr", { key: sid },
                            react_1["default"].createElement("td", null, s.nome),
                            react_1["default"].createElement("td", null, Number((_a = s.valor) !== null && _a !== void 0 ? _a : 0).toFixed(2)))) : null;
                    })))),
            react_1["default"].createElement("div", { className: "mvo entries-section" },
                react_1["default"].createElement("h3", null, "Produtos"),
                react_1["default"].createElement("table", { className: "mvo entries-table" },
                    react_1["default"].createElement("thead", null,
                        react_1["default"].createElement("tr", null,
                            react_1["default"].createElement("th", null, "Produto"),
                            react_1["default"].createElement("th", null, "Valor (R$)"))),
                    react_1["default"].createElement("tbody", null, orcamento.produto.map(function (pid) {
                        var _a;
                        var p = produtos.find(function (x) { return x.id === pid; });
                        return p ? (react_1["default"].createElement("tr", { key: pid },
                            react_1["default"].createElement("td", null, p.nome),
                            react_1["default"].createElement("td", null, Number((_a = p.valor) !== null && _a !== void 0 ? _a : 0).toFixed(2)))) : null;
                    })))),
            react_1["default"].createElement("div", { className: "mvo form-grid" },
                react_1["default"].createElement("div", { className: "mvo grid-col-12" },
                    react_1["default"].createElement("label", null, "T\u00E9cnico Respons\u00E1vel"),
                    react_1["default"].createElement("select", { value: techId !== null && techId !== void 0 ? techId : '', onChange: handleTechChange, disabled: isReadOnlyTech },
                        react_1["default"].createElement("option", { value: "" }, "Selecione o t\u00E9cnico..."),
                        funcionarios
                            .filter(function (f) { return f.cargo_funcionario && cargoIsTCorGE(f.cargo_funcionario.cargo); })
                            .map(function (f) {
                            var _a;
                            return (react_1["default"].createElement("option", { key: f.id, value: f.cargo_funcionario.id },
                                f.nome,
                                " \u2014 ",
                                cargoLabel((_a = f.cargo_funcionario) === null || _a === void 0 ? void 0 : _a.cargo)));
                        })))),
            react_1["default"].createElement("div", { className: "mvo modal-buttons" },
                isMaintenance ? (react_1["default"].createElement(buton_1["default"], { variant: "success", onClick: handleConcluir }, "Concluir Manuten\u00E7\u00E3o")) : (react_1["default"].createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Atribuir e Enviar p/ Manuten\u00E7\u00E3o")),
                react_1["default"].createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Fechar")))));
}
exports["default"] = ModalVisualizarOrcamento;
