"use strict";
exports.__esModule = true;
require("@/styles/layout.css");
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "pt-br" },
        React.createElement("body", null,
            React.createElement("div", { className: "layout" },
                React.createElement("main", { className: "content" }, children)))));
}
exports["default"] = RootLayout;
