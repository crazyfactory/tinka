import {FetchClientResponse} from "../FetchClientResponse";
import {IFetchClientRequestOptions} from "./IFetchClientRequestOptions";

export interface IFetchClientMiddleware {
    (config: IFetchClientRequestOptions, next: (options: IFetchClientRequestOptions) => Promise<any>): void | IFetchClientRequestOptions | FetchClientResponse<any>;
}
