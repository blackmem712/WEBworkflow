// src/app/(protected)/layout.tsx
'use client';
"use strict";
exports.__esModule = true;
var dynamic_1 = require("next/dynamic");
require("@/styles/layout.css"); // importa o CSS global que você mostrou
// a sua Sidebar; se ela já renderiza os links, ótimo
var Sidebar = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require('@/components/Sidebar'); }); }, { ssr: false });
function ProtectedLayout(_a) {
    var children = _a.children;
    return (React.createElement("div", { className: "layout-container" },
        React.createElement("div", { className: "sidebar-hover" },
            React.createElement(Sidebar, null)),
        React.createElement("main", { className: "layout-content" }, children)));
}
exports["default"] = ProtectedLayout;
