"use strict";
/**
 * Import interfaces
 */
import IWindow from "../interfaces/IWindow";
/**
 * Declare window interface
 */
declare let window: IWindow;
declare let require: any;
declare let module: any;

/**
 * Import interface
 */
import IUserID from "../interfaces/IUserID";

/**
 * Import dependency polyfills
 */
let btoa = require("btoa");

/**
 * Import dependency classes
 */
import MurmurHash3 from "./MurmurHash3";

import EverCookie from "EverCookie";
import Utils from "Utils";
/**
 * User ID class
 */
export default class UserID implements IUserID {

    /**
     * Clear previous version of FingerPrint
     */
    public static clearPrevious() {
        /**
         * Check if localStorage is supported
         */
        if (typeof localStorage !== "undefined") {
            /**
             * Loop all localStorage keys
             */
            for (let key in localStorage) {
                /**
                 * If key matched to FingerPrint and it is not current version, then remove that item from storages
                 */
                if (
                    key.indexOf("FingerPrint") !== -1 &&
                    key.indexOf("#PACKAGE_NAME#_#PACKAGE_VERSION#") === -1
                ) {
                    /**
                     * Parse storage key and get storage version
                     */
                    let localKey = key.split("_");
                    localKey = localKey.slice(0, localKey.length - 1);
                    key = localKey.join("_");
                    /**
                     * Init EverCookie for that version
                     */
                    let LocalEverCookie = new EverCookie(key);
                    /**
                     * Clean storage
                     */
                    LocalEverCookie.clear(true);
                    /**
                     * Destroy storage
                     */
                    LocalEverCookie.destroy();
                }
            }
        }
    }

    /**
     * 32 bit FNV-1a hash
     * @param str
     * @param hash
     * @return {number}
     */
    public static fnv32a(str, hash): number {
        for (let i = 0; i < str.length; i++) {
            hash = hash ^ str.charCodeAt(i);
            hash = (hash * 0x01000193) & 0xFFFFFFFF;
        }
        return hash;
    }

    /**
     * Convert string to binary
     * @param val
     * @return {string}
     */
    public static tobinary(val): string {
        let ret = "";
        for (let i = 0; i < 4; i++) {
            ret += String.fromCharCode(val & 0xFF);
            val = val >> 8;
        }
        return ret;
    }

    /**
     * Get FingerPrint Hash
     * @param dump
     * @return {string}
     */
    public static getFingerPrintHash(dump): string {
        let murmur = MurmurHash3.x64hash128(dump, 31);

        let i1 = 4004;
        let i2 = 1471357547; // Fake date.
        let i3 = UserID.fnv32a(murmur.substr(0, 16), murmur);
        let i4 = UserID.fnv32a(murmur.substr(16, 16), murmur);

        i4 = (i4 & 0xFFFFFF00) | 0x01;

        let ruid = "";
        ruid += UserID.tobinary(i1);
        ruid += UserID.tobinary(i2);
        ruid += UserID.tobinary(i3);
        ruid += UserID.tobinary(i4);
        ruid += String.fromCharCode(0);

        return btoa(ruid);
    }

    /**
     * Get User Language
     * @return {Object|boolean}
     */
    public static getUserLanguage(): Object|boolean {
        try {
            let _navigator: any = window.navigator;
            return ({
                UserLanguage: (
                    _navigator.language ||
                    _navigator.userLanguage ||
                    _navigator.browserLanguage ||
                    _navigator.systemLanguage ||
                    ""
                ),
            });
        } catch (e) {
            return (false);
        }
    }

    /**
     * Get Timezone Offset
     * @return {Object|boolean}
     */
    public static getTimezoneOffset(): Object|boolean {
        try {
            return ({
                TimezoneOffset: new Date().getTimezoneOffset(),
            });
        } catch (e) {
            return (false);
        }
    }

