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
var ModalNovoCliente_1 = require("@/components/ModalNovoCliente");
require("@/styles/components/modalEquipamento.css");
function ModalEquipamento(_a) {
    var equipamento = _a.equipamento, onClose = _a.onClose, setEquipamentos = _a.setEquipamentos, clientes = _a.clientes, setClientes = _a.setClientes;
    var _b = react_1.useState(__assign({}, equipamento)), form = _b[0], setForm = _b[1];
    var _c = react_1.useState(false), showCliente = _c[0], setShowCliente = _c[1];
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setForm(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = name === 'cliente' ? Number(value) : value, _a)));
        });
    };
    var handleSalvar = function () {
        fetch("http://127.0.0.1:8000/equipamentos/api/v1/" + equipamento.id + "/", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(function (r) {
            if (!r.ok)
                throw new Error('Erro');
            setEquipamentos(function (prev) {
                return prev.map(function (e) { return (e.id === equipamento.id ? __assign(__assign({}, e), form) : e); });
            });
            onClose();
        })["catch"](console.error);
    };
    return (React.createElement("div", { className: "modal-overlay" },
        React.createElement("div", { className: "modal-equip" },
            React.createElement("h2", null, "Editar Equipamento"),
            React.createElement("div", { className: "form-grid" },
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Equipamento", name: "equipamento", value: form.equipamento, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Marca", name: "marca", value: form.marca, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Modelo", name: "modelo", value: form.modelo, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "Cor", name: "cor", value: form.cor, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement(InputCampo_1["default"], { label: "N\u00BA S\u00E9rie", name: "nun_serie", value: form.nun_serie, onChange: handleChange })),
                React.createElement("div", { className: "grid-col-6" },
                    React.createElement("label", { htmlFor: "cliente" }, "Cliente"),
                    React.createElement("div", { className: "select-wrap" },
                        React.createElement("select", { name: "cliente", id: "cliente", value: form.cliente, onChange: handleChange },
                            React.createElement("option", { value: 0 }, "Selecione..."),
                            clientes.map(function (c) { return (React.createElement("option", { key: c.id, value: c.id }, c.nome)); })),
                        React.createElement(buton_1["default"], { variant: "secondary", onClick: function () { return setShowCliente(true); } }, "+ Cliente")))),
            React.createElement("div", { className: "modal-buttons" },
                React.createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar"),
                React.createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")),
            showCliente && (React.createElement(ModalNovoCliente_1["default"], { onClose: function () { return setShowCliente(false); }, setClientes: setClientes })))));
}
exports["default"] = ModalEquipamento;
