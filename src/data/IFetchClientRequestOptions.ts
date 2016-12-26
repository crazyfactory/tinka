import {IServiceClientRequestOptions} from "./IServiceClientRequestOptions";

export interface IFetchClientRequestOptions extends IServiceClientRequestOptions {
    baseUrl?: string;
    method?: string;
    url?: string;
    data?: any;
    files?: any[];
}
