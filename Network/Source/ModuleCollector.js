System.register(["./NetworkMessages", "./DataHandling", "./ClientManagers", "./Server"], function (exports_1, context_1) {
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
            function (NetworkMessages_1_1) {
                exportStar_1(NetworkMessages_1_1);
            },
            function (DataHandling_1_1) {
                exportStar_1(DataHandling_1_1);
            },
            function (ClientManagers_1_1) {
                exportStar_1(ClientManagers_1_1);
            },
            function (Server_1_1) {
                exportStar_1(Server_1_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=ModuleCollector.js.map