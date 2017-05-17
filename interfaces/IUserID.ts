"use strict";
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
  getUID(callback);

  /**
   * Get Plugins
   * @return {Object|boolean}
   */
  getPlugins(): any|boolean;

  /**
   * Get IE plugins
   * @return {Array}
   */
  getIEPlugins(): any[];

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
   * Get user IP from server
   * @param callback
   */
  getIPFromServer(callback);

  /**
   * Map emulation for Arrays and Objects
   * @param obj
   * @param iterator
   * @param context
   * @return {Array}
   */
  map(obj, iterator, context?: any): any[];
}
/**
 * Export the IUserID interface
 */
export default IUserID;
