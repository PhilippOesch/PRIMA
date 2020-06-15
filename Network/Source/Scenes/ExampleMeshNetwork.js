System.register(["../ModuleCollector"], function (exports_1, context_1) {
    "use strict";
    var FudgeNetwork, isServer, meshClientManager, meshServer;
    var __moduleName = context_1 && context_1.id;
    function setClientReady() {
        meshClientManager.sendReadySignalToServer();
    }
    function startingUpSignalingServer() {
        meshServer.startUpServer();
    }
    function connectToSignalingServer() {
        meshClientManager.signalingServerConnectionUrl = "ws://" + FudgeNetwork.UiElementHandler.meshClientSignalingURL.value;
        meshClientManager.connectToSignalingServer();
    }
    function switchServerMode() {
        let switchbutton = FudgeNetwork.UiElementHandler.meshNetworkClientOrServerSwitch;
        if (!isServer) {
            switchbutton.textContent = "Switch to Clientmode";
            FudgeNetwork.UiElementHandler.meshClientElements.style.display = "none";
            FudgeNetwork.UiElementHandler.meshServerElements.style.display = "block";
            isServer = true;
        }
        else {
            switchbutton.textContent = "Switch to Servermode";
            FudgeNetwork.UiElementHandler.meshClientElements.style.display = "block";
            FudgeNetwork.UiElementHandler.meshServerElements.style.display = "none";
            isServer = false;
        }
    }
    return {
        setters: [
            function (FudgeNetwork_1) {
                FudgeNetwork = FudgeNetwork_1;
            }
        ],
        execute: function () {
            isServer = false;
            meshClientManager = new FudgeNetwork.ClientManagerFullMeshStructure();
            meshServer = new FudgeNetwork.FudgeServerMeshNetwork();
            FudgeNetwork.UiElementHandler.getMeshUiElements();
            FudgeNetwork.UiElementHandler.meshNetworkClientOrServerSwitch.addEventListener("click", switchServerMode);
            FudgeNetwork.UiElementHandler.meshServerStartSignalingButton.addEventListener("click", startingUpSignalingServer);
            FudgeNetwork.UiElementHandler.meshClientSubmitButton.addEventListener("click", connectToSignalingServer);
            FudgeNetwork.UiElementHandler.meshClientReadyButton.addEventListener("click", setClientReady);
            FudgeNetwork.UiElementHandler.meshClientElements.style.display = "block";
            FudgeNetwork.UiElementHandler.meshServerElements.style.display = "none";
        }
    };
});
//# sourceMappingURL=ExampleMeshNetwork.js.map