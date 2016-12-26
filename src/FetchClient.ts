import {FetchClientConfiguration} from "./FetchClientConfiguration";
import {FetchClientResponse} from "./FetchClientResponse";
import {IFetchClientMiddleware} from "./data/IFetchClientMiddleware";
import {IFetchClientRequestOptions} from "./data/IFetchClientRequestOptions";
import {fetchMiddleware} from "./middlewares/fetchMiddleware";

declare const fetch: (url: string, options: any) => Promise<any>;

export class FetchClient {

    private configuration: FetchClientConfiguration;
    private middlewares: IFetchClientMiddleware[];

    constructor() {
        this.configuration = new FetchClientConfiguration();
        this.middlewares = [];
    }

    public static getCombinedUrl(baseUrl: string, urlOrPath: string): string {
        if (urlOrPath.indexOf("://") > -1) {
            return urlOrPath;
        }
        return (baseUrl || "") + urlOrPath;
    }

    public configure(fn: (config: FetchClientConfiguration) => void) {
        if (typeof fn === "function") {
            fn(this.configuration);
        } else {
            throw new Error("Expected a function to configure, got " + (typeof fn) + "instead");
        }
    }

    public addMiddleware(func: IFetchClientMiddleware) {
        this.middlewares.push(func);
        return this;
    }

    public fetch(url: string, options: IFetchClientRequestOptions = {}): Promise<FetchClientResponse<any>> {

        const httpClientRequestOptions: IFetchClientRequestOptions = Object.assign(
            {},
            FetchClientConfiguration.defaults,
            this.configuration.options,
            options);

        httpClientRequestOptions.url = url;

        // Add fetch Middleware at the end to perform actual call
        const stack = this.middlewares.concat([fetchMiddleware]);

        const next = (requestOptions: IFetchClientRequestOptions) => {
            const nextMW: IFetchClientMiddleware = stack.shift();
            return nextMW(requestOptions, next);
        };

        return next(httpClientRequestOptions);
    }
}
