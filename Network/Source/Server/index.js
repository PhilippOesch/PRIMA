System.register(["./FudgeServerAuthoritativeManager", "./FudgeServerAuthoritativeSignaling", "./FudgeServerSinglePeer", "./FudgeServerWebSocket", "./FudgeServerMeshNetwork"], function (exports_1, context_1) {
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
            function (FudgeServerAuthoritativeManager_1_1) {
                exportStar_1(FudgeServerAuthoritativeManager_1_1);
            },
            function (FudgeServerAuthoritativeSignaling_1_1) {
                exportStar_1(FudgeServerAuthoritativeSignaling_1_1);
            },
            function (FudgeServerSinglePeer_1_1) {
                exportStar_1(FudgeServerSinglePeer_1_1);
            },
            function (FudgeServerWebSocket_1_1) {
                exportStar_1(FudgeServerWebSocket_1_1);
            },
            function (FudgeServerMeshNetwork_1_1) {
                exportStar_1(FudgeServerMeshNetwork_1_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=index.js.map