import {ICacheEntry, ICacheMiddlewareStore} from "../middlewares/Cache";

// noinspection TsLint
declare const localStorage: ICacheMiddlewareStore;

export class LocalStorageCache implements ICacheMiddlewareStore {
    /**
     * Saves an item KV pair to storage
     *
     * @param {string} key
     * @param {string} value
     * @param {number} ttl
     */
    public setItem(key: string, value: string, ttl: number): void {
        localStorage.setItem(key, JSON.stringify({ value, expiry: +Date.now() + ttl * 1000 }), ttl);
    }

    /**
     * Returns serialized cache value (as string) by its key if exists and valid, null otherwise
     *
     * @param  {string}      key
     * @return {string|null}
     */
    public getItem(key: string): string|null {
        const entry = localStorage.getItem(key);
        if (entry === undefined || entry === null) { return null; }

        const data: ICacheEntry = JSON.parse(entry);

        // Wipe out expired cache
        if (+Date.now() > data.expiry) {
            this.removeItem(key);
            return null;
        }

        return data.value;
    }

    /**
     * Removes an item by its key from storage
     *
     * @param {string} key
     */
    public removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}
