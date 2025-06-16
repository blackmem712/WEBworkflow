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
require("@/styles/components/modalNovoCliente.css");
function ModalNovoCliente(_a) {
    var onClose = _a.onClose, setClientes = _a.setClientes;
    var _b = react_1.useState({
        nome: '',
        cpf: '',
        email: '',
        cep: null,
        rua: '',
        numero: null,
        bairro: '',
        cidade: '',
        estado: '',
        telefone: ''
    }), form = _b[0], setForm = _b[1];
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setForm(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = name === 'cep' || name === 'numero'
                ? (value === '' ? null : Number(value))
                : value, _a)));
        });
    };
    var handleSalvar = function () {
        fetch('http://127.0.0.1:8000/pessoas/api/v1/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error('Erro ao criar cliente');
            return res.json();
        })
            .then(function (novo) {
            setClientes(function (prev) { return __spreadArrays(prev, [novo]); });
            onClose();
        })["catch"](function (err) { return console.error(err); });
    };
    return (React.createElement("div", { className: "modal-overlay-novo" },
        React.createElement("div", { className: "modal-novo" },
            React.createElement("h2", null, "Novo Cliente"),
            React.createElement("div", { className: "form-grid" },
                React.createElement("div", { className: "grid-col-12" },
                    React.createElement(InputCampo_1["default"], { label: "Nome", name: "nome", value: form.nome, onChange: handleChange, placeholder: "Digite o nome" })),
                React.createElement("div", { className: "grid-col-12" },
                    React.createElement(InputCampo_1["default"], { label: "Email", name: "email", value: form.email, onChange: handleChange, placeholder: "email@exemplo.com" })),
                React.createElement("div", { className: "grid-col-4" },
                    React.createElement(InputCampo_1["default"], { label: "CPF", name: "cpf", value: form.cpf, onChange: handleChange, placeholder: "00000000000" })),
                React.createElement("div", { className: "grid-col-4" },
                    React.createElement(InputCampo_1["default"], { label: "CEP", name: "cep", value: form.cep, onChange: handleChange, placeholder: "00000-000" })),
                React.createElement("div", { className: "grid-col-4" },
                    React.createElement(InputCampo_1["default"], { label: "Telefone", name: "telefone", value: form.telefone, onChange: handleChange, placeholder: "(00) 00000-0000" })),
                React.createElement("div", { className: "grid-col-8" },
                    React.createElement(InputCampo_1["default"], { label: "Rua", name: "rua", value: form.rua, onChange: handleChange, placeholder: "Nome da rua" })),
                React.createElement("div", { className: "grid-col-4" },
                    React.createElement(InputCampo_1["default"], { label: "N\u00FAmero", name: "numero", value: form.numero, onChange: handleChange, placeholder: "123" })),
                React.createElement("div", { className: "grid-col-4" },
                    React.createElement(InputCampo_1["default"], { label: "Bairro", name: "bairro", value: form.bairro, onChange: handleChange, placeholder: "Seu bairro" })),
                React.createElement("div", { className: "grid-col-4" },
                    React.createElement(InputCampo_1["default"], { label: "Cidade", name: "cidade", value: form.cidade, onChange: handleChange, placeholder: "Sua cidade" })),
                React.createElement("div", { className: "grid-col-4" },
                    React.createElement(InputCampo_1["default"], { label: "Estado", name: "estado", value: form.estado, onChange: handleChange, placeholder: "Seu estado" }))),
            React.createElement("div", { className: "modal-novo-botoes" },
                React.createElement("button", { onClick: handleSalvar, className: "btn-salvar" }, "Salvar"),
                React.createElement("button", { onClick: onClose, className: "btn-cancelar" }, "Cancelar")))));
}
exports["default"] = ModalNovoCliente;
