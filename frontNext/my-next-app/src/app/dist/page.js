"use strict";
exports.__esModule = true;
var navigation_1 = require("next/navigation");
function Home() {
    navigation_1.redirect('/(protected)');
}
exports["default"] = Home;
