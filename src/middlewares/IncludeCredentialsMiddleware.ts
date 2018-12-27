import {IMiddleware} from "../Stack";
import {IFetchRequest, IFetchResponse, TCredentials} from "./FetchMiddleware";

export class IncludeCredentialsMiddleware implements IMiddleware<IFetchRequest, Promise<IFetchResponse<any>>> {
    constructor(private mode: TCredentials = "include") {}

    public process(options: IFetchRequest, next: (nextOptions: IFetchRequest) => Promise<IFetchResponse<any>>)
        : Promise<IFetchResponse<any>> {
        options.credentials = this.mode;
        return next(options);
    }
}
