System.register(["ws", "../ModuleCollector"], function (exports_1, context_1) {
    "use strict";
    var ws_1, FudgeNetwork, FudgeServerSinglePeer;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (ws_1_1) {
                ws_1 = ws_1_1;
            },
            function (FudgeNetwork_1) {
                FudgeNetwork = FudgeNetwork_1;
            }
        ],
        execute: function () {
            FudgeServerSinglePeer = class FudgeServerSinglePeer {
                constructor() {
                    this.connectedClientsCollection = new Array();
                    this.startUpServer = (_serverPort) => {
                        console.log(_serverPort);
                        if (!_serverPort) {
                            this.websocketServer = new ws_1.default.Server({ port: 8080 });
                        }
                        else {
                            this.websocketServer = new ws_1.default.Server({ port: _serverPort });
                        }
                        this.addServerEventHandling();
                    };
                    this.closeDownServer = () => {
                        this.websocketServer.close();
                    };
                    this.addServerEventHandling = () => {
                        // tslint:disable-next-line: no-any
                        this.websocketServer.on("connection", (_websocketClient) => {
                            console.log("User connected to P2P SignalingServer");
                            try {
                                const uniqueIdOnConnection = this.createID();
                                this.sendTo(_websocketClient, new FudgeNetwork.NetworkMessageIdAssigned(uniqueIdOnConnection));
                                const freshlyConnectedClient = new FudgeNetwork.ClientDataType(_websocketClient, uniqueIdOnConnection);
                                this.connectedClientsCollection.push(freshlyConnectedClient);
                            }
                            catch (error) {
                                console.error("Unhandled Exception SERVER: Sending ID to Client", error);
                            }
                            _websocketClient.on("message", (_message) => {
                                this.serverDistributeMessageToAppropriateMethod(_message, _websocketClient);
                            });
                            _websocketClient.addEventListener("close", () => {
                                console.error("Error at connection");
                                for (let i = 0; i < this.connectedClientsCollection.length; i++) {
                                    if (this.connectedClientsCollection[i].clientConnection === _websocketClient) {
                                        console.log("FudgeNetwork.Client found, deleting");
                                        this.connectedClientsCollection.splice(i, 1);
                                        console.log(this.connectedClientsCollection);
                                    }
                                    else {
                                        console.log("Wrong client to delete, moving on");
                                    }
                                }
                            });
                        });
                    };
                    this.parseMessageAndReturnObject = (_stringifiedMessage) => {
                        let parsedMessage = { originatorId: " ", messageType: FudgeNetwork.MESSAGE_TYPE.UNDEFINED };
                        try {
                            parsedMessage = JSON.parse(_stringifiedMessage);
                            return parsedMessage;
                        }
                        catch (error) {
                            console.error("Invalid JSON", error);
                        }
                        return parsedMessage;
                    };
                    this.createID = () => {
                        // Math.random should be random enough because of it's seed
                        // convert to base 36 and pick the first few digits after comma
                        return "_" + Math.random().toString(36).substr(2, 7);
                    };
                    // TODO Type Websocket not assignable to type WebSocket ?!
                    // tslint:disable-next-line: no-any
                    this.sendTo = (_connection, _message) => {
                        _connection.send(JSON.stringify(_message));
                    };
                    // Helper function for searching through a collection, finding objects by key and value, returning
                    // Object that has that value
                    // tslint:disable-next-line: no-any
                    this.searchForPropertyValueInCollection = (propertyValue, key, collectionToSearch) => {
                        for (const propertyObject in collectionToSearch) {
                            if (this.connectedClientsCollection.hasOwnProperty(propertyObject)) {
                                // tslint:disable-next-line: typedef
                                const objectToSearchThrough = collectionToSearch[propertyObject];
                                if (objectToSearchThrough[key] === propertyValue) {
                                    return objectToSearchThrough;
                                }
                            }
                        }
                        return null;
                    };
                    this.searchUserByUserNameAndReturnUser = (_userNameToSearchFor, _collectionToSearch) => {
                        return this.searchForPropertyValueInCollection(_userNameToSearchFor, "userName", _collectionToSearch);
                    };
                    this.searchUserByUserIdAndReturnUser = (_userIdToSearchFor, _collectionToSearch) => {
                        return this.searchForPropertyValueInCollection(_userIdToSearchFor, "id", _collectionToSearch);
                    };
                    this.searchUserByWebsocketConnectionAndReturnUser = (_websocketConnectionToSearchFor, _collectionToSearch) => {
                        return this.searchForPropertyValueInCollection(_websocketConnectionToSearchFor, "clientConnection", _collectionToSearch);
                    };
                }
                // TODO Check if event.type can be used for identification instead => It cannot
                serverDistributeMessageToAppropriateMethod(_message, _websocketClient) {
                    let objectifiedMessage = this.parseMessageAndReturnObject(_message);
                    if (!objectifiedMessage.messageType) {
                        console.error("Unhandled Exception: Invalid Message Object received. Does it implement MessageBase?");
                        return;
                    }
                    if (objectifiedMessage != null) {
                        switch (objectifiedMessage.messageType) {
                            case FudgeNetwork.MESSAGE_TYPE.ID_ASSIGNED:
                                console.log("Id confirmation received for client: " + objectifiedMessage.originatorId);
                                break;
                            case FudgeNetwork.MESSAGE_TYPE.LOGIN_REQUEST:
                                this.addUserOnValidLoginRequest(_websocketClient, objectifiedMessage);
                                break;
                            case FudgeNetwork.MESSAGE_TYPE.RTC_OFFER:
                                this.sendRtcOfferToRequestedClient(_websocketClient, objectifiedMessage);
                                break;
                            case FudgeNetwork.MESSAGE_TYPE.RTC_ANSWER:
                                this.answerRtcOfferOfClient(_websocketClient, objectifiedMessage);
                                break;
                            case FudgeNetwork.MESSAGE_TYPE.ICE_CANDIDATE:
                                this.sendIceCandidatesToRelevantPeer(_websocketClient, objectifiedMessage);
                                break;
                            default:
                                console.log("Message type not recognized");
                                break;
                        }
                    }
                }
                //#region MessageHandler
                addUserOnValidLoginRequest(_websocketConnection, _messageData) {
                    let usernameTaken = true;
                    usernameTaken = this.searchUserByUserNameAndReturnUser(_messageData.loginUserName, this.connectedClientsCollection) != null;
                    try {
                        if (!usernameTaken) {
                            const clientBeingLoggedIn = this.searchUserByWebsocketConnectionAndReturnUser(_websocketConnection, this.connectedClientsCollection);
                            if (clientBeingLoggedIn != null) {
                                clientBeingLoggedIn.userName = _messageData.loginUserName;
                                this.sendTo(_websocketConnection, new FudgeNetwork.NetworkMessageLoginResponse(true, clientBeingLoggedIn.id, clientBeingLoggedIn.userName));
                            }
                        }
                        else {
                            this.sendTo(_websocketConnection, new FudgeNetwork.NetworkMessageLoginResponse(false, "", ""));
                            usernameTaken = true;
                            console.log("UsernameTaken");
                        }
                    }
                    catch (error) {
                        console.error("Unhandled Exception: Unable to create or send LoginResponse", error);
                    }
                }
                sendRtcOfferToRequestedClient(_websocketClient, _messageData) {
                    console.log("Sending offer to: ", _messageData.userNameToConnectTo);
                    const requestedClient = this.searchForPropertyValueInCollection(_messageData.userNameToConnectTo, "userName", this.connectedClientsCollection);
                    if (requestedClient != null) {
                        const offerMessage = new FudgeNetwork.NetworkMessageRtcOffer(_messageData.originatorId, requestedClient.userName, _messageData.offer);
                        try {
                            this.sendTo(requestedClient.clientConnection, offerMessage);
                        }
                        catch (error) {
                            console.error("Unhandled Exception: Unable to relay Offer to Client", error);
                        }
                    }
                    else {
                        console.error("User to connect to doesn't exist under that Name");
                    }
                }
                answerRtcOfferOfClient(_websocketClient, _messageData) {
                    console.log("Sending answer to: ", _messageData.targetId);
                    const clientToSendAnswerTo = this.searchUserByUserIdAndReturnUser(_messageData.targetId, this.connectedClientsCollection);
                    if (clientToSendAnswerTo != null) {
                        // TODO Probable source of error, need to test
                        if (clientToSendAnswerTo.clientConnection != null)
                            this.sendTo(clientToSendAnswerTo.clientConnection, _messageData);
                    }
                }
                sendIceCandidatesToRelevantPeer(_websocketClient, _messageData) {
                    const clientToShareCandidatesWith = this.searchUserByUserIdAndReturnUser(_messageData.targetId, this.connectedClientsCollection);
                    if (clientToShareCandidatesWith != null) {
                        const candidateToSend = new FudgeNetwork.NetworkMessageIceCandidate(_messageData.originatorId, clientToShareCandidatesWith.id, _messageData.candidate);
                        this.sendTo(clientToShareCandidatesWith.clientConnection, candidateToSend);
                    }
                }
                //#endregion
                //#region Helperfunctions
                searchForClientWithId(_idToFind) {
                    return this.searchForPropertyValueInCollection(_idToFind, "id", this.connectedClientsCollection);
                }
                //#endregion
                parseMessageToJson(_messageToParse) {
                    let parsedMessage = { originatorId: " ", messageType: FudgeNetwork.MESSAGE_TYPE.UNDEFINED };
                    try {
                        parsedMessage = JSON.parse(_messageToParse);
                    }
                    catch (error) {
                        console.error("Invalid JSON", error);
                    }
                    return parsedMessage;
                }
            };
            exports_1("FudgeServerSinglePeer", FudgeServerSinglePeer);
        }
    };
});
//# sourceMappingURL=FudgeServerSinglePeer.js.map