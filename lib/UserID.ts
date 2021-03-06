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
const btoa = require("btoa");

window.Promise = window.Promise || require("promise-polyfill");

/**
 * Import dependency classes
 */
import EverCookie from "EverCookie/lib/EverCookie";
import UtilsBrowser from "Utils/lib/UtilsBrowser";
import UtilsMain from "Utils/lib/UtilsMain";
import UtilsUser from "Utils/lib/UtilsUser";

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
            key.indexOf("#PACKAGE_NAME#") !== -1 &&
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
          const LocalEverCookie = new EverCookie(key);
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
    const i1 = 4004;
    const i2 = 1471357547; // Fake date.
    const i3 = UserID.fnv32a(dump.substr(0, dump.length / 2), 0x811c9dc5);
    let i4 = UserID.fnv32a(dump.substr(dump.length / 2), i3);

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
  public static getUserLanguage(): any|boolean {
    try {
      const _navigator: any = window.navigator;
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
  public static getTimezoneOffset(): any|boolean {
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
      for (let j = 0; j < obj.length; j++) {
        const key = obj[j];
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
  public IDEverCookie: string;
  public IDUID: string;
  public IDBASE: string;
  public IDTested: string;
  public isAccurate: boolean;
  public UserData: any;

  public Settings: any = {
    IPUrl: "",
  };

  /**
   * User ID constructor
   */
  constructor(settings: any = {}) {
    /**
     * Clear previous version of FingerPrint
     */
    UserID.clearPrevious();
    /**
     * Generate IDs
     */
    this.Settings = settings;
    this.IDEverCookie = "";
    this.IDTested = "";
    this.IDUID = "";
    this.UserData = JSON.stringify([
      {
        UserAgent: navigator.userAgent,
      },
      UtilsUser.getInfo(),
      UserID.getUserLanguage(),
      UserID.getTimezoneOffset(),
      this.getPlugins(),
    ]);
    this.IDBASE = UserID.getFingerPrintHash(this.UserData);
    /**
     * Init EveryCookie and get ID
     * @type {EverCookie}
     */
    this.isAccurate = false;
    this.EverCookie = new EverCookie("#PACKAGE_NAME#_#PACKAGE_VERSION#");
    this.IDEverCookie = this.EverCookie.getItem(true, "FingerPrint");
    this.IDTested = this.EverCookie.getItem(true, "FingerPrintTested");
    /**
     * Get full ID
     */
    this.getUID((result) => {
      /**
       * Convert user signs to Rambler format
       */
      this.UserData = JSON.stringify(result);
      this.IDUID = UserID.getFingerPrintHash(this.UserData);
      /**
       * Write full user ID into the EverCookie
       */
      if (this.IDEverCookie !== this.IDUID) {
        this.EverCookie.setItem(true, "FingerPrint", this.IDUID);
      }
      this.isAccurate = true;
    });

    UtilsMain.implementationStaticMethods(this, "UserID");
  }

  /**
   * Get user ID
   * @return {string}
   */
  public getID(): any {
    /**
     * Return full user ID, ID from storage or base ID if one of them exist
     */
    return this.IDTested || this.IDUID || this.IDEverCookie || this.IDBASE;
  }

  /**
   * Get accurate user ID
   * @return {Promise<any>}
   */
  public getAccurateID(): Promise<any> {
    return new Promise((resolve) => {
      if (this.isAccurate) {
        resolve(this.getID());
      } else {
        const ID = setInterval(
            () => {
              if (this.isAccurate) {
                clearInterval(ID);
                resolve(this.getID());
              }
            },
            100,
        );
      }
    });
  }

  /**
   * Get user full ID
   * @param callback
   */
  public getUID(callback) {
    this.getIP((result) => {
      callback([
        {
          UserAgent: navigator.userAgent,
        },
        UtilsUser.getInfo(),
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
  public getPlugins(): any|boolean {
    try {
      if (UtilsBrowser.isMSIE()) {
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
  public getIEPlugins(): any[] {
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
        const arrExpectedPluginsList = [
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
                const a = new window.ActiveXObject(name);
                if (a) {
                  return name;
                } else {
                  return null;
                }
              } catch (e) {
                return null;
              }
            },
            this,
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
            const mimeTypes = this.map(
                p,
                (mt) => {
                  return [
                    mt.type,
                    mt.suffixes,
                  ].join("~");
                },
            ).join(",");
            return [
              p.name,
              p.description,
              mimeTypes,
            ].join("::");
          },
          this,
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
      if (
          this.Settings &&
          this.Settings.IPUrl
      ) {
        this.getIPFromServer((result) => {
          if (result) {
            callback(result);
          } else {
            this.getIPFromRTC((_result) => {
              if (_result) {
                callback(_result);
              } else {
                callback({IP: "0.0.0.0"});
              }
            });
          }
        });
      } else {
        this.getIPFromRTC((result) => {
          if (result) {
            callback(result);
          } else {
            callback({IP: "0.0.0.0"});
          }
        });
      }
    } catch (e) {
      callback({IP: "0.0.0.0"});
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
        const pc: any = new window.RTCPeerConnection({iceServers: []});
        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate || !ice.candidate.candidate) {
            callback(false);
          } else {
            const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(
                ice.candidate.candidate,
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
   * Get user IP from server
   * @param callback
   */
  public getIPFromServer(callback) {
    try {
      if (
          this.Settings &&
          this.Settings.IPUrl
      ) {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          if (xhr.readyState !== 4) {
            return;
          }
          if (xhr.status === 200 && xhr.responseText) {
            callback({
              IP: xhr.responseText,
            });
          } else {
            callback(false);
          }
        };
        xhr.onerror = () => {
          callback(false);
        };
        xhr.open("GET", this.Settings.IPUrl);
        xhr.send();
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
  public map(obj, iterator, context?: any): any[] {
    const results = [];
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
        context,
    );
    return results;
  }
}

module.exports = UserID;
