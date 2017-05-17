import IUserID from "./IUserID";
/**
 * The storage interface
 */
interface IWindow extends Window {
    RTCPeerConnection: any;
    mozRTCPeerConnection: any;
    webkitRTCPeerConnection: any;
    navigator: Navigator;
    UserID: IUserID;
    ActiveXObject: any;
    Promise: any;
}
export default IWindow;
