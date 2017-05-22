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
    headers: { [index: string]: any }; // response headers
}

// Represents cache options for each Request
export interface IFetchRequestCacheOptions {
    enable: boolean;
    maxAge?: number; // cache TTL in seconds, defaults to 0 = forever
    key?: string;    // optionally a specific key to be used in place of the generated hash
}

// Represents cache flags for Response
export interface IFetchResponseCacheOptions {
    fromCache?: boolean; // marks a result as being from the cache
    timestamp?: number;  // create timestamp in milliseconds: +Date.now()
    age?: number;        // the actual age in seconds
}

// Represents the storage engine functionality
export interface ICacheMiddlewareStore {
    setItem(key: string, value: string): void;
    getItem(key: string): string | undefined;
    removeItem(key: string): void;
}

declare const Response: IFetchResponse<string>;

export class CacheMiddleware implements IMiddleware<IFetchRequest, Promise<IFetchResponse<any>>> {
    protected fallbackStorage: { [index: string]: any } = {};

    /**
     * Constructor.
     *
     * Accepts storage instance.
     *
     * @param {ICacheMiddlewareStore|undefined} storage
     */
    public constructor(protected storage?: ICacheMiddlewareStore) {
    }

    //noinspection JSMethodCanBeStatic
    /**
     * Returns a Promise that resolves to Response object using cached payload and headers.
     *
     * @param str
     * @return {Promise}
     */
    public unstringifyResponse(str: string): IFetchResponse<any> {

        let entry: ICacheEntry;

        try {
            entry = JSON.parse(str);
        } catch (e) {
            // Data is corrupt or empty CacheMiddleware invalid, proceed normally
            return null;
        }

        // json can be lots of things, we are only interested in real non-null objects.
        if (entry === null || typeof entry !== "object") {
            return null;
        }

        const response: IFetchResponse<any> = new (Response as any)(entry.value, entry);

        response.cache = {
            fromCache: true,
            timestamp: entry.timestamp,
            age: (entry.timestamp - Date.now()) / 1000
        };

        return response;
    }

    public stringifyResponse(response: IFetchResponse<any>): Promise<string> {
        const clone: IFetchResponse<any> = response.clone();

        const headers: IFetchHeaders = {};
        if (clone.headers) {
            clone.headers.forEach((value: string, name: string) => headers[name] = value);
        }

        return clone.text().then((value: string) => {
            return JSON.stringify({
                value,
                type: clone.type,
                url: clone.url,
                status: clone.status,
                statusText: clone.statusText,
                timestamp: Date.now(),
                headers
            });
        });
    }

    //noinspection JSMethodCanBeStatic
    /**
     * Gets the normalized cache key which is unique to request with respect to uri and params.
     *
     * @param  {IFetchRequest} options
     * @return {string}
     */
    public getCacheKey(options: IFetchRequest): string {
        if (options.cache && options.cache.key) {
            return options.cache.key;
        }

        const url: string = (options.baseUrl || "") + (options.url || "");

        let key: string = (options.method || "GET") + "_" + url;

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
        if (!options.cache || !options.cache.enable) {
            return next(options);
        }

        const key = this.getCacheKey(options);
        const entry = this.getCache(key);

        // No entry found or corrupt, pass to next and cache the response
        if (!entry) {
            return next(options).then((response) => this.setCache(key, response));
        }

        // Cache entry expired, pass to next and replace the cached response
        if (options.cache.maxAge && Date.now() > (entry.cache.timestamp + options.cache.maxAge * 1000)) {
            return next(options).then((response) => this.setCache(key, response));
        }

        // format and return cached entry
        return entry;
    }

    /**
     * Persists the cache to storage configured, or in memory if that fails.
     *
     * @param   {string}        key
     * @param   {IFetchResponse} response
     *
     * @return  Promise<IFetchResponse<any>>
     */
    public setCache<T>(key: string, response: IFetchResponse<T>): Promise<IFetchResponse<T>> {
        return this.stringifyResponse(response).then((value) => {
            if (this.storage) {
                try {
                    this.storage.setItem(key, value);
                } catch (e) {
                    this.fallbackStorage[key] = value;
                }
            } else {
                this.fallbackStorage[key] = value;
            }

            return response;
        });
    }

    public getCache(key: string): IFetchResponse<any> {
        const entryJson = (this.storage && this.storage.getItem(key))
            || (key in this.fallbackStorage && this.fallbackStorage[key]);

        return this.unstringifyResponse(entryJson);
    }
}
