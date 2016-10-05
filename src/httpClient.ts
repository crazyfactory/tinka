// import {HttpClientConfiguration} from "./http-client-configuration";

import {HttpClient as IHttpClient} from "http-client";
import {IHttpClientMiddleware} from "http-client";
import {HttpClientConfiguration as IHttpClientConfiguration} from "http-client";
import {IHttpClientRequestOptions} from "http-client";
import {HttpClientResponse as IHttpClientResponse} from "http-client";
import {FetchResponse} from "http-client";

declare var fetch: (url: string, options: any) => Promise<any>;

export class HttpClientConfiguration implements IHttpClientConfiguration {
    defaults: any;

    getDefaults(): IHttpClientRequestOptions {
        return this.defaults;
    }

    public options: IHttpClientRequestOptions;

//    private base_url:string;
    constructor(options?: IHttpClientRequestOptions) {
        this.defaults = {
            method: "GET"
        };
        this.options = options || {};
    }

    withBaseUrl(url: string): HttpClientConfiguration {
        // todo: fail on illegal characters????
        // if has :// make sure it's http:// or https://
        this.options.base_url = url;
        // remove trailing slash??? or ensure there is one???
        return this;
    }
}

export class HttpClient implements IHttpClient {
    private middlewares: IHttpClientMiddleware[];
    private configuration: IHttpClientConfiguration;
    private options;

    configure(fn: (config: IHttpClientConfiguration) => void) {
        if (typeof fn === "function") {
            fn(this.configuration);
        } else {
            throw new Error("Expected a function to configure, got " + typeof fn + "instead");
        }
    }

    constructor() {
        this.configuration = new HttpClientConfiguration();
        this.middlewares = [];
        if (typeof fetch === "undefined") {
            throw new Error("Please use a fetch polyfill");
        }
    }

    addMiddleware(func: IHttpClientMiddleware) {
        this.middlewares.push(func);
        return this;
    }

    public static getCombinedUrl(base_url: string, url_or_path: string): string {
        if (url_or_path.indexOf("http") === 0) {
            return url_or_path;
        }
        return base_url + url_or_path;
    }

    fetch(url: string, options: IHttpClientRequestOptions = {}): Promise<IHttpClientResponse> {

        let httpClientRequestOptions: IHttpClientRequestOptions = Object.assign(
            {},
            this.configuration.getDefaults(),
            this.configuration.options,
            this.options, options);
        httpClientRequestOptions.url = url;
        // Create final middleware to perform actual fetch call
        let fetchMiddleware = (options: IHttpClientRequestOptions) => {
            options.url = HttpClient.getCombinedUrl(options.base_url, options.url);

            // let promise = new Promise(null, null);
            //
            // let fetchPromise = fetch(options.url, options);
            // fetchPromise.catch((reason) => {
            //     promise.reject(reason);
            // });
            // // fetchPromise.then((response: Response) => )
            //
            // //let hcr = new HttpClientRequest();
            return fetch(options.url, options).then((response) => {
                // probably make a HttpClientResponse object here.
                // throw response in and return that.
                // when we throw response in, it should build up a promise and resolve.

                return response.text().then((text) => {
                    return new HttpClientResponse(response, text);
                });
            });
            //
            // return promise;
        };

        let middlewares = this.middlewares.concat([fetchMiddleware]);

        let next = (options) => {
            let nextMW: IHttpClientMiddleware = middlewares.shift();
            if (!nextMW) {
                throw new Error("No next :(");
            }
            return nextMW(options, next);
        };
        return next(httpClientRequestOptions);
    }
}
export class HttpClientResponse<T> implements IHttpClientResponse {
    fetchResponse: FetchResponse;
    body: any;

    get hasError(): boolean {
        return !this.fetchResponse.ok;
    }

    //
    get status() {
        return this.fetchResponse.status;
    }

    //
    get statusText() {
        return this.fetchResponse.statusText;
    }

    get contentType() {
        if (!this.fetchResponse.headers.has("Content-Type")) {
            return undefined;
        }
        return this.fetchResponse.headers.get("Content-Type").split(";")[0];
    }

    //
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
                    throw Error("Cannot parse");
                }
            case undefined:
            case "":
                return undefined;
        }

        throw new Error("Unknown Content-Type");
    }

    constructor(fetchResponse: FetchResponse, body: any) {
        this.fetchResponse = fetchResponse;
        this.body = body;
    }
}
