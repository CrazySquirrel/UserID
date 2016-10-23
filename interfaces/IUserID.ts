"use strict";
/**
 * The IUserID interface
 */
interface IUserID {
    /**
     * Declare UserID properties
     */
    EverCookie: any;
    IDEverCookie: any;
    IDUID: any;
    IDBASE: any;

    /**
     * Get user ID
     * @return {string}
     */
    getID();

    /**
     * Get user full ID
     * @param callback
     */
    getUID(callback);

    /**
     * Get Plugins
     * @return {Object|boolean}
     */
    getPlugins(): Object|boolean;

    /**
     * Get IE plugins
     * @return {Array}
     */
    getIEPlugins();

    /**
     * Get other browser plugins
     * @return {Object}
     */
    getRegularPlugins();

    /**
     * Get user IP
     * @return {Promise}
     */
    getIP(callback);

    /**
     * Get IP from RTC
     * @return {Promise}
     */
    getIPFromRTC(callback);

    /**
     * Map emulation for Arrays and Objects
     * @param obj
     * @param iterator
     * @param context
     * @return {Array}
     */
    map(obj, iterator, context?: any): Array<any>;
}
/**
 * Export the IUserID interface
 */
export default IUserID;
