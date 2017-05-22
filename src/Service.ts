/**
 * @module tinka
 */
import {Client} from "./Client";
import {IFetchRequest} from "./middlewares/FetchMiddleware";

export type ServiceRequest = IFetchRequest & {

};

/**
 * Basic class to be inherited from specific service classes
 * Can be used for hub-classes as well by passing down the client-value
 */
export class Service {
    public readonly client: Client;

    constructor(config?: ServiceRequest | Client | Service) {
        if (config instanceof Service) {
            this.client = config.client;
        } else if (config instanceof Client) {
            this.client = config;
        } else if (typeof config === "object") {
            this.client = new Client(config);
        } else if (config !== undefined && config !== null) {
            throw new TypeError("Unexpected argument type");
        }
    }
}
