'use client';
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
function NavLink(_a) {
    var href = _a.href, children = _a.children;
    var pathname = navigation_1.usePathname();
    var active = pathname === href;
    return (React.createElement(link_1["default"], { href: href, style: {
            padding: '8px 12px',
            borderRadius: 8,
            textDecoration: 'none',
            background: active ? '#111' : '#f3f4f6',
            color: active ? '#fff' : '#111',
            fontWeight: active ? 600 : 500
        } }, children));
}
exports["default"] = NavLink;
