import {FetchClientConfiguration} from "./FetchClientConfiguration";
import {IFetchClientMiddleware, IFetchClientRequestOptions} from "./main";
import {FetchClientResponse} from "./FetchClientResponse";


declare var fetch: (url: string, options: any) => Promise<any>;

export class FetchClient {

    static getCombinedUrl(baseUrl: string, urlOrPath: string): string {
        if (urlOrPath.indexOf("://") > -1) {
            return urlOrPath;
        }
        return (baseUrl || "") + urlOrPath;
    }

    private configuration: FetchClientConfiguration;
    private middlewares: IFetchClientMiddleware[];
    private options;

    constructor() {
        this.configuration = new FetchClientConfiguration();
        this.middlewares = [];
    }

    configure(fn: (config: FetchClientConfiguration) => void) {
        if (typeof fn === "function") {
            fn(this.configuration);
        } else {
            throw new Error("Expected a function to configure, got " + typeof fn + "instead");
        }
    }

    addMiddleware(func: IFetchClientMiddleware) {
        this.middlewares.push(func);
        return this;
    }

    fetch(url: string, options: IFetchClientRequestOptions = {}): Promise<FetchClientResponse<any>> {

        let httpClientRequestOptions: IFetchClientRequestOptions = Object.assign(
            {},
            FetchClientConfiguration.defaults,
            this.configuration.options,
            this.options,
            options);

        httpClientRequestOptions.url = url;

        // Create final middleware to perform actual fetch call
        let fetchMiddleware = (options: IFetchClientRequestOptions) => {
            options.url = FetchClient.getCombinedUrl(options.baseUrl, options.url);

            return fetch(options.url, options).then((response) => {
                return response.text().then((text) => {
                    return new FetchClientResponse(response, text);
                });
            });
        };

        let stack = this.middlewares.concat([fetchMiddleware]);

        let next = (options) => {
            let nextMW: IFetchClientMiddleware = stack.shift();
            return nextMW(options, next);
        };
        return next(httpClientRequestOptions);
    }
}
