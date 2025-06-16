"use strict";
exports.__esModule = true;
// components/InputCampo.tsx
require("@/styles/components/inputCampo.css");
function InputCampo(_a) {
    var label = _a.label, name = _a.name, value = _a.value, onChange = _a.onChange, _b = _a.type, type = _b === void 0 ? 'text' : _b, _c = _a.placeholder, placeholder = _c === void 0 ? '' : _c;
    // converte null ou undefined em string vazia
    var val = value == null ? '' : value;
    return (React.createElement("div", { className: "input-group" },
        React.createElement("label", { htmlFor: name }, label),
        React.createElement("input", { id: name, name: name, type: type, value: val, onChange: onChange, placeholder: placeholder })));
}
exports["default"] = InputCampo;
