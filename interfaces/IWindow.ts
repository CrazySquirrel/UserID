"use strict";
/**
 * TODO: Refactor this file
 */
/**
 * Import sub interfaces
 */
import IAnimationFrame from "./IAnimationFrame";
import IDebug from "./IDebug";
import ILocalStorage from "./ILocalStorage";
import ISessionStorage from "./ISessionStorage";
import IUserID from "./IUserID";
/*
import ICompareScripts from "./Additional/ICompareScripts";
import IAdf from "./Adf/IAdf";
import IBegun from "./Begun/IBegun";
import IXMLHttpRequest from "./Default/IXMLHttpRequest";
import IMontblanc from "./montblanc/IMontblanc";
import IViewAbility from "./ViewAbility/IViewAbility";
*/
/**
 * The storage interface
 */
interface IWindow {
    RTCPeerConnection: any;
    mozRTCPeerConnection: any;
    webkitRTCPeerConnection: any;
    document: any;
    Utils: any;

    eventListenerAdded: boolean;

    innerHeight: number;
    innerWidth: number;
    pageXOffset: number;
    pageYOffset: number;

    globalStorage: Object;

    requestAnimationFrame: Function;
    webkitRequestAnimationFrame: Function;
    mozRequestAnimationFrame: Function;
    oRequestAnimationFrame: Function;
    msRequestAnimationFrame: Function;
    onerror: Function;

    setTimeout(callback: Function, time: number): number;

    navigator: Navigator;

    Debug: IDebug;
    AnimationFrame: IAnimationFrame;
    localStorage: ILocalStorage;
    sessionStorage: ISessionStorage;
    UserID: IUserID;
}
/**
 * Declare window interface
 */
declare var window: IWindow;
/**
 * Export the window interface
 */
export default IWindow;
