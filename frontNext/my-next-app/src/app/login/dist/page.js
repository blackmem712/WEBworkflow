'use client';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var api_1 = require("@/services/api");
var login_module_css_1 = require("@/app/login/login.module.css");
function LoginPage() {
    var _a = react_1.useState(''), username = _a[0], setUsername = _a[1];
    var _b = react_1.useState(''), password = _b[0], setPassword = _b[1];
    var _c = react_1.useState(false), showPass = _c[0], setShowPass = _c[1];
    var _d = react_1.useState(false), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState(null), error = _e[0], setError = _e[1];
    var router = navigation_1.useRouter();
    var search = navigation_1.useSearchParams();
    var next = search.get('next');
    function handleSubmit(e) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var resp, _c, access, refresh, err_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        e.preventDefault();
                        setLoading(true);
                        setError(null);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, api_1.api.post('/auth/token/', { username: username, password: password })];
                    case 2:
                        resp = _d.sent();
                        _c = resp.data, access = _c.access, refresh = _c.refresh;
                        api_1.setTokens(access, refresh);
                        // cookie leve para o middleware decidir (não é segurança, é UX)
                        document.cookie = 'auth=1; path=/; max-age=604800; samesite=lax'; // 7 dias
                        router.push(next && next.startsWith('/') ? next : '/');
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _d.sent();
                        setError(((_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || 'Usuário ou senha inválidos');
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("div", { className: login_module_css_1["default"].page },
        React.createElement("div", { className: login_module_css_1["default"].card },
            React.createElement("div", { className: login_module_css_1["default"].brand },
                React.createElement("div", { className: login_module_css_1["default"].logo }),
                React.createElement("h1", null, "Entrar"),
                React.createElement("p", { className: login_module_css_1["default"].sub }, "Acesse sua conta para continuar")),
            React.createElement("form", { onSubmit: handleSubmit, className: login_module_css_1["default"].form },
                React.createElement("label", { className: login_module_css_1["default"].label },
                    "Usu\u00E1rio",
                    React.createElement("input", { className: login_module_css_1["default"].input, placeholder: "seu usu\u00E1rio", autoComplete: "username", value: username, onChange: function (e) { return setUsername(e.target.value); } })),
                React.createElement("label", { className: login_module_css_1["default"].label },
                    "Senha",
                    React.createElement("div", { className: login_module_css_1["default"].passWrap },
                        React.createElement("input", { className: login_module_css_1["default"].input, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", type: showPass ? 'text' : 'password', autoComplete: "current-password", value: password, onChange: function (e) { return setPassword(e.target.value); } }),
                        React.createElement("button", { type: "button", className: login_module_css_1["default"].toggle, onClick: function () { return setShowPass(function (v) { return !v; }); }, "aria-label": showPass ? 'Ocultar senha' : 'Mostrar senha' }, showPass ? 'Ocultar' : 'Mostrar'))),
                error && React.createElement("div", { className: login_module_css_1["default"].error }, error),
                React.createElement("button", { type: "submit", className: login_module_css_1["default"].submit, disabled: loading }, loading ? 'Entrando…' : 'Entrar')),
            React.createElement("div", { className: login_module_css_1["default"].tips },
                React.createElement("span", null, "Dica: use o usu\u00E1rio/grupo correto (TC, GE ou RC) conforme seu perfil.")))));
}
exports["default"] = LoginPage;
