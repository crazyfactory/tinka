import {Client, IRequest} from "./Client";

export class Service {
    protected client: Client;

    constructor(config?: string | Client) {
        if (config instanceof Client) {
            this.client = config;
        } else if (typeof config === "string") {
            this.client = new Client({
                baseUrl: config as string
            });
        } else if (config !== null && config !== undefined) {
            throw new Error("Requires null, a Client-instance or a baseUrl-string");
        }
    }
}
