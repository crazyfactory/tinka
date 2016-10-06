// import {HttpClientConfiguration} from "./http-client-configuration";
import {HttpClient as IHttpClient} from "http-client";
import {IHttpClientMiddleware} from "http-client";
import {HttpClientConfiguration as IHttpClientConfiguration} from "http-client";
import {IHttpClientRequestOptions} from "http-client";
import {HttpClientResponse as IHttpClientResponse} from "http-client";
import {IFetchResponse} from "http-client";

declare var fetch: (url: string, options: any) => Promise<any>;

export class HttpClientConfiguration implements IHttpClientConfiguration {

    static get defaults(): IHttpClientRequestOptions {
        return {
            method: "GET"
        };
    }

    options: IHttpClientRequestOptions;

    constructor(options?: IHttpClientRequestOptions) {
        this.options = options || {};
    }

    withBaseUrl(url: string): HttpClientConfiguration {
        // todo: fail on missing protocol.

        this.options.baseUrl = url;

        return this;
    }
}

export class HttpClient implements IHttpClient {

    static getCombinedUrl(baseUrl: string, urlOrPath: string): string {
        if (urlOrPath.indexOf("://") > -1) {
            return urlOrPath;
        }
        return baseUrl + urlOrPath;
    }

    private middlewares: IHttpClientMiddleware[];
    private configuration: IHttpClientConfiguration;
    private options;

    constructor() {
        this.configuration = new HttpClientConfiguration();
        this.middlewares = [];

        if (typeof fetch === "undefined") {
            throw new Error("fetch() is not defined. Are you missing a polyfill?");
        }
    }

    configure(fn: (config: IHttpClientConfiguration) => void) {
        if (typeof fn === "function") {
            fn(this.configuration);
        } else {
            throw new Error("Expected a function to configure, got " + typeof fn + "instead");
        }
    }

    addMiddleware(func: IHttpClientMiddleware) {
        this.middlewares.push(func);
        return this;
    }


    fetch(url: string, options: IHttpClientRequestOptions = {}): Promise<IHttpClientResponse> {

        let httpClientRequestOptions: IHttpClientRequestOptions = Object.assign(
            {},
            HttpClientConfiguration.defaults,
            this.configuration.options,
            this.options,
            options);

        httpClientRequestOptions.url = url;

        // Create final middleware to perform actual fetch call
        let fetchMiddleware = (options: IHttpClientRequestOptions) => {
            options.url = HttpClient.getCombinedUrl(options.baseUrl, options.url);

            return fetch(options.url, options).then((response) => {
                return response.text().then((text) => {
                    return new HttpClientResponse(response, text);
                });
            });
        };

        let stack = this.middlewares.concat([fetchMiddleware]);

        let next = (options) => {
            let nextMW: IHttpClientMiddleware = stack.shift();
            return nextMW(options, next);
        };
        return next(httpClientRequestOptions);
    }
}

export class HttpClientResponse<T> implements IHttpClientResponse {
    fetchResponse: IFetchResponse;
    body: any;

    get hasError(): boolean {
        return !this.fetchResponse.ok;
    }

    get status() {
        return this.fetchResponse.status;
    }

    get statusText() {
        return this.fetchResponse.statusText;
    }

    get contentType() {
        if (!this.fetchResponse.headers.has("Content-Type")) {
            return undefined;
        }
        return this.fetchResponse.headers.get("Content-Type").split(";")[0];
    }

    get ok() {
        return this.fetchResponse.ok;
    }

    get hasData(): boolean {
        return !(this.status === 204);
    }

    get data(): T {
        switch (this.contentType) {
            case "application/json":
                try {
                    return JSON.parse(this.body) as T;
                } catch (e) {
                    throw Error("Response body can't be parsed.");
                }
            case undefined:
            case "":
                return undefined;
        }

        throw new Error(`Unknown Content-Type "${this.contentType}"`);
    }

    constructor(fetchResponse: IFetchResponse, body: any) {
        this.fetchResponse = fetchResponse;
        this.body = body;
    }
}
