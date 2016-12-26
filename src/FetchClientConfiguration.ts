import {IFetchClientRequestOptions} from "./data/IFetchClientRequestOptions";

export class FetchClientConfiguration {

    static get defaults(): IFetchClientRequestOptions {
        return {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        };
    }

    public options: IFetchClientRequestOptions;

    constructor(options?: IFetchClientRequestOptions) {
        this.options = options || {};
    }

    public withBaseUrl(url: string): FetchClientConfiguration {
        // todo: fail on missing protocol.

        this.options.baseUrl = url;

        return this;
    }
}
