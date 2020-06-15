System.register(["../ModuleCollector", "../NetworkMessages"], function (exports_1, context_1) {
    "use strict";
    var FudgeNetwork, NetworkMessages_1, isServer, networkClient, authoritativeSignalingServer;
    var __moduleName = context_1 && context_1.id;
    function addKeypressListener() {
        let browser = FudgeNetwork.UiElementHandler.electronWindow;
        browser.addEventListener("keydown", (event) => {
            if (event.keyCode == 27) {
                networkClient.sendDisconnectRequest();
            }
            else {
                networkClient.sendKeyPress(event.keyCode);
            }
        });
    }
    function createLoginRequestWithUsername() {
        let chosenUserName = "";
        if (FudgeNetwork.UiElementHandler.authoritativeClientLoginNameInput) {
            chosenUserName = FudgeNetwork.UiElementHandler.authoritativeClientLoginNameInput.value;
            console.log("Username:" + chosenUserName);
            networkClient.checkChosenUsernameAndCreateLoginRequest(chosenUserName);
        }
        else {
            console.error("UI element missing: Loginname Input field");
        }
    }
    function sendMessageViaPeerConnectionChannel() {
        let messageToSend = FudgeNetwork.UiElementHandler.authoritativeClientMessageInput.value;
        FudgeNetwork.UiElementHandler.authoritativeClientChatArea.innerHTML += "\n" + networkClient.localUserName + ": " + messageToSend;
        networkClient.sendMessageToSingularPeer(messageToSend);
    }
    function broadcastMessageToClients() {
        let stringifiedMessage = JSON.stringify(new NetworkMessages_1.PeerMessageSimpleText(networkClient.getLocalClientId(), FudgeNetwork.UiElementHandler.authoritativeServerMessageInput.value, networkClient.localUserName));
        authoritativeSignalingServer.getAuthoritativeServerEntity().broadcastMessageToAllConnectedClients(stringifiedMessage);
    }
    function switchServerMode() {
        let switchbutton = FudgeNetwork.UiElementHandler.authoritativeSwitchToServerOrClientModeButton;
        if (!isServer) {
            switchbutton.textContent = "Switch to Servermode";
            FudgeNetwork.UiElementHandler.authoritativeServerElements.style.display = "none";
            FudgeNetwork.UiElementHandler.authoritativeClientElements.style.display = "block";
            isServer = true;
        }
        else {
            switchbutton.textContent = "Switch To Client Mode";
            FudgeNetwork.UiElementHandler.authoritativeServerElements.style.display = "block";
            FudgeNetwork.UiElementHandler.authoritativeClientElements.style.display = "none";
            isServer = false;
        }
    }
    function startingUpSignalingServer() {
        console.log("Turning server ONLINE");
        authoritativeSignalingServer.startUpServer(8080);
        let startSignalingButton = FudgeNetwork.UiElementHandler.authoritativeServerStartSignalingButton;
        startSignalingButton.hidden = true;
        let stopSignalingButton = FudgeNetwork.UiElementHandler.authoritativeServerStopSignalingButton;
        stopSignalingButton.hidden = false;
        let switchButton = FudgeNetwork.UiElementHandler.authoritativeSwitchToServerOrClientModeButton;
        switchButton.hidden = true;
    }
    function turnOffSignalingServer() {
        console.log("Turning server offline");
        authoritativeSignalingServer.closeDownServer();
        let startSignalingButton = FudgeNetwork.UiElementHandler.authoritativeServerStartSignalingButton;
        startSignalingButton.hidden = false;
        let stopSignalingButton = FudgeNetwork.UiElementHandler.authoritativeServerStopSignalingButton;
        stopSignalingButton.hidden = true;
        let switchButton = FudgeNetwork.UiElementHandler.authoritativeSwitchToServerOrClientModeButton;
        switchButton.hidden = false;
    }
    function connectToSignalingServer() {
        networkClient.signalingServerConnectionUrl = "ws://" + FudgeNetwork.UiElementHandler.authoritativeClientSignalingUrlInput.value;
        networkClient.connectToSignalingServer();
        addKeypressListener();
    }
    return {
        setters: [
            function (FudgeNetwork_1) {
                FudgeNetwork = FudgeNetwork_1;
            },
            function (NetworkMessages_1_1) {
                NetworkMessages_1 = NetworkMessages_1_1;
            }
        ],
        execute: function () {
            isServer = false;
            networkClient = new FudgeNetwork.ClientManagerAuthoritativeStructure();
            authoritativeSignalingServer = new FudgeNetwork.FudgeServerAuthoritativeSignaling();
            FudgeNetwork.UiElementHandler.getAuthoritativeUiElements();
            FudgeNetwork.UiElementHandler.authoritativeServerStartSignalingButton.addEventListener("click", startingUpSignalingServer);
            FudgeNetwork.UiElementHandler.authoritativeServerStopSignalingButton.addEventListener("click", turnOffSignalingServer);
            FudgeNetwork.UiElementHandler.authoritativeServerBroadcastButton.addEventListener("click", broadcastMessageToClients);
            FudgeNetwork.UiElementHandler.authoritativeClientConnectToServerButton.addEventListener("click", connectToSignalingServer);
            // FudgeNetwork.UiElementHandler.authoritativeClientLoginButton.addEventListener("click", createLoginRequestWithUsername);
            FudgeNetwork.UiElementHandler.authoritativeClientSendMessageButton.addEventListener("click", sendMessageViaPeerConnectionChannel);
            FudgeNetwork.UiElementHandler.authoritativeSwitchToServerOrClientModeButton.addEventListener("click", switchServerMode);
            FudgeNetwork.UiElementHandler.authoritativeServerElements.style.display = "none";
            console.log(FudgeNetwork.UiElementHandler.authoritativeSwitchToServerOrClientModeButton);
        }
    };
});
//# sourceMappingURL=ExampleAuthoritativeServer.js.map