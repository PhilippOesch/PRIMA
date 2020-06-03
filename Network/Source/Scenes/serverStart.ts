
import * as FudgeNetwork from "../ModuleCollector";
import { PeerMessageSimpleText } from "../NetworkMessages";

let isServer: boolean = false;
const networkClient: FudgeNetwork.ClientManagerAuthoritativeStructure = new FudgeNetwork.ClientManagerAuthoritativeStructure();
const authoritativeSignalingServer: FudgeNetwork.FudgeServerAuthoritativeSignaling = new FudgeNetwork.FudgeServerAuthoritativeSignaling();

function startingUpSignalingServer(): void {
    authoritativeSignalingServer.startUpServer();
}

startingUpSignalingServer();

