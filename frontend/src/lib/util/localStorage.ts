/**
 * Session expiration time (48 hours in milliseconds)
 */
export const SESSION_EXPIRE_TIME = 48 * 60 * 60 * 1000;

/**
 * Storage item interface for expiration handling
 */
interface StorageItem {
  value: any;
  expiry: number;
}

/**
 * Abstract implementation of the window.localStorage with expiration support
 */
export class LocalStorage {
  private static DEFAULT_EXPIRATION = SESSION_EXPIRE_TIME; // 48 hours in milliseconds

  /**
   * This method saves an object to localstorage with expiration
   * @param {string} key The key which will be used to reference the object
   * @param {any} value The value to save
   * @param {number} [expirationMs] Optional expiration time in milliseconds
   * @returns {boolean} true if successful, else false
   */
  static save(key: string, value: any, expirationMs?: number): boolean {
    try {
      const item: StorageItem = {
        value,
        expiry: Date.now() + (expirationMs || this.DEFAULT_EXPIRATION),
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error("Error saving to local storage:", error);
      return false;
    }
  }

  /**
   * The load method returns the parsed object stored in the localstorage if not expired
   * @param {string} key The key used to save the object
   * @returns {any | null} parsed object stored or null if expired or not found
   */
  static load(key: string): any | null {
    try {
      const itemString = localStorage.getItem(key);
      if (!itemString) return null;

      const item = JSON.parse(itemString) as StorageItem;
      if (item.expiry) {
        if (Date.now() > item.expiry) {
          this.remove(key);
          return null;
        }
      } else return null;
      return item.value;
    } catch (error) {
      console.error("Error loading from local storage:", error);
      return null;
    }
  }

  /**
   * This method removes an object from the localstorage
   * @param {string} key The key to remove
   * @returns {boolean} true if successful, else false
   */
  static remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from local storage:", error);
      return false;
    }
  }

  /**
   * This method sets a new default expiration time
   * @param {number} expirationMs New default expiration time in milliseconds
   */
  static setDefaultExpiration(expirationMs: number): void {
    this.DEFAULT_EXPIRATION = expirationMs;
  }

  /**
   * Simple save without expiration (for backward compatibility)
   * @param {string} key The key to save
   * @param {any} value The value to save
   * @returns {boolean} true if successful, else false
   */
  static setItem(key: string, value: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error saving to local storage:", error);
      return false;
    }
  }

  /**
   * Simple load without expiration (for backward compatibility)
   * @param {string} key The key to load
   * @returns {any | null} parsed object or null if not found
   */
  static getItem(key: string): any | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error loading from local storage:", error);
      return null;
    }
  }
}
