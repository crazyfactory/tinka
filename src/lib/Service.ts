import {ServiceClient} from "./ServiceClient";


export class Service {
    protected client: ServiceClient;

    constructor(config: string | ServiceClient) {
        if (config instanceof ServiceClient) {
            this.client = config as ServiceClient;
        } else if (typeof config === "string") {
            this.client = new ServiceClient(config as string);
        } else {
            throw new Error("Requires an instance of ServiceClient or a string containing the services baseUrl");
        }
    }
}
