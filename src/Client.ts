/**
 * @module tinka
 */
import {Fetch, FetchRequest} from "./middlewares/Fetch";
import {Stack} from "./Stack";

export class Client extends Stack<any, any> {
    constructor(defaultOptions?: FetchRequest) {
        super();
        this.addMiddleware(new Fetch(defaultOptions));
    }
}
