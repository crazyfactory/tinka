import {FetchClientResponse} from "./lib/FetchClientResponse";


export interface IServiceClientRequestOptions {
    headers?: {[prop: string]: string};
}

export interface IFetchClientRequestOptions extends IServiceClientRequestOptions {
    baseUrl?: string;
    method?: string;
    url?: string;
    data?: any;
    files?: any[];
}

export interface IFetchResponse {
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

export interface IFetchClientMiddleware {
    (config: IFetchClientRequestOptions, next: (options: IFetchClientRequestOptions) => Promise<any>):
        void | IFetchClientRequestOptions | FetchClientResponse<any>;
}


export {FetchClientConfiguration} from "./lib/FetchClientConfiguration";
export {FetchClientResponse} from "./lib/FetchClientResponse";
export {FetchClient} from "./lib/FetchClient";
export {ServiceClient} from "./lib/ServiceClient";
