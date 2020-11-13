import {IMiddleware} from "../Stack";
import {IFetchRequest, IFetchResponse} from "./FetchMiddleware";

export class ContentTypeMiddleware implements IMiddleware<IFetchRequest, Promise<IFetchResponse<any>>> {
    constructor(private contentType: string = "application/json") {
    }

    public process(options: IFetchRequest, next: (nextOptions: IFetchRequest) => Promise<IFetchResponse<any>>): Promise<IFetchResponse<any>> {
        if (!options.headers) {
            options.headers = {};
        }
        options.headers["content-type"] = this.contentType;
        return next(options);
    }
}
