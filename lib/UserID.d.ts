/**
 * Import interface
 */
import IUserID from "../interfaces/IUserID";
/**
 * User ID class
 */
export default class UserID implements IUserID {
    /**
     * Clear previous version of FingerPrint
     */
    static clearPrevious(): void;
    /**
     * 32 bit FNV-1a hash
     * @param str
     * @param hash
     * @return {number}
     */
    static fnv32a(str: any, hash: any): number;
    /**
     * Convert string to binary
     * @param val
     * @return {string}
     */
    static tobinary(val: any): string;
    /**
     * Get FingerPrint Hash
     * @param dump
     * @return {string}
     */
    static getFingerPrintHash(dump: any): string;
    /**
     * Get User Language
     * @return {Object|boolean}
     */
    static getUserLanguage(): Object | boolean;
    /**
     * Get Timezone Offset
     * @return {Object|boolean}
     */
    static getTimezoneOffset(): Object | boolean;
    /**
     * Each emulation for Arrays and Objects
     * @param obj
     * @param iterator
     * @param context
     */
    static each(obj: any, iterator: any, context: any): void;
    /**
     * Declare UserID properties
     */
    EverCookie: any;
    IDEverCookie: any;
    IDUID: any;
    IDBASE: any;
    IDTested: any;
    Settings: any;
    /**
     * User ID constructor
     */
    constructor(settings?: any);
    /**
     * Get user ID
     * @return {string}
     */
    getID(): string;
    /**
     * Get user full ID
     * @param callback
     */
    getUID(callback: any): void;
    /**
     * Get Plugins
     * @return {Object|boolean}
     */
    getPlugins(): Object | boolean;
    /**
     * Get IE plugins
     * @return {Array}
     */
    getIEPlugins(): Array<any>;
    /**
     * Get other browser plugins
     * @return {Object}
     */
    getRegularPlugins(): any[];
    /**
     * Get user IP
     * @return {Promise}
     */
    getIP(callback: any): void;
    /**
     * Get IP from RTC
     * @return {Promise}
     */
    getIPFromRTC(callback: any): void;
    /**
     * Get user IP from server
     * @param callback
     */
    getIPFromServer(callback: any): void;
    /**
     * Map emulation for Arrays and Objects
     * @param obj
     * @param iterator
     * @param context
     * @return {Array}
     */
    map(obj: any, iterator: any, context?: any): Array<any>;
}
