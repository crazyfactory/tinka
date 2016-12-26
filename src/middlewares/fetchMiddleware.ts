import {IFetchClientMiddleware} from "../data/IFetchClientMiddleware";
import {IFetchClientRequestOptions} from "../data/IFetchClientRequestOptions";
import {FetchClientResponse} from "../FetchClientResponse";

//noinspection TsLint
declare const fetch: (url: string, options: any) => Promise<any>;

export function fetchMiddleware(
    options: IFetchClientRequestOptions,
    next: IFetchClientMiddleware
): void | IFetchClientRequestOptions | FetchClientResponse<any>  {

    // Construct target Uri
    options.url = (options.url.indexOf("://") > -1)
        ? options.url
        : (options.baseUrl || "") + options.url;

    // fire fetch request
    return fetch(options.url, options).then((response) => {
        // wait for text response
        return response.text().then((text: string) => {
            // relay formatted response
            return new FetchClientResponse(response, text);
        });
    });
}
