declare module "http-client" {

    export class HttpClient {
        configure(fn: (config: HttpClientConfiguration) => void);
        addMiddleware(func: IHttpClientMiddleware)
        fetch(url: string, options: IHttpClientRequestOptions): Promise<HttpClientResponse>
    }

    interface IHttpClientRequestOptions {
        baseUrl?: string;
        method?: string;
        url?: string;
        data?: any;
        files?: any[];
        headers?: any;
    }

    export class HttpClientResponse {
        fetchResponse: IFetchResponse;

        // An accessor cannot be declared in an ambient context. can't actually declare a function here

        hasData: boolean;
        // no content in response AND (content-type==json OR status NO CONTENT) => null

        body: any;
        hasError: boolean;
        status: number;
        statusText: string;
        contentType: string;   // binary thingy... or json string => json

        ok: boolean; // statusCode == 2xx
    }

    interface IFetchResponse {
        body: any;
        bodyUsed: boolean;
        headers: any;
        ok: boolean;
        status: number;
        statusText: string;
        type: string;
        url: string;
        json: () => Promise <any>;
        text: () => Promise <any>;
    }

    export class HttpClientConfiguration {
        static defaults: IHttpClientRequestOptions;
        options: IHttpClientRequestOptions;

        withBaseUrl(url: string): HttpClientConfiguration;
    }

    export class HttpApiClient {

    }

    interface IHttpClientMiddleware {
        (config: IHttpClientRequestOptions, next: (options: IHttpClientRequestOptions) => Promise<any>):
            void | IHttpClientRequestOptions | HttpClientResponse;
    }
}
