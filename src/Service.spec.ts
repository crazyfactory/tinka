import {Client, IRequest} from "./Client";
import {Service} from "./Service";
it("Service is defined", () => {
    expect(Service).toBeDefined();
});
describe("Service constructor", () => {
    it("has a default implementation", () => {
        expect((new Service()) instanceof Service).toBeTruthy();
    });

    it("accepts a baseUrl-string", () => {
        const baseUrl = "http://api.example.com";
        const obj = new Service(baseUrl);
        const defaultOptions = obj.client.defaultOptions;

        // Has the baseUrl been correctly passed on to the client?
        expect(defaultOptions.baseUrl).toBe(baseUrl);
    });

    it("accepts a Client-instance", () => {
        const baseUrl = "http://api.example.com";
        const cl = new Client({baseUrl} as IRequest);
        const obj = new Service(cl);
        const defaultOptions = obj.client.defaultOptions;

        // Has the baseUrl been correctly passed on to the client?
        expect(defaultOptions.baseUrl).toBe(baseUrl);
    });

    it("accepts a Service-instance", () => {
        const baseUrl = "http://api.example.com";
        const srv = new Service(baseUrl);
        const obj = new Service(srv);
        const defaultOptions = obj.client.defaultOptions;

        // Has the baseUrl been correctly passed on to the client?
        expect(defaultOptions.baseUrl).toBe(baseUrl);
    });

    it("throws on wrong type", () => {
        expect(() => new Service(false as any)).toThrow();
    });
});
