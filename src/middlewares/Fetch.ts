import {combineUrlWithBaseUrl, combineUrlWithQueryParameters} from "../internal/formatting";
import {IMiddleware} from "../Stack";

export type FetchHeaders = {
    [key: string]: string;
};

export type FetchResponse<T> = {
    new(body: any, init: any): FetchResponse<T>;
    body: string;
    bodyUsed: boolean;
    headers?: FetchHeaders;
    ok: boolean;
    status: number;
    statusText: string;
    type: string;
    url: string;
    json: () => Promise<T>;
    text: () => Promise<string>;
};

export type FetchRequest = {
    url?: string;
    baseUrl?: string;
    method?: string;
    queryParameters?: {[key: string]: string};
    headers?: FetchHeaders;
    body?: string;
};

//noinspection TsLint
declare const fetch: (url: string, options: any) => Promise<FetchResponse<any>>;

export class Fetch implements IMiddleware<FetchRequest, Promise<FetchResponse<any>>> {

    constructor(public defaultOptions: FetchRequest = {}) { }

    public preprocess(options: FetchRequest): FetchRequest {

        // Merge with the defaults
        options = Object.assign({}, this.defaultOptions, options);

        // Construct target Uri
        options.url = combineUrlWithBaseUrl(options.url, options.baseUrl);

        // Append query parameters
        options.url = combineUrlWithQueryParameters(options.url, options.queryParameters);

        return options;
    }

    public process(options: FetchRequest/*, next: (nextOptions: FetchRequest) => Promise<FetchResponse<any>>*/): Promise<FetchResponse<any>> {

        // validate and transform options
        options = this.preprocess(options);

        // fire fetch request
        return fetch(options.url as string, options);
    }
}
