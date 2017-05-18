/**
 * @module tinka
 */
import {FetchMiddleware, IFetchRequest} from "./middlewares/FetchMiddleware";
import {Stack} from "./Stack";

export class Client extends Stack<any, any> {
    constructor(defaultOptions?: IFetchRequest) {
        super();
        this.addMiddleware(new FetchMiddleware(defaultOptions));
    }
}
