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
function ModalOrcamento(_a) {
    var _b, _c, _d, _e, _f, _g;
    var orcamento = _a.orcamento, equipamentos = _a.equipamentos, servicos = _a.servicos, produtos = _a.produtos, funcionarios = _a.funcionarios, onClose = _a.onClose, setOrcamentos = _a.setOrcamentos;
    var _h = react_1.useState({
        observacao: orcamento.observacao,
        equipamento: (_b = orcamento.equipamento) !== null && _b !== void 0 ? _b : null,
        servico: (_c = orcamento.servico) !== null && _c !== void 0 ? _c : [],
        produto: (_d = orcamento.produto) !== null && _d !== void 0 ? _d : [],
        cargo_funcionario: (_e = orcamento.cargo_funcionario) !== null && _e !== void 0 ? _e : null
    }), form = _h[0], setForm = _h[1];
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value, selectedOptions = _a.selectedOptions;
        if (name === 'servico' || name === 'produto') {
            var vals_1 = Array.from(selectedOptions).map(function (o) { return Number(o.value); });
            setForm(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = vals_1, _a)));
            });
        }
        else if (name === 'observacao') {
            setForm(function (prev) { return (__assign(__assign({}, prev), { observacao: value })); });
        }
        else {
            setForm(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = value === '' ? null : Number(value), _a)));
            });
        }
    };
    var handleSalvar = function () {
        fetch("http://127.0.0.1:8000/orcamentos/api/v1/" + orcamento.id + "/", {
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
            setOrcamentos(function (prev) {
                return prev.map(function (o) { return (o.id === updated.id ? updated : o); });
            });
            onClose();
        })["catch"](console.error);
    };
    return (React.createElement("div", { className: "modal-overlay" },
        React.createElement("div", { className: "modal-orc wide" },
            React.createElement("h2", null, "Editar Or\u00E7amento"),
            React.createElement("div", { className: "form-grid" },
                React.createElement("div", { className: "grid-col-12" },
                    React.createElement("label", null, "Observa\u00E7\u00E3o"),
                    React.createElement("textarea", { name: "observacao", value: form.observacao, onChange: handleChange, rows: 3 })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement("label", null, "Equipamento"),
                    React.createElement("select", { name: "equipamento", value: ((_f = form.equipamento) === null || _f === void 0 ? void 0 : _f.toString()) || '', onChange: handleChange },
                        React.createElement("option", { value: "" }, "Selecione..."),
                        equipamentos.map(function (e) { return (React.createElement("option", { key: e.id, value: e.id.toString() }, e.equipamento)); }))),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement("label", null, "Respons\u00E1vel"),
                    React.createElement("select", { name: "cargo_funcionario", value: ((_g = form.cargo_funcionario) === null || _g === void 0 ? void 0 : _g.toString()) || '', onChange: handleChange },
                        React.createElement("option", { value: "" }, "Selecione..."),
                        funcionarios.map(function (f) { return (React.createElement("option", { key: f.cargo_funcionario.id, value: f.cargo_funcionario.id.toString() }, f.nome)); }))),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement("label", null, "Servi\u00E7os"),
                    React.createElement("select", { multiple: true, name: "servico", value: form.servico.map(function (v) { return v.toString(); }), onChange: handleChange }, servicos.map(function (s) { return (React.createElement("option", { key: s.id, value: s.id.toString() }, s.nome)); }))),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement("label", null, "Produtos"),
                    React.createElement("select", { multiple: true, name: "produto", value: form.produto.map(function (v) { return v.toString(); }), onChange: handleChange }, produtos.map(function (p) { return (React.createElement("option", { key: p.id, value: p.id.toString() }, p.nome)); })))),
            React.createElement("div", { className: "modal-buttons" },
                React.createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar"),
                React.createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")))));
}
exports["default"] = ModalOrcamento;
