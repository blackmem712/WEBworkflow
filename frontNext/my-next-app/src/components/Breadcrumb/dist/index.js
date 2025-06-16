'use client';
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
require("@/styles/components/breadcrumb.css");
function Breadcrumb() {
    var pathname = navigation_1.usePathname() || '/';
    var segments = pathname.split('/').filter(Boolean);
    // Monta crumbs: Home sempre, depois cada segmento
    var crumbs = __spreadArrays([
        { label: 'Home', href: '/' }
    ], segments.map(function (seg, idx) {
        var href = '/' + segments.slice(0, idx + 1).join('/');
        var label = seg.charAt(0).toUpperCase() + seg.slice(1);
        return { label: label, href: href };
    }));
    return (React.createElement("nav", { className: "breadcrumb" },
        React.createElement("ul", null, crumbs.map(function (crumb, i) { return (React.createElement("li", { key: i },
            i > 0 && React.createElement("span", { className: "sep" }, "/"),
            i < crumbs.length - 1 ? (React.createElement(link_1["default"], { href: crumb.href, className: "crumb-link" }, crumb.label)) : (React.createElement("span", { className: "crumb-current" }, crumb.label)))); }))));
}
exports["default"] = Breadcrumb;
