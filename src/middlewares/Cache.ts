import {objectToQueryString} from "../internal/formatting";
import {FetchRequest, FetchResponse} from "./Fetch";

import {LocalStorageCache} from "../cache/LocalStorageCache";
import {MemoryCache} from "../cache/MemoryCache";
import {RedisCache} from "../cache/RedisCache";

import {IMiddleware} from "../Stack";

// Represents nature of cache entry that is persisted into the configured engine.
export interface ICacheEntry {
    value: string;
    expiry: number; // expiry timestamp in milliseconds
    metadata?: {[index: string]: any};
}

// Represents cache options for each cache buckets added to the cache middleware
export interface IFetchRequestCacheOptions {
    enable: boolean;
    path: string; // relative path, shall be resolved from FetchRequest.baseUrl
    maxAge?: number; // cache ttl in seconds
    key?: string; // optionally a specific key to be used in place of the generated hash
}

// Represents a signature of cache bucket, each bucket can respond to certain endpoint, have its own cache key and ttl
export interface ICacheBucket {
    options: IFetchRequestCacheOptions;
}

// Represents the storage engine functionality
export interface ICacheMiddlewareStore {
    setItem(key: string, value: string, maxAge: number): void;
    getItem(key: string): string|null;
    removeItem(key: string): void;
}

// Represents the cache middleware global configration
export interface ICacheConfiguration {
    maxAge?: number;
    storage?: string;
    namespace?: string; // prepends cache key useful when using multiple service clients &/or cache providers
}

// noinspection TsLint
declare const Response: FetchResponse<string>;

export class Cache implements IMiddleware<FetchRequest, Promise<FetchResponse<any>>> {
    protected buckets: ICacheBucket[] = [];
    protected storage: ICacheMiddlewareStore;

    /**
     * Constructor.
     *
     * Accepts global configuration, sets default storage engine.
     *
     * @param {ICacheConfiguration} config
     */
    public constructor(protected config: ICacheConfiguration = {}) {
        this.storage = this.getDefaultCacheStorage();
    }

    /**
     * Adds a new cache bucket to the stack. Each bucket can respond to certain endpoint, have its own cache key and ttl.
     *
     * @param {IFetchRequestCacheOptions} options
     */
    public addBucket(options: IFetchRequestCacheOptions): void {
        this.buckets.push({ options });
    }

    /**
     * Process the request. First try if we have cache and serve right away,
     * else let the next middleware in pileline be invoked and cache it.
     *
     * @param  {FetchRequest} options
     * @param  {callback}       next
     * @return {any}
     */
    public process(options: FetchRequest, next: (nextOptions: FetchRequest) => Promise<FetchResponse<any>>): any {
        const bucket = this.getEffectiveBucket(options);
        const cacheable: boolean = (options.method || "GET").toLowerCase() === "get";

        return cacheable && bucket && this.getCachedResponse(options, bucket)
        || next(options).then((response: FetchResponse<any>) => {
            if (!cacheable || !bucket) { return response; }

            const clone = response.clone();
            const ttl = bucket.options.maxAge || this.config.maxAge || 600; // TTL fallback to 10 min
            clone.text().then((text: string) => this.storage.setItem(this.getCacheKey(options, bucket), text, ttl) );

            return response;
        });
    }

    /**
     * If possible return the desired type of store or fallback to default in-memory store.
     *
     * @return {ICacheMiddlewareStore}
     */
    protected getDefaultCacheStorage(): ICacheMiddlewareStore {
        if (this.config.storage === "localStorage") {
            return new LocalStorageCache();
        }

        if (this.config.storage === "redis") {
            return new RedisCache();
        }

        return new MemoryCache();
    }

    /**
     * Returns a Promise that resolves to Response object using cached value. Returns null if the cache is non existent or expired.
     *
     * @param  {FetchRequest} options
     * @param  {ICacheBucket} bucket
     * @return {Promise|null}
     */
    protected getCachedResponse(options: FetchRequest, bucket: ICacheBucket): Promise<FetchResponse<any>>|null {
        const value = this.storage.getItem(this.getCacheKey(options, bucket));
        if (!value) { return null; }

        return Promise.resolve(new Response(value, undefined));
    }

    /**
     * Returns a bucket that is active and can actually respond to currently requested endpoint.
     *
     * @param  {FetchRequest} options
     * @return {ICacheBucket|null}
     */
    protected getEffectiveBucket(options: FetchRequest): ICacheBucket|null {
        return this.buckets.find((bucket: ICacheBucket) => {
            return bucket.options.enable === true
                && options.url !== undefined
                && options.url.indexOf(bucket.options.path) > -1;
        });
    }

    /**
     * Gets the normalized cache key which is unique to request with respect to uri and params.
     *
     * @param  {FetchRequest} options
     * @param  {ICacheBucket} bucket
     * @return {string}
     */
    protected getCacheKey(options: FetchRequest, bucket: ICacheBucket): string {
        let key: string = bucket.options.key || options.url || bucket.options.path;
        if (options.queryParameters) {
            key += "?" + objectToQueryString(options.queryParameters);
        }

        return (this.config.namespace || "") + key;
    }
}