    /**
     * Each emulation for Arrays and Objects
     * @param obj
     * @param iterator
     * @param context
     */
    public static each(obj, iterator, context) {
        if (obj === null) {
            return;
        }
        if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (let i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === {}) {
                    return;
                }
            }
        } else {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (iterator.call(context, obj[key], key, obj) === {}) {
                        return;
                    }
                }
            }
        }
    }

    /**
     * Declare UserID properties
     */
    public EverCookie: any;
    public IDEverCookie: any;
    public IDUID: any;
    public IDBASE: any;

    /**
     * User ID constructor
     */
    constructor() {
        /**
         * Clear previous version of FingerPrint
         */
        UserID.clearPrevious();
        /**
         * Generate IDs
         */
        this.IDEverCookie = "";
        this.IDUID = "";
        this.IDBASE = UserID.getFingerPrintHash(JSON.stringify([
            Utils.User.getInfo(),
            UserID.getUserLanguage(),
            UserID.getTimezoneOffset(),
            this.getPlugins(),
        ]));
        /**
         * Init EveryCookie and get ID
         * @type {EverCookie}
         */
        this.EverCookie = new EverCookie("#PACKAGE_NAME#_#PACKAGE_VERSION#");
        this.IDEverCookie = this.EverCookie.getItem(true, "FingerPrint");
        /**
         * Get full ID
         */
        this.getUID((result) => {
            /**
             * Convert user signs to Rambler format
             */
            this.IDUID = UserID.getFingerPrintHash(JSON.stringify(result));
            /**
             * Write full user ID into the EverCookie
             */
            this.EverCookie.setItem(true, "FingerPrint", this.IDUID);
        });

        Utils.implementationStaticMethods(this, "UserID");
    }

    /**
     * Get user ID
     * @return {string}
     */
    public getID(): string {
        /**
         * Return full user ID, ID from storage or base ID if one of them exist
         */
        return this.IDUID || this.IDEverCookie || this.IDBASE;
    }

    /**
     * Get user full ID
     * @param callback
     */
    public getUID(callback) {
        this.getIP((result) => {
            callback([
                Utils.User.getInfo(),
                UserID.getUserLanguage(),
                UserID.getTimezoneOffset(),
                this.getPlugins(),
                result,
            ]);
        });
    }

    /**
     * Get Plugins
     * @return {Object|boolean}
     */
    public getPlugins(): Object|boolean {
        try {
            if (Utils.Browser.isMSIE()) {
                return {
                    Plugins: this.getIEPlugins(),
                };
            } else {
                return {
                    Plugins: this.getRegularPlugins(),
                };
            }
        } catch (e) {
            return (false);
        }
    }

    /**
     * Get IE plugins
     * @return {Array}
     */
    public getIEPlugins(): Array<any> {
        try {
            let arrResult = [];
            /**
             * If ActiveXObject supported
             */
            if (
                (
                    Object.getOwnPropertyDescriptor &&
                    Object.getOwnPropertyDescriptor(window, "ActiveXObject")
                ) ||
                ("ActiveXObject" in window)
            ) {
                /**
                 * List of expected plugins
                 * @type {string[]}
                 */
                let arrExpectedPluginsList = [
                    "AcroPDF.PDF", // Adobe PDF reader 7+
                    "Adodb.Stream",
                    "AgControl.AgControl", // Silverlight
                    "DevalVRXCtrl.DevalVRXCtrl.1",
                    "MacromediaFlashPaper.MacromediaFlashPaper",
                    "Msxml2.DOMDocument",
                    "Msxml2.XMLHTTP",
                    "PDF.PdfCtrl", // Adobe PDF reader 6 and earlier
                    "QuickTime.QuickTime", // QuickTime
                    "QuickTimeCheckObject.QuickTimeCheck.1",
                    "RealPlayer",
                    "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
                    "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
                    "Scripting.Dictionary",
                    "SWCtl.SWCtl", // ShockWave player
                    "Shell.UIHelper",
                    "ShockwaveFlash.ShockwaveFlash", // flash plugin
                    "Skype.Detection",
                    "TDCCtl.TDCCtl",
                    "WMPlayer.OCX", // Windows media player
                    "rmocx.RealPlayer G2 Control",
                    "rmocx.RealPlayer G2 Control.1",
                ];
                /**
                 * Detecting IE plugins by trying initialise it
                 * @type {Array}
                 */
                arrResult = this.map(
                    arrExpectedPluginsList,
                    (name) => {
                        try {
                            let a = new ActiveXObject(name);
                            if (a) {
                                return name;
                            } else {
                                return null;
                            }
                        } catch (e) {
                            return null;
                        }
                    },
                    this
                );
            }
            /**
             * If normal plugins supported added it to IE plugin list
             */
            if (window.navigator.plugins) {
                arrResult = arrResult.concat(this.getRegularPlugins());
            }
            /**
             * Return plugins list
             */
            return arrResult;
        } catch (e) {
            return [];
        }
    }

    /**
     * Get other browser plugins
     * @return {Object}
     */
    public getRegularPlugins() {
        try {
            /**
             * Plugins list
             * @type {Array}
             */
            let arrPlugins = [];
            /**
             * Get plugins from navigator
             */
            for (let i = 0; i < window.navigator.plugins.length; i++) {
                arrPlugins.push(window.navigator.plugins[i]);
            }
            /**
             * Sort plugins by name
             * @type {Array}
             */
            arrPlugins = arrPlugins.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            });
            /**
             * Extrude plugins info
             */
            return this.map(
                arrPlugins,
                (p) => {
                    let mimeTypes = this.map(
                        p,
                        (mt) => {
                            return [
                                mt.type,
                                mt.suffixes,
                            ].join("~");
                        }
                    ).join(",");
                    return [
                        p.name,
                        p.description,
                        mimeTypes,
                    ].join("::");
                },
                this
            );
        } catch (e) {
            return [];
        }
    }

    /**
     * Get user IP
     * @return {Promise}
     */
    public getIP(callback) {
        try {
            this.getIPFromRTC(callback);
        } catch (e) {
            callback(false);
        }
    }

    /**
     * Get IP from RTC
     * @return {Promise}
     */
    public getIPFromRTC(callback) {
        try {
            window.RTCPeerConnection = (
                window.RTCPeerConnection ||
                window.mozRTCPeerConnection ||
                window.webkitRTCPeerConnection
            );
            if (window.RTCPeerConnection) {
                let pc: any = new window.RTCPeerConnection({iceServers: []});
                pc.onicecandidate = (ice) => {
                    if (!ice || !ice.candidate || !ice.candidate.candidate) {
                        callback(false);
                    } else {
                        let myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(
                            ice.candidate.candidate
                        )[1];
                        pc.onicecandidate = () => {
                            return null;
                        };
                        callback({
                            IP: myIP,
                        });
                    }
                };
                pc.createDataChannel("");
                pc.createOffer().then((desc) => {
                    pc.setLocalDescription(desc);
                });
            } else {
                callback(false);
            }
        } catch (e) {
            callback(false);
        }
    }

    /**
     * Map emulation for Arrays and Objects
     * @param obj
     * @param iterator
     * @param context
     * @return {Array}
     */
    public map(obj, iterator, context?: any): Array<any> {
        let results = [];
        if (obj === null) {
            return results;
        }
        if (Array.prototype.map && obj.map === Array.prototype.map) {
            return obj.map(iterator, context);
        }
        UserID.each(
            obj,
            (value, index, list) => {
                results[results.length] = iterator.call(context, value, index, list);
            },
            context
        );
        return results;
    }
}

module.exports = UserID;
