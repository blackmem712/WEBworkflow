/* components/Button.tsx */
'use client';
"use strict";
exports.__esModule = true;
require("@/styles/components/buton.css");
function Button(_a) {
    var onClick = _a.onClick, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, children = _a.children;
    return (React.createElement("button", { className: "btn btn-" + variant, onClick: onClick }, children));
}
exports["default"] = Button;
