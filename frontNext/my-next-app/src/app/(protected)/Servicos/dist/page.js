'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var TabelaServicos_1 = require("@/components/TabelaServicos");
var ModalServico_1 = require("@/components/ModalServico");
var ModalNovoServico_1 = require("@/components/ModalNovoServico");
require("@/styles/servicos.css");
function ServicosPage() {
    var _a = react_1.useState([]), servicos = _a[0], setServicos = _a[1];
    var _b = react_1.useState(null), selServico = _b[0], setSelServico = _b[1];
    var _c = react_1.useState(false), showNovo = _c[0], setShowNovo = _c[1];
    react_1.useEffect(function () {
        fetch('http://127.0.0.1:8000/servicos/api/v1/')
            .then(function (r) { return r.json(); })
            .then(function (data) { return setServicos(data); })["catch"](console.error);
    }, []);
    return (React.createElement("div", { className: "serv-page" },
        React.createElement("div", { className: "serv-header" },
            React.createElement("h1", null, "\uD83D\uDEE0\uFE0F Servi\u00E7os")),
        React.createElement(TabelaServicos_1["default"], { servicos: servicos, onSelecionar: setSelServico, onNovo: function () { return setShowNovo(true); } }),
        selServico && (React.createElement(ModalServico_1["default"], { servico: selServico, onClose: function () { return setSelServico(null); }, setServicos: setServicos })),
        showNovo && (React.createElement(ModalNovoServico_1["default"], { onClose: function () { return setShowNovo(false); }, setServicos: setServicos }))));
}
exports["default"] = ServicosPage;
