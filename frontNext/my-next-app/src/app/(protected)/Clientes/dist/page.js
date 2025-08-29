'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var TabelaClientes_1 = require("@/components/TabelaClientes");
var ModalCliente_1 = require("@/components/ModalCliente");
var ModalNovoCliente_1 = require("@/components/ModalNovoCliente");
require("@/styles/components/modalNovoCliente.css");
function ClientesPage() {
    var _a = react_1.useState([]), clientes = _a[0], setClientes = _a[1];
    var _b = react_1.useState(null), clienteSelecionado = _b[0], setClienteSel = _b[1];
    var _c = react_1.useState(false), showNovo = _c[0], setShowNovo = _c[1];
    react_1.useEffect(function () {
        fetch('http://127.0.0.1:8000/pessoas/api/v1/')
            .then(function (res) { return res.json(); })
            .then(function (data) { return setClientes(data); });
    }, []);
    return (React.createElement("div", { className: "clientes-page" },
        React.createElement("div", { className: "clientes-header" },
            React.createElement("h1", null, "\uD83D\uDC64 Clientes")),
        React.createElement(TabelaClientes_1["default"], { clientes: clientes, onSelecionar: setClienteSel, onNovo: function () { return setShowNovo(true); } }),
        clienteSelecionado && (React.createElement(ModalCliente_1["default"], { cliente: clienteSelecionado, onClose: function () { return setClienteSel(null); }, setClientes: setClientes })),
        showNovo && (React.createElement(ModalNovoCliente_1["default"], { onClose: function () { return setShowNovo(false); }, setClientes: setClientes }))));
}
exports["default"] = ClientesPage;
