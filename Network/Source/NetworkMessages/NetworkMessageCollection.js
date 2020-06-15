System.register(["../ModuleCollector"], function (exports_1, context_1) {
    "use strict";
    var FudgeNetwork, NetworkMessageIdAssigned, NetworkMessageLoginRequest, NetworkMessageLoginResponse, NetworkMessageRtcOffer, NetworkMessageRtcAnswer, NetworkMessageIceCandidate, NetworkMessageMessageToServer, NetworkMessageMessageToClient, NetworkMessageClientReady, NetworkMessageServerSendMeshClientArray, NetworkMessageClientMeshReady, NetworkMessageClientIsMeshConnected, PeerMessageSimpleText, PeerMessageDisconnectClient, PeerMessageKeysInput;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (FudgeNetwork_1) {
                FudgeNetwork = FudgeNetwork_1;
            }
        ],
        execute: function () {
            NetworkMessageIdAssigned = class NetworkMessageIdAssigned {
                constructor(_assignedId) {
                    this.originatorId = "Server";
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.ID_ASSIGNED;
                    this.assignedId = _assignedId;
                }
            };
            exports_1("NetworkMessageIdAssigned", NetworkMessageIdAssigned);
            NetworkMessageLoginRequest = class NetworkMessageLoginRequest {
                constructor(_originatorId, _loginUserName) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.LOGIN_REQUEST;
                    this.loginUserName = "";
                    this.loginUserName = _loginUserName;
                    this.originatorId = _originatorId;
                }
            };
            exports_1("NetworkMessageLoginRequest", NetworkMessageLoginRequest);
            NetworkMessageLoginResponse = class NetworkMessageLoginResponse {
                constructor(_loginSuccess, _assignedId, _originatorUsername) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.LOGIN_RESPONSE;
                    this.loginSuccess = _loginSuccess;
                    this.originatorId = _assignedId;
                    this.originatorUsername = _originatorUsername;
                }
            };
            exports_1("NetworkMessageLoginResponse", NetworkMessageLoginResponse);
            NetworkMessageRtcOffer = class NetworkMessageRtcOffer {
                constructor(_originatorId, _userNameToConnectTo, _offer) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.RTC_OFFER;
                    this.originatorId = _originatorId;
                    this.userNameToConnectTo = _userNameToConnectTo;
                    this.offer = _offer;
                }
            };
            exports_1("NetworkMessageRtcOffer", NetworkMessageRtcOffer);
            NetworkMessageRtcAnswer = class NetworkMessageRtcAnswer {
                constructor(_originatorId, _targetId, _userNameToConnectTo, _answer) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.RTC_ANSWER;
                    this.originatorId = _originatorId;
                    this.targetId = _targetId;
                    this.answer = _answer;
                }
            };
            exports_1("NetworkMessageRtcAnswer", NetworkMessageRtcAnswer);
            NetworkMessageIceCandidate = class NetworkMessageIceCandidate {
                constructor(_originatorId, _targetId, _candidate) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.ICE_CANDIDATE;
                    this.originatorId = _originatorId;
                    this.targetId = _targetId;
                    this.candidate = _candidate;
                }
            };
            exports_1("NetworkMessageIceCandidate", NetworkMessageIceCandidate);
            NetworkMessageMessageToServer = class NetworkMessageMessageToServer {
                constructor(_originatorId, _messageData, _originatorUserName) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.CLIENT_TO_SERVER_MESSAGE;
                    this.originatorId = _originatorId;
                    this.messageData = _messageData;
                    this.originatorUserName = _originatorUserName;
                }
            };
            exports_1("NetworkMessageMessageToServer", NetworkMessageMessageToServer);
            NetworkMessageMessageToClient = class NetworkMessageMessageToClient {
                constructor(_messageData) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.SERVER_TO_CLIENT_MESSAGE;
                    this.originatorId = "SERVER";
                    this.messageData = _messageData;
                }
            };
            exports_1("NetworkMessageMessageToClient", NetworkMessageMessageToClient);
            NetworkMessageClientReady = class NetworkMessageClientReady {
                constructor(_originatorId) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.CLIENT_READY_FOR_MESH_CONNECTION;
                    this.originatorId = _originatorId;
                }
            };
            exports_1("NetworkMessageClientReady", NetworkMessageClientReady);
            NetworkMessageServerSendMeshClientArray = class NetworkMessageServerSendMeshClientArray {
                constructor(_candidateArray) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.SERVER_SEND_MESH_CANDIDATES_TO_CLIENT;
                    this.originatorId = "SERVER";
                    this.candidateArray = _candidateArray;
                }
            };
            exports_1("NetworkMessageServerSendMeshClientArray", NetworkMessageServerSendMeshClientArray);
            NetworkMessageClientMeshReady = class NetworkMessageClientMeshReady {
                constructor(_originatorId) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.CLIENT_READY_FOR_MESH_CONNECTION;
                    this.originatorId = _originatorId;
                }
            };
            exports_1("NetworkMessageClientMeshReady", NetworkMessageClientMeshReady);
            NetworkMessageClientIsMeshConnected = class NetworkMessageClientIsMeshConnected {
                constructor(_originatorId) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.CLIENT_MESH_CONNECTED;
                    this.originatorId = _originatorId;
                }
            };
            exports_1("NetworkMessageClientIsMeshConnected", NetworkMessageClientIsMeshConnected);
            PeerMessageSimpleText = class PeerMessageSimpleText {
                constructor(_originatorId, _messageData, _originatorUserName) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.PEER_TEXT_MESSAGE;
                    this.commandType = FudgeNetwork.SERVER_COMMAND_TYPE.UNDEFINED;
                    this.originatorId = _originatorId;
                    this.originatorUserName = _originatorUserName;
                    this.messageData = _messageData;
                }
            };
            exports_1("PeerMessageSimpleText", PeerMessageSimpleText);
            PeerMessageDisconnectClient = class PeerMessageDisconnectClient {
                constructor(_originatorId) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.PEER_TO_SERVER_COMMAND;
                    this.commandType = FudgeNetwork.SERVER_COMMAND_TYPE.DISCONNECT_CLIENT;
                    this.originatorId = _originatorId;
                }
            };
            exports_1("PeerMessageDisconnectClient", PeerMessageDisconnectClient);
            PeerMessageKeysInput = class PeerMessageKeysInput {
                constructor(_originatorId, _pressedKeycode, _pressedKeyCodes) {
                    this.messageType = FudgeNetwork.MESSAGE_TYPE.PEER_TO_SERVER_COMMAND;
                    this.commandType = FudgeNetwork.SERVER_COMMAND_TYPE.KEYS_INPUT;
                    this.originatorId = _originatorId;
                    this.pressedKey = _pressedKeycode;
                    if (_pressedKeyCodes) {
                        this.pressedKeys = _pressedKeyCodes;
                    }
                    else {
                        this.pressedKeys = null;
                    }
                }
            };
            exports_1("PeerMessageKeysInput", PeerMessageKeysInput);
        }
    };
});
//# sourceMappingURL=NetworkMessageCollection.js.map