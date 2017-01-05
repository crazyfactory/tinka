/**
 * @module tinka
 */
import {Client} from "./Client";

/**
 * Basic class to be inherited from specific service classes
 * Can be used for hub-classes as well by passing down the client-value
 */
export class Service {
    public readonly client: Client;

    constructor(config?: string | Client | Service) {
        if (config instanceof Service) {
            this.client = config.client;
        } else if (config instanceof Client) {
            this.client = config;
        } else if (typeof config === "string") {
            this.client = new Client({
                baseUrl: config as string
            });
        } else if (config !== null && config !== undefined) {
            throw new TypeError("Unexpected argument type");
        }
    }
}
