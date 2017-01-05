/**
 * @module tinka
 */
import {Fetch} from "./middlewares/Fetch";
import {Stack} from "./Stack";

/**
 * Predefined list of most useful request headers.
 *
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_fields2
 */
export interface IRequestHeaders {
    [key: string]: string;
    "Content-Type": string;
    Accept: string;
    "Accept-Language": string;
    Authorization: string;
}

/**
 * Predefined list of most useful response headers.
 *
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Response_fields
 */
export interface IResponseHeaders {
    [key: string]: string;
    "Content-Type": string;
}

export interface IRequest {
    url?: string;
    baseUrl?: string;
    method?: string;
    queryParameters?: {[key: string]: string};
    headers?: IRequestHeaders;
    body?: string;
}

export interface IResponse<T> {
    body: string;
    bodyUsed: boolean;
    headers: IResponseHeaders;
    ok: boolean;
    status: number;
    statusText: string;
    type: string;
    url: string;
    json?: () => Promise<T>;
    text?: () => Promise<string>;
}

export class Client extends Stack<IRequest, Promise<IResponse<any>>> {

    constructor(defaultOptions?: IRequest |(() => IRequest)) {
        super(() => Object.assign(
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Accept-Encoding": "gzip, deflate"
                }
            },
            typeof defaultOptions === "function"
                ? defaultOptions()
                : defaultOptions
        ));

        this.addMiddleware(new Fetch());
    }
}
