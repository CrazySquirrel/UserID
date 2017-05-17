"use strict";
/**
 * Import sub interfaces
 */
import ILocalStorage from "./ILocalStorage";
import ISessionStorage from "./ISessionStorage";
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
/**
 * Declare window interface
 */
declare var window: IWindow;
/**
 * Export the window interface
 */
export default IWindow;
