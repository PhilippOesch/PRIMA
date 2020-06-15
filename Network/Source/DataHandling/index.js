System.register(["./ClientDataType", "./ServerRoom", "./UiElementHandler", "./Enumerators/MessageTypeEnumerators"], function (exports_1, context_1) {
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
            function (ClientDataType_1_1) {
                exportStar_1(ClientDataType_1_1);
            },
            function (ServerRoom_1_1) {
                exportStar_1(ServerRoom_1_1);
            },
            function (UiElementHandler_1_1) {
                exportStar_1(UiElementHandler_1_1);
            },
            function (MessageTypeEnumerators_1_1) {
                exportStar_1(MessageTypeEnumerators_1_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=index.js.map