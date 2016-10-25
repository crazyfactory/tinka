
import {IFetchClientRequestOptions} from "../main";

export class FetchClientConfiguration {

    static get defaults(): IFetchClientRequestOptions {
        return {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };
    }

    options: IFetchClientRequestOptions;

    constructor(options?: IFetchClientRequestOptions) {
        this.options = options || {};
    }

    withBaseUrl(url: string): FetchClientConfiguration {
        // todo: fail on missing protocol.

        this.options.baseUrl = url;

        return this;
    }
}

