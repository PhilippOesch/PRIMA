System.register(["../ModuleCollector"], function (exports_1, context_1) {
    "use strict";
    var FudgeNetwork, isServer, pureWebSocketClient, pureWebSocketServer;
    var __moduleName = context_1 && context_1.id;
    function broadcastMessageToClients() {
        let messageToBroadcast = new FudgeNetwork.NetworkMessageMessageToClient(FudgeNetwork.UiElementHandler.webSocketServerMessageInput.value);
        pureWebSocketServer.broadcastMessageToAllConnectedClients(messageToBroadcast);
    }
    function startingUpSignalingServer() {
        pureWebSocketServer.startUpServer();
    }
    function connectToSignalingServer() {
        pureWebSocketClient.signalingServerConnectionUrl = "ws://" + FudgeNetwork.UiElementHandler.signalingUrl.value;
        pureWebSocketClient.connectToSignalingServer();
    }
    function createLoginRequestWithUsername() {
        let chosenUserName = "";
        console.log(FudgeNetwork.UiElementHandler.sendMsgButton);
        if (FudgeNetwork.UiElementHandler.loginNameInput) {
            chosenUserName = FudgeNetwork.UiElementHandler.loginNameInput.value;
            console.log("Username:" + chosenUserName);
            pureWebSocketClient.checkChosenUsernameAndCreateLoginRequest(chosenUserName);
        }
        else {
            console.error("UI element missing: Loginname Input field");
        }
    }
    function sendMessageToServer() {
        console.log("sending message");
        let messageToSend = new FudgeNetwork.NetworkMessageMessageToServer(pureWebSocketClient.getLocalClientId(), FudgeNetwork.UiElementHandler.msgInput.value, pureWebSocketClient.localUserName);
        pureWebSocketClient.sendTextMessageToSignalingServer(messageToSend);
    }
    function switchServerMode() {
        let switchbutton = FudgeNetwork.UiElementHandler.switchModeButton;
        if (!isServer) {
            switchbutton.textContent = "Switch to Clientmode";
            FudgeNetwork.UiElementHandler.signalingElements.style.display = "none";
            FudgeNetwork.UiElementHandler.serverElements.style.display = "block";
            isServer = true;
        }
        else {
            switchbutton.textContent = "Switch to Servermode";
            FudgeNetwork.UiElementHandler.signalingElements.style.display = "block";
            FudgeNetwork.UiElementHandler.serverElements.style.display = "none";
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
            pureWebSocketClient = new FudgeNetwork.ClientManagerWebSocketOnly();
            pureWebSocketServer = new FudgeNetwork.FudgeServerWebSocket();
            FudgeNetwork.UiElementHandler.getPureWebSocketUiElements();
            FudgeNetwork.UiElementHandler.startSignalingButton.addEventListener("click", startingUpSignalingServer);
            FudgeNetwork.UiElementHandler.signalingSubmit.addEventListener("click", connectToSignalingServer);
            FudgeNetwork.UiElementHandler.loginButton.addEventListener("click", createLoginRequestWithUsername);
            FudgeNetwork.UiElementHandler.switchModeButton.addEventListener("click", switchServerMode);
            FudgeNetwork.UiElementHandler.sendMsgButton.addEventListener("click", sendMessageToServer);
            FudgeNetwork.UiElementHandler.webSocketServerSendMessageButton.addEventListener("click", broadcastMessageToClients);
            FudgeNetwork.UiElementHandler.signalingElements.style.display = "block";
            FudgeNetwork.UiElementHandler.serverElements.style.display = "none";
        }
    };
});
//# sourceMappingURL=ExamplePureWebSocket.js.map