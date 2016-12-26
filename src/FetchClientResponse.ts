import {IFetchResponse} from "./data/IFetchResponse";


export class FetchClientResponse<T> {
    public fetchResponse: IFetchResponse;
    public body: string;

    get hasError(): boolean {
        return !this.fetchResponse.ok;
    }

    get status(): number {
        return this.fetchResponse.status;
    }

    get statusText(): string {
        return this.fetchResponse.statusText;
    }

    get contentType(): string {
        if (!this.fetchResponse.headers.has("Content-Type")) {
            return undefined;
        }
        return this.fetchResponse.headers.get("Content-Type").split(";")[0];
    }

    get ok(): boolean {
        return this.fetchResponse.ok;
    }

    get hasData(): boolean {
        return !(this.status === 204);
    }

    get data(): T {
        switch (this.contentType) {
            case "application/json":
                try {
                    return JSON.parse(this.body) as T;
                } catch (e) {
                    throw Error("Response body can't be parsed.");
                }
            case undefined:
            case "":
                return undefined;
            default:
                throw new Error(`Unknown Content-Type "${this.contentType}"`);
        }
    }

    constructor(fetchResponse: IFetchResponse, body: string) {
        this.fetchResponse = fetchResponse;
        this.body = body;
    }
}
