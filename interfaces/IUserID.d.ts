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
    getID(): any;
    /**
     * Get user full ID
     * @param callback
     */
    getUID(callback: any): any;
    /**
     * Get Plugins
     * @return {Object|boolean}
     */
    getPlugins(): Object | boolean;
    /**
     * Get IE plugins
     * @return {Array}
     */
    getIEPlugins(): any;
    /**
     * Get other browser plugins
     * @return {Object}
     */
    getRegularPlugins(): any;
    /**
     * Get user IP
     * @return {Promise}
     */
    getIP(callback: any): any;
    /**
     * Get IP from RTC
     * @return {Promise}
     */
    getIPFromRTC(callback: any): any;
    /**
     * Map emulation for Arrays and Objects
     * @param obj
     * @param iterator
     * @param context
     * @return {Array}
     */
    map(obj: any, iterator: any, context?: any): Array<any>;
}
export default IUserID;
