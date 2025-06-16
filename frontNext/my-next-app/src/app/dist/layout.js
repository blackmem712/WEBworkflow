"use strict";
exports.__esModule = true;
// app/layout.tsx
// app/layout.tsx
var Sidebar_1 = require("@/components/Sidebar");
require("@/styles/layout.css");
var Breadcrumb_1 = require("@/components/Breadcrumb");
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "pt-br" },
        React.createElement("body", null,
            React.createElement("div", { className: "layout-container" },
                React.createElement(Sidebar_1["default"], null),
                React.createElement("main", { className: "layout-content" },
                    React.createElement(Breadcrumb_1["default"], null),
                    children)))));
}
exports["default"] = RootLayout;
