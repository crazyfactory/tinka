import {objectToQueryString} from "../internal/formatting";
import {IFetchHeaders, IFetchRequest, IFetchResponse} from "./FetchMiddleware";

import {IMiddleware} from "../Stack";

// Represents nature of cache entry that is persisted into the configured engine.
export interface ICacheEntry {
    value: string;      // text representation of response payload
    type: string;       // the response type.
    url: string;        // the url that responded original cache response
    status: number;     // http response status
    statusText: string; // http response status text. eg: OK
    timestamp: number;  // create timestamp in milliseconds: +Date.now()
    headers: {[index: string]: any}; // response headers
}

// Represents cache options for each Request
export interface IFetchRequestCacheOptions {
    enable: boolean;
    maxAge?: number; // cache TTL in seconds, defaults to 0 = forever
    key?: string;    // optionally a specific key to be used in place of the generated hash
}

// Represents cache flags for Response
export interface IFetchResponseCacheOptions {
    used: boolean;
    timestamp: number; // create timestamp in milliseconds: +Date.now()
    maxAge: number;    // cache TTL in seconds, defaults to 0 = forever
}

// Represents the storage engine functionality
export interface ICacheMiddlewareStore {
    setItem(key: string, value: string): void;
    getItem(key: string): string|undefined;
    removeItem(key: string): void;
}

declare const Response: IFetchResponse<string>;

export class CacheMiddleware implements IMiddleware<IFetchRequest, Promise<IFetchResponse<any>>> {
    protected fallbackStorage: {[index: string]: any} = {};

    /**
     * Constructor.
     *
     * Accepts storage instance.
     *
     * @param {ICacheMiddlewareStore|undefined} storage
     */
    public constructor(protected storage?: ICacheMiddlewareStore) {
    }

    /**
     * Returns a Promise that resolves to Response object using cached payload and headers.
     *
     * @param {ICacheEntry} cachedEntry
     * @param {number}      maxAge
     *
     * @return {Promise}
     */
    public static getCachedResponse(cachedEntry: ICacheEntry, maxAge: number): Promise<IFetchResponse<any>> {
        const response: IFetchResponse<any> = new (Response as any)(cachedEntry.value, cachedEntry);

        response.cache = { used: true, timestamp: cachedEntry.timestamp, maxAge };

        return Promise.resolve(response);
    }

    /**
     * Gets the normalized cache key which is unique to request with respect to uri and params.
     *
     * @param  {IFetchRequest} options
     * @return {string}
     */
    public static getCacheKey(options: IFetchRequest): string {
        let key: string = (options.cache && options.cache.key) || options.url || "";

        if (options.queryParameters) {
            key += "?" + objectToQueryString(options.queryParameters);
        }

        // @todo Maybe hashing?
        return key;
    }

    /**
     * Process the request. First try if we have cache and serve right away,
     * else let the next middleware in pipeline be invoked and cache it.
     *
     * @param  {IFetchRequest}                                   options
     * @param  {(FetchRequest) => Promise<FetchResponse<any>>}  next
     * @return {any}
     */
    public process(options: IFetchRequest, next: (nextOptions: IFetchRequest) => Promise<IFetchResponse<any>>): any {
        // CacheMiddleware not configured/enabled
        if (!options.cache || !options.cache.enable) { return next(options); }

        const key = CacheMiddleware.getCacheKey(options);
        let entry = this.storage && this.storage.getItem(key) || this.fallbackStorage[key];

        if (!entry) { return next(options).then((response) => this.setCache(key, response)); }

        try {
            entry = JSON.parse(entry);
        } catch (e) {
            // CacheMiddleware invalid, proceed normally
            return next(options).then((response) => this.setCache(key, response));
        }

        // CacheMiddleware expired, pass to next and set cache again
        if (options.cache.maxAge && +Date.now() > (entry.timestamp + options.cache.maxAge * 1000)) {
            return next(options).then((response) => this.setCache(key, response));
        }

        return CacheMiddleware.getCachedResponse(entry, options.cache.maxAge || 0);
    }

    /**
     * Persists the cache to storage configured, or in memory if that fails.
     *
     * @param   {string}        key
     * @param   {IFetchResponse} response
     * @returns {IFetchResponse}
     */
    private setCache(key: string, response: IFetchResponse<any>): IFetchResponse<any> {
        const headers: IFetchHeaders = {};
        const clone: IFetchResponse<any> = response.clone();

        if (clone.headers) {
            clone.headers.forEach((value: string, name: string) => headers[name] = value);
        }

        clone.text().then((value: string) => {
            const entry = JSON.stringify({
                value,
                type: clone.type,
                url: clone.url,
                status: clone.status,
                statusText: clone.statusText,
                timestamp: +Date.now(),
                headers
            });

            if (this.storage) {
                try {
                    this.storage.setItem(key, entry);
                } catch (e) {
                    /* istanbul ignore next */
                    this.fallbackStorage[key] = entry;
                }
            } else {
                this.fallbackStorage[key] = entry;
            }
        });

        return response;
    }
}