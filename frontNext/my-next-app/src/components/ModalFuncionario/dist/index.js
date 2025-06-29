// src/components/ModalFuncionario.tsx
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var react_1 = require("react");
var InputCampo_1 = require("@/components/InputCampo");
var buton_1 = require("@/components/buton");
require("@/styles/components/modalFuncionario.css");
function ModalFuncionario(_a) {
    var funcionario = _a.funcionario, onClose = _a.onClose, setFuncionarios = _a.setFuncionarios, cargos = _a.cargos, setores = _a.setores;
    // separa o vínculo de cargo/​setor do restante
    var cargo_funcionario = funcionario.cargo_funcionario, base = __rest(funcionario, ["cargo_funcionario"]);
    var _b = react_1.useState({
        nome: base.nome,
        cpf: base.cpf,
        email: base.email,
        cep: base.cep,
        rua: base.rua,
        numero: base.numero,
        bairro: base.bairro,
        cidade: base.cidade,
        estado: base.estado,
        telefone: base.telefone,
        cargo: (cargo_funcionario === null || cargo_funcionario === void 0 ? void 0 : cargo_funcionario.cargo) ? Number(cargo_funcionario.cargo) : null,
        setor: (cargo_funcionario === null || cargo_funcionario === void 0 ? void 0 : cargo_funcionario.setor) ? Number(cargo_funcionario.setor) : null
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
        fetch("http://127.0.0.1:8000/funcionarios/api/v1/" + funcionario.id + "/", {
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
            setFuncionarios(function (prev) {
                return prev.map(function (f) { return (f.id === updated.id ? updated : f); });
            });
            onClose();
        })["catch"](console.error);
    };
    return (react_1["default"].createElement("div", { className: "modal-overlay" },
        react_1["default"].createElement("div", { className: "modal-func wide" },
            react_1["default"].createElement("h2", null, "Editar Funcion\u00E1rio"),
            react_1["default"].createElement("div", { className: "form-grid" },
                react_1["default"].createElement("div", { className: "grid-col-12" },
                    react_1["default"].createElement(InputCampo_1["default"], { label: "Nome", name: "nome", value: form.nome, onChange: handleChange, placeholder: "Nome do funcion\u00E1rio" })),
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
                        cargos.map(function (c) { return (react_1["default"].createElement("option", { key: c.id, value: c.id.toString() }, c.cargo)); }))),
                react_1["default"].createElement("div", { className: "grid-col-6" },
                    react_1["default"].createElement("label", { htmlFor: "setor" }, "Setor"),
                    react_1["default"].createElement("select", { id: "setor", name: "setor", value: form.setor != null ? form.setor.toString() : '', onChange: handleChange },
                        react_1["default"].createElement("option", { value: "" }, "Selecione..."),
                        setores.map(function (s) { return (react_1["default"].createElement("option", { key: s.id, value: s.id.toString() }, s.setor)); })))),
            react_1["default"].createElement("div", { className: "modal-buttons" },
                react_1["default"].createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar"),
                react_1["default"].createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")))));
}
exports["default"] = ModalFuncionario;
