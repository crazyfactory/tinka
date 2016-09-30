declare module 'http-client' {

    export class HttpClient {
        configure(fn: (config: HttpClientConfiguration) => void);
        addMiddleware(func:IHttpClientMiddleware)
        fetch(url: string, options: IHttpClientRequestOptions): Promise<IHttpClientResponse<any>>
    }

    interface IHttpClientRequestOptions {
        method?: string;
        url?: string;
        data?: any;
        files?: any[];
        headers?:any;
    }

    export class HttpClientConfiguration {
        withBaseUrl(url: string): HttpClientConfiguration;
        defaults: IHttpClientRequestOptions;
    }

    interface IHttpClientResponse<T> {
    }

    export class HttpApiClient {

    }

    interface IHttpClientMiddleware {
        (config: IHttpClientRequestOptions, next: (IHttpClientRequestOptions) => Promise): void | IHttpClientRequestOptions | IHttpClientResponse;
    }
}