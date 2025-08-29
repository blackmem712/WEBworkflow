'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var index_1 = require("@/components/TabelaEquipamentos/index");
var index_2 = require("@/components/ModalEquipamento/index");
var index_3 = require("@/components/ModalNovoEquipamento/index");
require("@/styles/equipamentos.css");
function EquipamentosPage() {
    var _a = react_1.useState([]), equipamentos = _a[0], setEquipamentos = _a[1];
    var _b = react_1.useState([]), clientes = _b[0], setClientes = _b[1];
    var _c = react_1.useState(null), selEquip = _c[0], setSelEquip = _c[1];
    var _d = react_1.useState(false), showNovo = _d[0], setShowNovo = _d[1];
    // Fetch equipamentos
    react_1.useEffect(function () {
        fetch('http://127.0.0.1:8000/equipamentos/api/v1/')
            .then(function (r) { return r.json(); })
            .then(function (data) { return setEquipamentos(data); })["catch"](console.error);
    }, []);
    // Fetch clientes (para select)
    react_1.useEffect(function () {
        fetch('http://127.0.0.1:8000/pessoas/api/v1/')
            .then(function (r) { return r.json(); })
            .then(function (data) { return setClientes(data); })["catch"](console.error);
    }, []);
    return (React.createElement("div", { className: "equip-page" },
        React.createElement("div", { className: "equip-header" },
            React.createElement("h1", null, "\uD83E\uDDF0 Equipamentos")),
        React.createElement(index_1["default"], { equipamentos: equipamentos, clientes: clientes, onSelecionar: setSelEquip, onNovo: function () { return setShowNovo(true); } }),
        selEquip && (React.createElement(index_2["default"], { equipamento: selEquip, clientes: clientes, onClose: function () { return setSelEquip(null); }, setEquipamentos: setEquipamentos, setClientes: setClientes })),
        showNovo && (React.createElement(index_3["default"], { onClose: function () { return setShowNovo(false); }, setEquipamentos: setEquipamentos, clientes: clientes, setClientes: setClientes }))));
}
exports["default"] = EquipamentosPage;
