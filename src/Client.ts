/**
 * @module tinka
 */
import {FetchMiddleware, IFetchRequest, IFetchResponse} from "./middlewares/FetchMiddleware";
import {Stack} from "./Stack";

export class Client extends Stack<IFetchRequest, Promise<IFetchResponse<any>>> {
    constructor(defaultOptions?: IFetchRequest) {
        super();
        this.addMiddleware(new FetchMiddleware(defaultOptions));
    }
}
