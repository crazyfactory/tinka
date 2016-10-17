
declare var fetch: (url: string, options: any) => Promise<any>;

export interface IHttpClientRequestOptions {
    baseUrl?: string;
    method?: string;
    url?: string;
    data?: any;
    files?: any[];
    headers?: any;
}

export interface IFetchResponse {
    body: any;
    bodyUsed: boolean;
    headers: any;
    ok: boolean;
    status: number;
    statusText: string;
    type: string;
    url: string;
    json: () => Promise <any>;
    text: () => Promise <any>;
}

export interface IHttpClientMiddleware {
    (config: IHttpClientRequestOptions, next: (options: IHttpClientRequestOptions) => Promise<any>):
        void | IHttpClientRequestOptions | HttpClientResponse<any>;
}

export class HttpClientConfiguration {

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

export class HttpClient {

    static getCombinedUrl(baseUrl: string, urlOrPath: string): string {
        if (urlOrPath.indexOf("://") > -1) {
            return urlOrPath;
        }
        return (baseUrl || "") + urlOrPath;
    }

    private middlewares: IHttpClientMiddleware[];
    private configuration: HttpClientConfiguration;
    private options;

    constructor() {
        this.configuration = new HttpClientConfiguration();
        this.middlewares = [];

        if (typeof fetch === "undefined") {
            throw new Error("fetch() is not defined. Are you missing a polyfill?");
        }
    }

    configure(fn: (config: HttpClientConfiguration) => void) {
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


    fetch(url: string, options: IHttpClientRequestOptions = {}): Promise<HttpClientResponse<any>> {

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

export class HttpClientResponse<T> {
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

export class HttpApiClient extends HttpClient {

    baseUrl: any;

    constructor(baseUrl: string = undefined) {
        super();
        this.baseUrl = baseUrl;
    }

    request(method: string, url: string, data: any, files: any[], options: IHttpClientRequestOptions) {

        if (typeof method !== "string") {
            throw new Error("method must be a string");
        }

        if (["GET", "HEAD", "DELETE", "POST", "PATCH", "PUT"].indexOf(method) < 0) {
            throw new Error("method can be one of GET, HEAD, DELETE, PATCH, POST, PUT");
        }

        if (typeof url !== "string") {
            throw new Error("url must be a string");
        }

        if (typeof data !== "object" && typeof data !== "undefined") {
            throw new Error("data must be an object or undefined");
        }

        if (typeof files !== "object" && typeof files !== "undefined") {
            throw new Error("files must be an object or undefined");
        }

        if (typeof options !== "object" && typeof options !== "undefined") {
            throw new Error("options must be an object or undefined");
        }

        // Validate method/parameter combinations
        switch (method) {
            case "GET":
                if (data || files) {
                    throw new Error("data and files cannot be defined on a GET call");
                }
                break;
            case "HEAD":
                if (data || files) {
                    throw new Error("data and files cannot be defined on a HEAD call");
                }
                break;
            case "DELETE":
                if (files) {
                    throw new Error("files cannot be defined on a DELETE call");
                }
                break;
        }

        options = options || {};

        options.method = method;
        options.url = url;

        if (data) {
            options.data = data;
        }
        if (files) {
            options.files = files;
        }

        let requestConfig: any = {};

        this.configure((config) => {
            if (this.baseUrl) {
                config.withBaseUrl(this.baseUrl);
            }
            requestConfig = config;
        });

        let httpClientRequestOptions: IHttpClientRequestOptions = Object.assign(
            {},
            HttpClientConfiguration.defaults,
            requestConfig.options,
            options);

        return this.fetch(url, httpClientRequestOptions);
    }

    get<T>(url: string, options?: IHttpClientRequestOptions): Promise<HttpClientResponse<T>> {
        return this.request("GET", url, undefined, undefined, options);
    }

    head<T>(url: string, options?: IHttpClientRequestOptions): Promise<HttpClientResponse<T>> {
        return this.request("HEAD", url, undefined, undefined, options);
    }

    delete<T>(url: string, data?: any, options?: IHttpClientRequestOptions): Promise<HttpClientResponse<T>> {
        return this.request("DELETE", url, data, undefined, options);
    };

    patch<T>(url: string, data?: any, files?: any, options?: IHttpClientRequestOptions): Promise<HttpClientResponse<T>> {
        return this.request("PATCH", url, data, files, options);
    };

    post<T>(url: string, data?: any, files?: any, options?: IHttpClientRequestOptions): Promise<HttpClientResponse<T>> {
        return this.request("POST", url, data, files, options);
    };

    put<T>(url: string, data?: any, files?: any, options?: IHttpClientRequestOptions): Promise<HttpClientResponse<T>> {
        return this.request("PUT", url, data, files, options);
    };

}
