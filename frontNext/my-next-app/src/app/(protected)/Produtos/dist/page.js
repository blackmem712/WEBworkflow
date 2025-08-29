// src/app/produtos/page.tsx
'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var TabelaProdutos_1 = require("@/components/TabelaProdutos");
var ModalProduto_1 = require("@/components/ModalProduto");
var ModalNovoProduto_1 = require("@/components/ModalNovoProduto");
require("@/styles/produtos.css");
function ProdutosPage() {
    var _a = react_1.useState([]), produtos = _a[0], setProdutos = _a[1];
    var _b = react_1.useState(null), selProd = _b[0], setSelProd = _b[1];
    var _c = react_1.useState(false), showNovo = _c[0], setShowNovo = _c[1];
    react_1.useEffect(function () {
        fetch('http://127.0.0.1:8000/produtos/api/v1/')
            .then(function (r) { return r.json(); })
            .then(function (data) { return setProdutos(data); })["catch"](console.error);
    }, []);
    return (React.createElement("div", { className: "prod-page" },
        React.createElement("div", { className: "prod-header" },
            React.createElement("h1", null, "\uD83D\uDCE6 Produtos")),
        React.createElement(TabelaProdutos_1["default"], { produtos: produtos, onSelecionar: setSelProd, onNovo: function () { return setShowNovo(true); } }),
        selProd && (React.createElement(ModalProduto_1["default"], { produto: selProd, onClose: function () { return setSelProd(null); }, setProdutos: setProdutos })),
        showNovo && (React.createElement(ModalNovoProduto_1["default"], { onClose: function () { return setShowNovo(false); }, setProdutos: setProdutos }))));
}
exports["default"] = ProdutosPage;
