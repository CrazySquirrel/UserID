/**
 * The IUserID interface
 */
interface IUserID {
    /**
     * Declare UserID properties
     */
    EverCookie: any;
    IDEverCookie: string;
    IDUID: string;
    IDBASE: string;
    IDTested: string;
    isAccurate: boolean;
    UserData: any;
    Settings: any;
    /**
     * Get user ID
     * @return {string}
     */
    getID(): any;
    /**
     * Get accurate user ID
     * @return {Promise<any>}
     */
    getAccurateID(): Promise<any>;
    /**
     * Get user full ID
     * @param callback
     */
    getUID(callback: any): any;
    /**
     * Get Plugins
     * @return {Object|boolean}
     */
    getPlugins(): any | boolean;
    /**
     * Get IE plugins
     * @return {Array}
     */
    getIEPlugins(): any[];
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
     * Get user IP from server
     * @param callback
     */
    getIPFromServer(callback: any): any;
    /**
     * Map emulation for Arrays and Objects
     * @param obj
     * @param iterator
     * @param context
     * @return {Array}
     */
    map(obj: any, iterator: any, context?: any): any[];
}
export default IUserID;
