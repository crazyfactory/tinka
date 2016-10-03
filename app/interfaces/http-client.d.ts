declare module 'http-client' {

    export class HttpClient {
        configure(fn: (config: HttpClientConfiguration) => void);
        addMiddleware(func:IHttpClientMiddleware)
        fetch(url: string, options: IHttpClientRequestOptions): Promise<IHttpClientResponse<any>>
    }

    interface IHttpClientRequestOptions {
        base_url?: string;
        method?: string;
        url?: string;
        data?: any;
        files?: any[];
        headers?:any;
    }

    export class HttpClientResponse<T> {
        fetchResponse(): FetchResponse;

        //An accessor cannot be declared in an ambient context. can't actually declare a function here

        raw(): string;

        hasData(): boolean;
        data(): T; // no content in response AND (content-type==json OR status NO CONTENT) => null
        //

        hasError(): boolean;
        error(): Error;
        statusCode(): number;

        contentType(): string;   // binary thingy... or json string => json

        isSuccess(): boolean; // statusCode == 2xx
    }


    interface FetchResponse {
        body: any;
        bodyUsed: boolean;
        headers: any;
        ok: boolean;
        status: number;
        statusText: string;
        type: string;
        url: string;
    }

    export class HttpClientConfiguration {
        withBaseUrl(url: string): HttpClientConfiguration;
        getDefaults() : IHttpClientRequestOptions;
        options : IHttpClientRequestOptions;
    }

    interface IHttpClientResponse<T> {
        json():any
    }

    export class HttpApiClient {

    }

    interface IHttpClientMiddleware {
        (config: IHttpClientRequestOptions, next: (IHttpClientRequestOptions) => Promise<any>):
            void | IHttpClientRequestOptions | IHttpClientResponse<any>;
    }
}