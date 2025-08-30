// src/components/AuthGuard.tsx
'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var api_1 = require("@/services/api");
function AuthGuard(_a) {
    var children = _a.children;
    var router = navigation_1.useRouter();
    var _b = react_1.useState(false), ready = _b[0], setReady = _b[1];
    react_1.useEffect(function () {
        var hasCookie = typeof document !== 'undefined' && document.cookie.includes('auth=1');
        var hasToken = !!api_1.getAccessToken();
        if (!hasCookie || !hasToken) {
            router.replace('/login');
        }
        else {
            setReady(true);
        }
    }, [router]);
    if (!ready)
        return null;
    return React.createElement(React.Fragment, null, children);
}
exports["default"] = AuthGuard;
