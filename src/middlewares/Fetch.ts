import {IRequest, IResponse} from "../Client";
import {IMiddleware} from "../Stack";
import {objectToQueryString, combineUrlWithBaseUrl} from "../internal/formatting";

//noinspection TsLint
declare const fetch: (url: string, options: any) => Promise<{}>;

export class Fetch implements IMiddleware<IRequest, Promise<IResponse>> {
    public process(options: IRequest, next: (nextOptions: IRequest) => Promise<IResponse>): Promise<IResponse> {

        // Construct target Uri
        let url = combineUrlWithBaseUrl(options.url, options.baseUrl);

        const queryString: string = options && options.queryParameters && objectToQueryString(options.queryParameters);

        if (queryString) {
            url += options.url.indexOf("?") !== -1
                ? "&" + queryString
                : "?" + queryString;
        }

        // Change the target object TODO: consider just merging it...
        options.url = url;

        // fire fetch request
        return fetch(options.url, options).then((response: any): IResponse => {

            // TODO: ACTUALLY DO IT!
            return null;
        });
    }
}
