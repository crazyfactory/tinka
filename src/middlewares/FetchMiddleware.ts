import {combineUrlWithBaseUrl, combineUrlWithQueryParameters} from "../internal/formatting";
import {IMiddleware} from "../Stack";
import {IFetchRequestCacheOptions, IFetchResponseCacheOptions} from "./CacheMiddleware";

export interface IFetchHeaders {
    [key: string]: string;
    forEach?: any;
}

export interface IFetchResponse<T> {
    body: string;
    bodyUsed: boolean;
    headers?: IFetchHeaders;
    ok: boolean;
    status: number;
    statusText: string;
    type: string;
    url: string;
    cache?: IFetchResponseCacheOptions; // signifies that response has been reconstructed from cache
    json: () => Promise<T>;
    text: () => Promise<string>;
    clone: () => IFetchResponse<T>;
}

export interface IFetchRequest {
    url?: string;
    baseUrl?: string;
    method?: string;
    queryParameters?: {[key: string]: string};
    headers?: IFetchHeaders;
    body?: string;
    cache?: IFetchRequestCacheOptions;
}

//noinspection TsLint
declare const fetch: (url: string, options: any) => Promise<IFetchResponse<any>>;

export class FetchMiddleware implements IMiddleware<IFetchRequest, Promise<IFetchResponse<any>>> {

    constructor(public defaultOptions: IFetchRequest = {}) { }

    public preprocess(options: IFetchRequest): IFetchRequest {

        // Merge with the defaults
        options = Object.assign({}, this.defaultOptions, options);

        // Construct target Uri
        options.url = combineUrlWithBaseUrl(options.url, options.baseUrl);

        // Append query parameters
        options.url = combineUrlWithQueryParameters(options.url, options.queryParameters);

        return options;
    }

    public process(options: IFetchRequest/*, next: (nextOptions: FetchRequest) => Promise<IFetchResponse<any>>*/): Promise<IFetchResponse<any>> {

        // validate and transform options
        options = this.preprocess(options);

        // fire fetch request
        return fetch(options.url as string, options);
    }
}
