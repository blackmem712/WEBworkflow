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
exports.clearTokens = exports.setTokens = exports.getRefreshToken = exports.getAccessToken = exports.api = void 0;
var axios_1 = require("axios");
var API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
exports.api = axios_1["default"].create({
    baseURL: API_BASE
});
// ------- Token storage helpers -------
var ACCESS_KEY = 'jwt_access';
var REFRESH_KEY = 'jwt_refresh';
function getAccessToken() {
    if (typeof window === 'undefined')
        return null;
    return localStorage.getItem(ACCESS_KEY);
}
exports.getAccessToken = getAccessToken;
function getRefreshToken() {
    if (typeof window === 'undefined')
        return null;
    return localStorage.getItem(REFRESH_KEY);
}
exports.getRefreshToken = getRefreshToken;
function setTokens(access, refresh) {
    if (typeof window === 'undefined')
        return;
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
}
exports.setTokens = setTokens;
function clearTokens() {
    if (typeof window === 'undefined')
        return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
}
exports.clearTokens = clearTokens;
// ------- Request: injeta Authorization -------
exports.api.interceptors.request.use(function (config) {
    var token = getAccessToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});
// ------- Response: auto‑refresh quando 401 -------
var refreshing = false;
var queue = [];
function refreshToken() {
    return __awaiter(this, void 0, void 0, function () {
        var refresh, resp, _a, access, newRefresh;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    refresh = getRefreshToken();
                    if (!refresh)
                        throw new Error('no-refresh');
                    return [4 /*yield*/, axios_1["default"].post(API_BASE + "/auth/token/refresh/", { refresh: refresh })];
                case 1:
                    resp = _b.sent();
                    _a = resp.data, access = _a.access, newRefresh = _a.refresh;
                    setTokens(access, newRefresh !== null && newRefresh !== void 0 ? newRefresh : refresh);
                    return [2 /*return*/, access];
            }
        });
    });
}
exports.api.interceptors.response.use(function (resp) { return resp; }, function (error) { return __awaiter(void 0, void 0, void 0, function () {
    var status, original, newAccess, e_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                status = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status;
                original = error.config;
                if (!(status === 401 && !original._retry)) return [3 /*break*/, 6];
                if (!refreshing) return [3 /*break*/, 2];
                return [4 /*yield*/, new Promise(function (ok) { return queue.push(ok); })];
            case 1:
                _b.sent();
                original.headers.Authorization = "Bearer " + getAccessToken();
                original._retry = true;
                return [2 /*return*/, exports.api(original)];
            case 2:
                _b.trys.push([2, 4, 5, 6]);
                refreshing = true;
                return [4 /*yield*/, refreshToken()];
            case 3:
                newAccess = _b.sent();
                queue.forEach(function (ok) { return ok(); });
                queue = [];
                original.headers.Authorization = "Bearer " + newAccess;
                original._retry = true;
                return [2 /*return*/, exports.api(original)];
            case 4:
                e_1 = _b.sent();
                clearTokens();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return [2 /*return*/, Promise.reject(e_1)];
            case 5:
                refreshing = false;
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/, Promise.reject(error)];
        }
    });
}); });
