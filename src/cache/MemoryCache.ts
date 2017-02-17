import {ICacheEntry, ICacheMiddlewareStore} from "../middlewares/Cache";

export class MemoryCache implements ICacheMiddlewareStore {
    private data: {[index: string]: any} = {};

    /**
     * Saves an item KV pair to storage
     *
     * @param {string} key
     * @param {string} value
     * @param {number} ttl
     */
    public setItem(key: string, value: string, ttl: number): void {
        this.data[key] = { value, expiry: +Date.now() + ttl * 1000 };
    }

    /**
     * Returns serialized cache value (as string) by its key if exists and valid, null otherwise
     *
     * @param  {string}      key
     * @return {string|null}
     */
    public getItem(key: string): string|null {
        const entry: ICacheEntry = this.data[key];
        if (!entry) { return null; }

        // Wipe out expired cache
        if (+Date.now() > entry.expiry) {
            this.removeItem(key);
            return null;
        }

        return entry.value;
    }

    /**
     * Removes an item by its key from storage
     *
     * @param {string} key
     */
    public removeItem(key: string): void {
        delete this.data[key];
    }
}
