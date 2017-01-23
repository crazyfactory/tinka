import {IRequest, IResponseHeaders} from "../Client";
import {combineUrlWithBaseUrl, objectToQueryString} from "../internal/formatting";
import {IMiddleware} from "../Stack";

export type FetchResponse<T> = {
    new(body: any, init: any): FetchResponse<T>;
    body: string;
    bodyUsed: boolean;
    headers: IResponseHeaders
    ok: boolean;
    status: number;
    statusText: string;
    type: string;
    url: string;
    json: () => Promise<T>;
    text: () => Promise<string>;
};

//noinspection TsLint
declare const fetch: (url: string, options: any) => Promise<{}>;

export class Fetch implements IMiddleware<IRequest, Promise<FetchResponse<any>>> {
    public static preprocess(options: IRequest): IRequest {

        if (options === null || typeof options !== "object") {
            throw new TypeError("No valid options-object provided.");
        }

        // Construct target Uri
        options.url = combineUrlWithBaseUrl(options.url, options.baseUrl);

        // Append querystring
        const queryString = options && options.queryParameters && objectToQueryString(options.queryParameters);

        if (queryString) {
            options.url += options.url.indexOf("?") !== -1
                ? "&" + queryString
                : "?" + queryString;
        }

        return options;
    }

    public process(options: IRequest, next: (nextOptions: IRequest) => Promise<FetchResponse<any>>): Promise<FetchResponse<any>> {

        // validate and transform options
        options = Fetch.preprocess(options);

        // fire fetch request
        return fetch(options.url as string, options);
    }
}
