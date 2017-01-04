import {IRequest, IResponse} from "../Client";
import {combineUrlWithBaseUrl, objectToQueryString} from "../internal/formatting";
import {IMiddleware} from "../Stack";

//noinspection TsLint
declare const fetch: (url: string, options: any) => Promise<{}>;

export class Fetch implements IMiddleware<IRequest, Promise<IResponse<any>>> {
    public process(options: IRequest, next: (nextOptions: IRequest) => Promise<IResponse<any>>): Promise<IResponse<any>> {

        if (typeof options !== "object") {
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

        // fire fetch request
        return fetch(options.url, options).then((response: any): IResponse<any> => {

            // TODO: ACTUALLY DO IT!
            return null as any;
        });
    }
}
