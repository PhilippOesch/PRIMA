System.register(["./ClientManagerSinglePeer", "./ClientManagerPureWebSocket", "./ClientManagerAuthoritativeStructure", "./ClientManagerFullMeshStructure"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [
            function (ClientManagerSinglePeer_1_1) {
                exportStar_1(ClientManagerSinglePeer_1_1);
            },
            function (ClientManagerPureWebSocket_1_1) {
                exportStar_1(ClientManagerPureWebSocket_1_1);
            },
            function (ClientManagerAuthoritativeStructure_1_1) {
                exportStar_1(ClientManagerAuthoritativeStructure_1_1);
            },
            function (ClientManagerFullMeshStructure_1_1) {
                exportStar_1(ClientManagerFullMeshStructure_1_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=index.js.map