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
require("@/styles/components/modalOrcamento.css");
function ModalVisualizarOrcamento(_a) {
    var _b, _c, _d;
    var orcamento = _a.orcamento, cliente = _a.cliente, equipamento = _a.equipamento, servicos = _a.servicos, produtos = _a.produtos, funcionarios = _a.funcionarios, onClose = _a.onClose, setOrcamentos = _a.setOrcamentos, setEquipamentos = _a.setEquipamentos;
    var _e = react_1.useState((_b = orcamento.cargo_funcionario) !== null && _b !== void 0 ? _b : null), techId = _e[0], setTechId = _e[1];
    var handleTechChange = function (e) {
        setTechId(e.target.value ? Number(e.target.value) : null);
    };
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
            // Atualiza orçamentos
            setOrcamentos(function (prev) { return prev.map(function (o) { return (o.id === updated.id ? updated : o); }); });
            // 2) Move equipamento para "MA"
            fetch("http://127.0.0.1:8000/equipamentos/api/v1/" + equipamento.id + "/", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'MA' })
            })["catch"](console.error);
            setEquipamentos(function (prev) {
                return prev.map(function (e) {
                    return e.id === equipamento.id ? __assign(__assign({}, e), { status: __assign(__assign({}, e.status), { status: 'MA' }) }) : e;
                });
            });
            onClose();
        })["catch"](console.error);
    };
    return (react_1["default"].createElement("div", { className: "modal-overlay" },
        react_1["default"].createElement("div", { className: "modal-orc wide" },
            react_1["default"].createElement("h2", null, "Visualizar Or\u00E7amento"),
            react_1["default"].createElement("div", { className: "form-grid" },
                react_1["default"].createElement("div", { className: "grid-col-12" },
                    react_1["default"].createElement("label", null, "Cliente"),
                    react_1["default"].createElement("input", { type: "text", value: (_c = cliente.nome) !== null && _c !== void 0 ? _c : '', readOnly: true })),
                react_1["default"].createElement("div", { className: "grid-col-6" },
                    react_1["default"].createElement("label", null, "Equipamento"),
                    react_1["default"].createElement("input", { type: "text", value: equipamento.equipamento, readOnly: true })),
                react_1["default"].createElement("div", { className: "grid-col-6" },
                    react_1["default"].createElement("label", null, "N\u00BA de S\u00E9rie"),
                    react_1["default"].createElement("input", { type: "text", value: equipamento.nun_serie, readOnly: true })),
                react_1["default"].createElement("div", { className: "grid-col-12" },
                    react_1["default"].createElement("label", null, "Observa\u00E7\u00E3o"),
                    react_1["default"].createElement("textarea", { value: (_d = orcamento.observacao) !== null && _d !== void 0 ? _d : '', readOnly: true, rows: 3 }))),
            react_1["default"].createElement("div", { className: "entries-section" },
                react_1["default"].createElement("h3", null, "Servi\u00E7os"),
                react_1["default"].createElement("table", { className: "entries-table" },
                    react_1["default"].createElement("thead", null,
                        react_1["default"].createElement("tr", null,
                            react_1["default"].createElement("th", null, "Servi\u00E7o"),
                            react_1["default"].createElement("th", null, "Valor (R$)"))),
                    react_1["default"].createElement("tbody", null, orcamento.servico.map(function (sid) {
                        var s = servicos.find(function (x) { return x.id === sid; });
                        return s ? (react_1["default"].createElement("tr", { key: sid },
                            react_1["default"].createElement("td", null, s.nome),
                            react_1["default"].createElement("td", null, s.valor.toFixed(2)))) : null;
                    })))),
            react_1["default"].createElement("div", { className: "entries-section" },
                react_1["default"].createElement("h3", null, "Produtos"),
                react_1["default"].createElement("table", { className: "entries-table" },
                    react_1["default"].createElement("thead", null,
                        react_1["default"].createElement("tr", null,
                            react_1["default"].createElement("th", null, "Produto"),
                            react_1["default"].createElement("th", null, "Valor (R$)"))),
                    react_1["default"].createElement("tbody", null, orcamento.produto.map(function (pid) {
                        var p = produtos.find(function (x) { return x.id === pid; });
                        return p ? (react_1["default"].createElement("tr", { key: pid },
                            react_1["default"].createElement("td", null, p.nome),
                            react_1["default"].createElement("td", null, p.preco.toFixed(2)))) : null;
                    })))),
            react_1["default"].createElement("div", { className: "form-grid" },
                react_1["default"].createElement("div", { className: "grid-col-12" },
                    react_1["default"].createElement("label", null, "T\u00E9cnico Respons\u00E1vel"),
                    react_1["default"].createElement("select", { value: techId !== null && techId !== void 0 ? techId : '', onChange: handleTechChange },
                        react_1["default"].createElement("option", { value: "" }, "Selecione o t\u00E9cnico..."),
                        funcionarios
                            .filter(function (f) { var _a; return ((_a = f.cargo_funcionario) === null || _a === void 0 ? void 0 : _a.id) != null; }) // mostra quem tem vínculo
                            .map(function (f) { return (react_1["default"].createElement("option", { key: f.cargo_funcionario.id, value: f.cargo_funcionario.id }, f.nome)); })))),
            react_1["default"].createElement("div", { className: "modal-buttons" },
                react_1["default"].createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Atribuir e Enviar p/ Manuten\u00E7\u00E3o"),
                react_1["default"].createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Fechar")))));
}
exports["default"] = ModalVisualizarOrcamento;
