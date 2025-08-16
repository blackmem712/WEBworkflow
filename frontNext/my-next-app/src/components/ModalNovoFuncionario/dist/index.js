// src/components/ModalNovoFuncionario/index.tsx
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
        telefone: null
    }), form = _b[0], setForm = _b[1];
    // ⚠️ controla selects como string; converte para number no salvar
    var _c = react_1.useState(''), cargoId = _c[0], setCargoId = _c[1]; // '' = não selecionado
    var _d = react_1.useState(''), setorId = _d[0], setSetorId = _d[1];
    // Fallback/local cache das listas (caso venham vazias por props)
    var _e = react_1.useState(cargos !== null && cargos !== void 0 ? cargos : []), cargosData = _e[0], setCargosData = _e[1];
    var _f = react_1.useState(setores !== null && setores !== void 0 ? setores : []), setoresData = _f[0], setSetoresData = _f[1];
    var _g = react_1.useState(false), loadingCargos = _g[0], setLoadingCargos = _g[1];
    var _h = react_1.useState(false), loadingSetores = _h[0], setLoadingSetores = _h[1];
    // Sincroniza quando o pai carregar depois de abrir o modal
    react_1.useEffect(function () { setCargosData(cargos !== null && cargos !== void 0 ? cargos : []); }, [cargos]);
    react_1.useEffect(function () { setSetoresData(setores !== null && setores !== void 0 ? setores : []); }, [setores]);
    // Busca fallback se abrir o modal antes do carregamento do pai
    react_1.useEffect(function () {
        if (!cargos || cargos.length === 0) {
            setLoadingCargos(true);
            fetch('http://127.0.0.1:8000/cargos/api/v1/')
                .then(function (r) { return r.json(); })
                .then(function (data) { return setCargosData(data); })["catch"](console.error)["finally"](function () { return setLoadingCargos(false); });
        }
        if (!setores || setores.length === 0) {
            setLoadingSetores(true);
            fetch('http://127.0.0.1:8000/setores/api/v1/')
                .then(function (r) { return r.json(); })
                .then(function (data) { return setSetoresData(data); })["catch"](console.error)["finally"](function () { return setLoadingSetores(false); });
        }
        // só dispara na montagem
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        if (name === 'cep' || name === 'numero') {
            setForm(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = value === '' ? null : Number(value), _a)));
            });
        }
        else {
            setForm(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = value || null, _a)));
            });
        }
    };
    var handleSalvar = function () {
        if (!cargoId || !setorId) {
            alert('Selecione um Cargo e um Setor.');
            return;
        }
        var payload = __assign(__assign({}, form), { cargo: Number(cargoId), setor: Number(setorId) });
        fetch('http://127.0.0.1:8000/funcionarios/api/v1/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error('Erro ao criar funcionário');
            return res.json();
        })
            .then(function (novo) {
            setFuncionarios(function (prev) { return __spreadArrays(prev, [novo]); });
            onClose();
        })["catch"](function (err) {
            console.error(err);
            alert('Não foi possível salvar. Verifique os campos.');
        });
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
                    react_1["default"].createElement("select", { id: "cargo", value: cargoId, onChange: function (e) { return setCargoId(e.target.value); }, disabled: loadingCargos },
                        react_1["default"].createElement("option", { value: "" }, loadingCargos ? 'Carregando...' : 'Selecione...'),
                        cargosData.map(function (c) {
                            var _a;
                            return (react_1["default"].createElement("option", { key: c.id, value: String(c.id) }, (_a = CARGO_LABELS[c.cargo]) !== null && _a !== void 0 ? _a : c.cargo));
                        })),
                    (!loadingCargos && cargosData.length === 0) && (react_1["default"].createElement("small", { className: "hint" }, "Nenhum cargo encontrado."))),
                react_1["default"].createElement("div", { className: "grid-col-6" },
                    react_1["default"].createElement("label", { htmlFor: "setor" }, "Setor"),
                    react_1["default"].createElement("select", { id: "setor", value: setorId, onChange: function (e) { return setSetorId(e.target.value); }, disabled: loadingSetores },
                        react_1["default"].createElement("option", { value: "" }, loadingSetores ? 'Carregando...' : 'Selecione...'),
                        setoresData.map(function (s) {
                            var _a;
                            return (react_1["default"].createElement("option", { key: s.id, value: String(s.id) }, (_a = SETOR_LABELS[s.setor]) !== null && _a !== void 0 ? _a : s.setor));
                        })),
                    (!loadingSetores && setoresData.length === 0) && (react_1["default"].createElement("small", { className: "hint" }, "Nenhum setor encontrado.")))),
            react_1["default"].createElement("div", { className: "modal-buttons" },
                react_1["default"].createElement(buton_1["default"], { variant: "primary", onClick: handleSalvar }, "Salvar"),
                react_1["default"].createElement(buton_1["default"], { variant: "danger", onClick: onClose }, "Cancelar")))));
}
exports["default"] = ModalNovoFuncionario;
