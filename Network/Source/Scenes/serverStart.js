System.register(["../ModuleCollector"], function (exports_1, context_1) {
    "use strict";
    var FudgeNetwork, isServer, networkClient, authoritativeSignalingServer;
    var __moduleName = context_1 && context_1.id;
    function startingUpSignalingServer() {
        authoritativeSignalingServer.startUpServer();
    }
    return {
        setters: [
            function (FudgeNetwork_1) {
                FudgeNetwork = FudgeNetwork_1;
            }
        ],
        execute: function () {
            isServer = false;
            networkClient = new FudgeNetwork.ClientManagerAuthoritativeStructure();
            authoritativeSignalingServer = new FudgeNetwork.FudgeServerAuthoritativeSignaling();
            startingUpSignalingServer();
        }
    };
});
//# sourceMappingURL=serverStart.js.map