import {ICacheMiddlewareStore} from "../middlewares/Cache";

export class RedisCache implements ICacheMiddlewareStore {
    /**
     * Inject the npm redis client. Run `npm install redis node-fetch` before using. See below snippet for usage.
     *
     * import redis from "redis";
     * import {RedisCache} from ".../cache/RedisCache";
     * import {Cache} from ".../middlewares/Cache";
     * import {Client} from ".../Client";
     *
     * const redisClient = redis.createClient();
     * const redisCache = new RedisCache(redisClient);
     *
     * const serviceClient = new Client();
     * const cache = new Cache({ storage: redisCache });
     * serviceClient.addMiddleware(cache);
     *
     * @param client The redis client
     */
    public constructor(protected client: any) {}

    /**
     * Saves an item KV pair to storage
     *
     * @param {string} key
     * @param {string} value
     * @param {number} ttl
     */
    public setItem(key: string, value: string, ttl: number): void {
        this.client.set(key, value);
        this.client.expire(key, ttl);
    }

    /**
     * Returns serialized cache value (as string) by its key if exists and valid, null otherwise
     *
     * @param  {string}      key
     * @param  {callback}    callback
     * @return {string|null} null
     */
    public getItem(key: string, callback: Function): string|null {
        this.client.get(key, (err: any, entry: any) => callback(err, entry && entry.toString()));
        return null;
    }

    /**
     * Removes an item by its key from storage
     *
     * @param {string} key
     */
    public removeItem(key: string): void {
        this.client.del(key);
    }
}
