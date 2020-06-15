System.register(["../ModuleCollector"], function (exports_1, context_1) {
    "use strict";
    var FudgeNetwork, asMode, networkClient, peerToPeerSignalingServer;
    var __moduleName = context_1 && context_1.id;
    function createLoginRequestWithUsername() {
        let chosenUserName = "";
        if (FudgeNetwork.UiElementHandler.loginNameInput) {
            chosenUserName = FudgeNetwork.UiElementHandler.loginNameInput.value;
            console.log("Username:" + chosenUserName);
            networkClient.checkChosenUsernameAndCreateLoginRequest(chosenUserName);
        }
        else {
            console.error("UI element missing: Loginname Input field");
        }
    }
    function connectToOtherPeer() {
        let userNameToConnectTo = "";
        if (FudgeNetwork.UiElementHandler.usernameToConnectTo) {
            userNameToConnectTo = FudgeNetwork.UiElementHandler.usernameToConnectTo.value;
            networkClient.checkUsernameToConnectToAndInitiateConnection(userNameToConnectTo);
        }
        else {
            console.error("Missing Ui Element: Username to connect to");
        }
    }
    function sendMessageViaPeerConnectionChannel() {
        let messageToSend = FudgeNetwork.UiElementHandler.msgInput.value;
        FudgeNetwork.UiElementHandler.chatbox.innerHTML += "\n" + networkClient.localUserName + ": " + messageToSend;
        networkClient.sendMessageToSingularPeer(messageToSend);
    }
    function startingUpSignalingServer() {
        console.log("Turning server ONLINE");
        peerToPeerSignalingServer.startUpServer(8080);
        let startSignalingButton = FudgeNetwork.UiElementHandler.startSignalingButton;
        startSignalingButton.hidden = true;
        let stopSignalingButton = FudgeNetwork.UiElementHandler.stopSignalingServer;
        stopSignalingButton.hidden = false;
    }
    function turnOffSignalingServer() {
        peerToPeerSignalingServer.closeDownServer();
        let startSignalingButton = FudgeNetwork.UiElementHandler.startSignalingButton;
        startSignalingButton.hidden = false;
        let stopSignalingButton = FudgeNetwork.UiElementHandler.stopSignalingServer;
        stopSignalingButton.hidden = true;
        let switchButton = FudgeNetwork.UiElementHandler.switchModeButton;
        switchButton.hidden = false;
    }
    function connectToSignalingServer() {
        networkClient.signalingServerConnectionUrl = "ws://" + FudgeNetwork.UiElementHandler.signalingUrl.value;
        networkClient.connectToSignalingServer();
    }
    return {
        setters: [
            function (FudgeNetwork_1) {
                FudgeNetwork = FudgeNetwork_1;
            }
        ],
        execute: function () {
            asMode = false;
            networkClient = new FudgeNetwork.ClientManagerSinglePeer();
            peerToPeerSignalingServer = new FudgeNetwork.FudgeServerSinglePeer();
            FudgeNetwork.UiElementHandler.getAllUiElements();
            FudgeNetwork.UiElementHandler.startSignalingButton.addEventListener("click", startingUpSignalingServer);
            FudgeNetwork.UiElementHandler.signalingSubmit.addEventListener("click", connectToSignalingServer);
            FudgeNetwork.UiElementHandler.loginButton.addEventListener("click", createLoginRequestWithUsername);
            FudgeNetwork.UiElementHandler.connectToUserButton.addEventListener("click", connectToOtherPeer);
            FudgeNetwork.UiElementHandler.sendMsgButton.addEventListener("click", sendMessageViaPeerConnectionChannel);
            FudgeNetwork.UiElementHandler.stopSignalingServer.addEventListener("click", turnOffSignalingServer);
        }
    };
});
//# sourceMappingURL=ExampleSinglePeerToPeer.js.map