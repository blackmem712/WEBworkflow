'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var TabelaOrcamentos_1 = require("@/components/TabelaOrcamentos");
var ModalOrcamento_1 = require("@/components/ModalOrcamento");
var ModalNovoOrcamento_1 = require("@/components/ModalNovoOrcamento");
require("@/styles/orcamentos.css");
function OrcamentosPage() {
    var _a = react_1.useState([]), orcamentos = _a[0], setOrcamentos = _a[1];
    var _b = react_1.useState([]), equipamentos = _b[0], setEquipamentos = _b[1];
    var _c = react_1.useState([]), servicos = _c[0], setServicos = _c[1];
    var _d = react_1.useState([]), produtos = _d[0], setProdutos = _d[1];
    var _e = react_1.useState([]), funcionarios = _e[0], setFuncionarios = _e[1];
    var _f = react_1.useState(null), selOrc = _f[0], setSelOrc = _f[1];
    var _g = react_1.useState(false), showNovo = _g[0], setShowNovo = _g[1];
    react_1.useEffect(function () {
        fetch('http://127.0.0.1:8000/orcamentos/api/v1/')
            .then(function (r) { return r.json(); }).then(function (data) { return setOrcamentos(data); })["catch"](console.error);
        fetch('http://127.0.0.1:8000/equipamentos/api/v1/')
            .then(function (r) { return r.json(); }).then(function (data) { return setEquipamentos(data); })["catch"](console.error);
        fetch('http://127.0.0.1:8000/servicos/api/v1/')
            .then(function (r) { return r.json(); }).then(function (data) { return setServicos(data); })["catch"](console.error);
        fetch('http://127.0.0.1:8000/produtos/api/v1/')
            .then(function (r) { return r.json(); }).then(function (data) { return setProdutos(data); })["catch"](console.error);
        fetch('http://127.0.0.1:8000/funcionarios/api/v1/')
            .then(function (r) { return r.json(); }).then(function (data) { return setFuncionarios(data); })["catch"](console.error);
    }, []);
    return (React.createElement("div", { className: "orc-page" },
        React.createElement("div", { className: "orc-header" },
            React.createElement("h1", null, "\uD83E\uDDFE Or\u00E7amentos")),
        React.createElement(TabelaOrcamentos_1["default"], { orcamentos: orcamentos, equipamentos: equipamentos, servicos: servicos, produtos: produtos, funcionarios: funcionarios, onSelecionar: setSelOrc, onNovo: function () { return setShowNovo(true); } }),
        selOrc && (React.createElement(ModalOrcamento_1["default"], { orcamento: selOrc, equipamentos: equipamentos, servicos: servicos, produtos: produtos, funcionarios: funcionarios, onClose: function () { return setSelOrc(null); }, setOrcamentos: setOrcamentos })),
        showNovo && (React.createElement(ModalNovoOrcamento_1["default"], { equipamentos: equipamentos, servicos: servicos, produtos: produtos, funcionarios: funcionarios, onClose: function () { return setShowNovo(false); }, setOrcamentos: setOrcamentos }))));
}
exports["default"] = OrcamentosPage;
