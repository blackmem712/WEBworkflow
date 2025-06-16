"use strict";
exports.__esModule = true;
exports.api = void 0;
var axios_1 = require("axios");
exports.api = axios_1["default"].create({
    baseURL: 'http://127.0.0.1:8000'
});
