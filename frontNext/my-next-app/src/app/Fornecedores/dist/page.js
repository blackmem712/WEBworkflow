// src/app/fornecedores/page.tsx
'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var TabelaFornecedor_1 = require("@/components/TabelaFornecedor");
var ModalFornecedor_1 = require("@/components/ModalFornecedor");
var ModalNovoFornecedor_1 = require("@/components/ModalNovoFornecedor");
require("@/styles/fornecedores.css");
function FornecedoresPage() {
    var _a = react_1.useState([]), fornecedores = _a[0], setFornecedores = _a[1];
    var _b = react_1.useState([]), produtos = _b[0], setProdutos = _b[1];
    var _c = react_1.useState(null), selForn = _c[0], setSelForn = _c[1];
    var _d = react_1.useState(false), showNovo = _d[0], setShowNovo = _d[1];
    react_1.useEffect(function () {
        fetch('http://127.0.0.1:8000/fornecedores/api/v1/')
            .then(function (r) { return r.json(); })
            .then(function (data) { return setFornecedores(data); })["catch"](console.error);
        fetch('http://127.0.0.1:8000/produtos/api/v1/')
            .then(function (r) { return r.json(); })
            .then(function (data) { return setProdutos(data); })["catch"](console.error);
    }, []);
    return (React.createElement("div", { className: "forn-page" },
        React.createElement("div", { className: "forn-header" },
            React.createElement("h1", null, "\uD83C\uDFED Fornecedores")),
        React.createElement(TabelaFornecedor_1["default"], { fornecedores: fornecedores, produtos: produtos, onSelecionar: setSelForn, onNovo: function () { return setShowNovo(true); } }),
        selForn && (React.createElement(ModalFornecedor_1["default"], { fornecedor: selForn, produtos: produtos, onClose: function () { return setSelForn(null); }, setFornecedores: setFornecedores })),
        showNovo && (React.createElement(ModalNovoFornecedor_1["default"], { produtos: produtos, onClose: function () { return setShowNovo(false); }, setFornecedores: setFornecedores }))));
}
exports["default"] = FornecedoresPage;
