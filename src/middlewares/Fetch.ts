import {IRequest, IResponse} from "../Client";
import {IMiddleware} from "../Stack";

//noinspection TsLint
declare const fetch: (url: string, options: any) => Promise<{}>;

export class Fetch implements IMiddleware<IRequest, Promise<IResponse>> {

    public getQueryString(obj: any): string|null {
        return Object
            .keys(obj)
            .map((key) => (encodeURIComponent(key) + "=" + (obj[key] !== undefined ? encodeURIComponent(obj[key]) : "")))
            .join("&");
    }

    public process(options: IRequest, next: (nextOptions: IRequest) => Promise<IResponse>): Promise<IResponse> {

        // Construct target Uri
        options.url = (options.url.indexOf("://") > -1)
            ? options.url
            : (options.baseUrl || "") + options.url;

        // Append query parameters
        const queryString: string = options && options.queryParameters && this.getQueryString(options.queryParameters);

        if (queryString) {
            options.url += options.url.indexOf("?") !== -1
                ? "&" + queryString
                : "?" + queryString;
        }

        // fire fetch request
        return fetch(options.url, options).then((response: any): IResponse => {

            // TODO: ACTUALLY DO IT!
            return null;
        });
    }
}
