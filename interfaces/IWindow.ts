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
interface IWindow {
  RTCPeerConnection: any;
  mozRTCPeerConnection: any;
  webkitRTCPeerConnection: any;

  navigator: Navigator;

  localStorage: ILocalStorage;
  sessionStorage: ISessionStorage;
  UserID: IUserID;

  ActiveXObject: any;
}
/**
 * Declare window interface
 */
declare var window: IWindow;
/**
 * Export the window interface
 */
export default IWindow;
