// src/components/ModalProduto.tsx
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
require("@/styles/components/modalProduto.css");
function ModalProduto(_a) {
    var produto = _a.produto, onClose = _a.onClose, setProdutos = _a.setProdutos;
    var _b = react_1.useState({
        nome: produto.nome,
        marca: produto.marca,
        modelo: produto.modelo,
        preco: produto.preco,
        descricao: produto.descricao
    }), form = _b[0], setForm = _b[1];
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setForm(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = name === 'preco'
                ? Number(value)
                : value, _a)));
        });
    };
    var handleSalvar = function () {
        fetch("http://127.0.0.1:8000/produtos/api/v1/" + produto.id + "/", {
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
            setProdutos(function (prev) {
                return prev.map(function (p) { return p.id === updated.id ? updated : p; });
            });
            onClose();
        })["catch"](console.error);
    };
    return (React.createElement("div", { className: "modal-overlay" },
        React.createElement("div", { className: "modal-prod wide" },
            React.createElement("h2", null, "Editar Produto"),
            React.createElement("div", { className: "form-grid" },
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Nome", name: "nome", value: form.nome, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Marca", name: "marca", value: form.marca, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Modelo", name: "modelo", value: form.modelo, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Pre\u00E7o (R$)", name: "preco", type: "number", value: form.preco, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-12" },
                    React.createElement("label", null, "Descri\u00E7\u00E3o"),
                    React.createElement("textarea", { name: "descricao", value: form.descricao, onChange: handleChange, rows: 3 }))),
            React.createElement("div", { className: "modal-buttons" },
                React.createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar"),
                React.createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")))));
}
exports["default"] = ModalProduto;
