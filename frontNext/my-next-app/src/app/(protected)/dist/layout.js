'use client';
"use strict";
exports.__esModule = true;
var AuthGuard_1 = require("@/components/AuthGuard/AuthGuard");
var AppHeader_1 = require("@/components/AppHeader/AppHeader");
function ProtectedLayout(_a) {
    var children = _a.children;
    return (React.createElement(AuthGuard_1["default"], null,
        React.createElement(AppHeader_1["default"], null),
        React.createElement("main", { style: { padding: 16, maxWidth: 1200, margin: '0 auto' } }, children)));
}
exports["default"] = ProtectedLayout;
