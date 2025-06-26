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
require("@/styles/components/modalFuncionario.css");
// Labels legíveis para cada código
var CARGO_LABELS = {
    TC: 'Técnico',
    GE: 'Gerente',
    RC: 'Recepcionista'
};
var SETOR_LABELS = {
    RE: 'Recepção',
    OF: 'Oficina',
    ES: 'Estoque'
};
function ModalNovoFuncionario(_a) {
    var onClose = _a.onClose, setFuncionarios = _a.setFuncionarios, cargos = _a.cargos, setores = _a.setores;
    var _b = react_1.useState({
        nome: null,
        cpf: null,
        email: null,
        cep: null,
        rua: null,
        numero: null,
        bairro: null,
        cidade: null,
        estado: null,
        telefone: null,
        cargo: null,
        setor: null
    }), form = _b[0], setForm = _b[1];
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setForm(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = ['cep', 'numero', 'cargo', 'setor'].includes(name)
                ? (value === '' ? null : Number(value))
                : (value || null), _a)));
        });
    };
    var handleSalvar = function () {
        fetch('http://127.0.0.1:8000/funcionarios/api/v1/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error('Erro ao criar funcionário');
            return res.json();
        })
            .then(function (novo) {
            setFuncionarios(function (prev) { return __spreadArrays(prev, [novo]); });
            onClose();
        })["catch"](console.error);
    };
    return (react_1["default"].createElement("div", { className: "modal-overlay" },
        react_1["default"].createElement("div", { className: "modal-func wide" },
            react_1["default"].createElement("h2", null, "Novo Funcion\u00E1rio"),
            react_1["default"].createElement("div", { className: "form-grid" },
                react_1["default"].createElement("div", { className: "grid-col-12" },
                    react_1["default"].createElement(InputCampo_1["default"], { label: "Nome", name: "nome", value: form.nome, onChange: handleChange, placeholder: "Nome completo" })),
                react_1["default"].createElement("div", { className: "grid-col-12" },
                    react_1["default"].createElement(InputCampo_1["default"], { label: "Email", name: "email", type: "email", value: form.email, onChange: handleChange, placeholder: "email@exemplo.com" })),
                react_1["default"].createElement("div", { className: "grid-col-4" },
                    react_1["default"].createElement(InputCampo_1["default"], { label: "CPF", name: "cpf", value: form.cpf, onChange: handleChange, placeholder: "00000000000" })),
                react_1["default"].createElement("div", { className: "grid-col-4" },
                    react_1["default"].createElement(InputCampo_1["default"], { label: "Telefone", name: "telefone", value: form.telefone, onChange: handleChange, placeholder: "(00) 00000-0000" })),
                react_1["default"].createElement("div", { className: "grid-col-4" },
                    react_1["default"].createElement(InputCampo_1["default"], { label: "CEP", name: "cep", value: form.cep, onChange: handleChange, placeholder: "00000-000" })),
                react_1["default"].createElement("div", { className: "grid-col-8" },
                    react_1["default"].createElement(InputCampo_1["default"], { label: "Rua", name: "rua", value: form.rua, onChange: handleChange, placeholder: "Nome da rua" })),
                react_1["default"].createElement("div", { className: "grid-col-4" },
                    react_1["default"].createElement(InputCampo_1["default"], { label: "N\u00FAmero", name: "numero", value: form.numero, onChange: handleChange, placeholder: "123" })),
                react_1["default"].createElement("div", { className: "grid-col-4" },
                    react_1["default"].createElement(InputCampo_1["default"], { label: "Bairro", name: "bairro", value: form.bairro, onChange: handleChange, placeholder: "Seu bairro" })),
                react_1["default"].createElement("div", { className: "grid-col-4" },
                    react_1["default"].createElement(InputCampo_1["default"], { label: "Cidade", name: "cidade", value: form.cidade, onChange: handleChange, placeholder: "Sua cidade" })),
                react_1["default"].createElement("div", { className: "grid-col-4" },
                    react_1["default"].createElement(InputCampo_1["default"], { label: "Estado", name: "estado", value: form.estado, onChange: handleChange, placeholder: "Seu estado" })),
                react_1["default"].createElement("div", { className: "grid-col-6" },
                    react_1["default"].createElement("label", { htmlFor: "cargo" }, "Cargo"),
                    react_1["default"].createElement("select", { id: "cargo", name: "cargo", value: form.cargo != null ? form.cargo.toString() : '', onChange: handleChange },
                        react_1["default"].createElement("option", { value: "" }, "Selecione..."),
                        cargos.map(function (c) { return (react_1["default"].createElement("option", { key: c.id, value: c.id.toString() }, CARGO_LABELS[c.cargo])); }))),
                react_1["default"].createElement("div", { className: "grid-col-6" },
                    react_1["default"].createElement("label", { htmlFor: "setor" }, "Setor"),
                    react_1["default"].createElement("select", { id: "setor", name: "setor", value: form.setor != null ? form.setor.toString() : '', onChange: handleChange },
                        react_1["default"].createElement("option", { value: "" }, "Selecione..."),
                        setores.map(function (s) { return (react_1["default"].createElement("option", { key: s.id, value: s.id.toString() }, SETOR_LABELS[s.setor])); })))),
            react_1["default"].createElement("div", { className: "modal-buttons" },
                react_1["default"].createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar"),
                react_1["default"].createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")))));
}
exports["default"] = ModalNovoFuncionario;
