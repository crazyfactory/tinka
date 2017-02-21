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
    getItem(key: string, callback?: Function): string|null;
    removeItem(key: string): void;
}

// Represents the cache middleware global configration
export interface ICacheConfiguration {
    maxAge?: number; // The global cache ttl configuration for this middleware in case the bucket doesnt have one
    storage?: string|ICacheMiddlewareStore; // Can be string value or an instance of ICacheMiddlewareStore
    namespace?: string; // prepends cache key useful when using multiple service clients &/or cache providers
}

// noinspection TsLint
declare const Response: FetchResponse<string>;

export class Cache implements IMiddleware<FetchRequest, Promise<FetchResponse<any>>> {
    private isRedis: boolean = false;
    private buckets: ICacheBucket[] = [];
    private storage: ICacheMiddlewareStore;

    /**
     * Constructor.
     *
     * Accepts global configuration, sets default storage engine.
     *
     * @param {ICacheConfiguration} config
     */
    public constructor(protected config: ICacheConfiguration = {}) {
        this.setStorage();
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
        const bucket: ICacheBucket|null = this.getEffectiveBucket(options);
        const cacheable: boolean = (options.method || "GET").toLowerCase() === "get";

        if (!cacheable || !bucket) { return next(options); }

        return this.getCachedResponse(options, bucket, next);
    }

    /**
     * Sets the storage engine from config or fallback to default in-memory store.
     */
    protected setStorage(): void {
        if (this.config.storage === "localStorage") {
            this.storage = new LocalStorageCache();
        } else if (typeof this.config.storage === "object") {
            this.storage = this.config.storage;
        } else {
            this.storage = new MemoryCache();
        }

        this.isRedis = this.storage instanceof RedisCache;
    }

    /**
     * Returns a Promise that resolves to Response object using cached value if available.
     * Sets the cache and returns a promise that resolves to Response if the cache is non existent or expired.
     *
     * @param  {FetchRequest} options
     * @param  {ICacheBucket} bucket
     * @param  {callback}     next
     * @return {Promise|null}
     */
    protected getCachedResponse(options: FetchRequest, bucket: ICacheBucket, next: (nextOptions: FetchRequest) => Promise<FetchResponse<any>>): Promise<FetchResponse<any>> {
        const setCache = (response: FetchResponse<any>) => {
            const clone: FetchResponse<any> = response.clone();
            const ttl: number = bucket.options.maxAge || this.config.maxAge || 600; // TTL fallback to 10 min
            clone.text().then((text: string) => this.storage.setItem(this.getCacheKey(options, bucket), text, ttl) );

            return response;
        };

        if (this.isRedis) {
            return new Promise((resolve: Function, reject: Function): any => {
                this.storage.getItem(this.getCacheKey(options, bucket), (err: any, value: any) => {
                    return value ? resolve(value) : reject(err);
                });
            })
            .then((value: string) => Promise.resolve(new Response(value, undefined)))
            .catch((reason: any) => next(options).then(setCache));
        }

        const value = this.storage.getItem(this.getCacheKey(options, bucket));

        return value ? Promise.resolve(new Response(value, undefined)) : next(options).then(setCache);
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
                && bucket.options.path === options.url;
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
