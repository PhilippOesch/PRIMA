System.register([], function (exports_1, context_1) {
    "use strict";
    var ClientDataType;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ClientDataType = class ClientDataType {
                constructor(websocketConnection, _remoteId, _rtcPeerConnection, _rtcDataChannel, _rtcMediaStream, _userName) {
                    this.id = _remoteId || "";
                    this.userName = _userName || "";
                    this.rtcPeerConnection = _rtcPeerConnection || new RTCPeerConnection();
                    this.rtcDataChannel = _rtcDataChannel || this.rtcPeerConnection.createDataChannel("error");
                    this.rtcMediaStream = _rtcMediaStream;
                    this.clientConnection = websocketConnection || null;
                    this.isPeerMeshReady = false;
                    // this.connectedRoom = connectedToRoom || null;
                }
            };
            exports_1("ClientDataType", ClientDataType);
        }
    };
});
//# sourceMappingURL=ClientDataType.js.map