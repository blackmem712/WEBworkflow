'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var TabelaFuncionario_1 = require("@/components/TabelaFuncionario");
var ModalFuncionario_1 = require("@/components/ModalFuncionario");
var ModalNovoFuncionario_1 = require("@/components/ModalNovoFuncionario");
require("@/styles/funcionarios.css");
function FuncionariosPage() {
    var _a = react_1.useState([]), funcionarios = _a[0], setFuncionarios = _a[1];
    var _b = react_1.useState([]), cargos = _b[0], setCargos = _b[1];
    var _c = react_1.useState([]), setores = _c[0], setSetores = _c[1];
    var _d = react_1.useState(null), selFunc = _d[0], setSelFunc = _d[1];
    var _e = react_1.useState(false), showNovo = _e[0], setShowNovo = _e[1];
    react_1.useEffect(function () {
        fetch('http://127.0.0.1:8000/funcionarios/api/v1/')
            .then(function (r) { return r.json(); })
            .then(function (data) { return setFuncionarios(data); })["catch"](console.error);
        fetch('http://127.0.0.1:8000/cargos/api/v1/')
            .then(function (r) { return r.json(); })
            .then(function (data) { return setCargos(data); })["catch"](console.error);
        fetch('http://127.0.0.1:8000/setores/api/v1/')
            .then(function (r) { return r.json(); })
            .then(function (data) { return setSetores(data); })["catch"](console.error);
    }, []);
    return (React.createElement("div", { className: "func-page" },
        React.createElement("div", { className: "func-header" },
            React.createElement("h1", null, "\uD83D\uDC54 Funcion\u00E1rios")),
        React.createElement(TabelaFuncionario_1["default"], { funcionarios: funcionarios, cargos: cargos, setores: setores, onSelecionar: setSelFunc, onNovo: function () { return setShowNovo(true); } }),
        selFunc && (React.createElement(ModalFuncionario_1["default"], { funcionario: selFunc, cargos: cargos, setores: setores, onClose: function () { return setSelFunc(null); }, setFuncionarios: setFuncionarios })),
        showNovo && (React.createElement(ModalNovoFuncionario_1["default"], { onClose: function () { return setShowNovo(false); }, setFuncionarios: setFuncionarios, cargos: cargos, setores: setores }))));
}
exports["default"] = FuncionariosPage;
