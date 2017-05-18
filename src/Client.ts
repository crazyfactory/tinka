/**
 * @module tinka
 */
import {Fetch, IFetchRequest} from "./middlewares/Fetch";
import {Stack} from "./Stack";

export class Client extends Stack<any, any> {
    constructor(defaultOptions?: IFetchRequest) {
        super();
        this.addMiddleware(new Fetch(defaultOptions));
    }
}
