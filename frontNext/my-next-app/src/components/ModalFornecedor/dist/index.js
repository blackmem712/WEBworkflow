// src/components/ModalFornecedor.tsx
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
var InputCampo_1 = require("@/components/InputCampo");
var buton_1 = require("@/components/buton");
require("@/styles/components/modalFornecedor.css");
function ModalFornecedor(_a) {
    var fornecedor = _a.fornecedor, produtos = _a.produtos, onClose = _a.onClose, setFornecedores = _a.setFornecedores;
    var _b = react_1.useState({
        nome: fornecedor.nome,
        cnpj: fornecedor.cnpj,
        telefone: fornecedor.telefone,
        descricao: fornecedor.descricao,
        produtos: fornecedor.produtos
    }), form = _b[0], setForm = _b[1];
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value, selectedOptions = _a.selectedOptions;
        if (name === 'produtos' && selectedOptions) {
            var vals_1 = Array.from(selectedOptions).map(function (o) { return Number(o.value); });
            setForm(function (prev) { return (__assign(__assign({}, prev), { produtos: vals_1 })); });
        }
        else {
            setForm(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = name === 'cnpj' || name === 'telefone'
                    ? value
                    : name === 'descricao'
                        ? value
                        : value, _a)));
            });
        }
    };
    var handleSalvar = function () {
        fetch("http://127.0.0.1:8000/fornecedores/api/v1/" + fornecedor.id + "/", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(function (r) {
            if (!r.ok)
                throw new Error('Erro ao salvar');
            return r.json();
        })
            .then(function (updated) {
            setFornecedores(function (prev) {
                return prev.map(function (f) { return f.id === updated.id ? updated : f; });
            });
            onClose();
        })["catch"](console.error);
    };
    return (React.createElement("div", { className: "modal-overlay" },
        React.createElement("div", { className: "modal-forn wide" },
            React.createElement("h2", null, "Editar Fornecedor"),
            React.createElement("div", { className: "form-grid" },
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Nome", name: "nome", value: form.nome, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "CNPJ", name: "cnpj", value: form.cnpj, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Telefone", name: "telefone", value: form.telefone, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-12" },
                    React.createElement("label", null, "Descri\u00E7\u00E3o"),
                    React.createElement("textarea", { name: "descricao", value: form.descricao, onChange: handleChange, rows: 3 })),
                React.createElement("div", { className: "grid-col-12" },
                    React.createElement("label", null, "Produtos"),
                    React.createElement("select", { name: "produtos", multiple: true, value: form.produtos.map(function (id) { return id.toString(); }), onChange: handleChange }, produtos.map(function (p) { return (React.createElement("option", { key: p.id, value: p.id.toString() }, p.nome)); })))),
            React.createElement("div", { className: "modal-buttons" },
                React.createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar"),
                React.createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")))));
}
exports["default"] = ModalFornecedor;
