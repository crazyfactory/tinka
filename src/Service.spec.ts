
import {Service} from "./Service";

describe("Service", () => {

    beforeAll(() => {
        it("is defined", () => {
            expect(Service).toBeDefined();
        });
    });

    describe("construct()", () => {
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
        it("accepts a Service-instance", () => {
            const baseUrl = "http://api.example.com";
            const obj = new Service(baseUrl);
            const defaultOptions = obj.client.defaultOptions;

            // Has the baseUrl been correctly passed on to the client?
            expect(defaultOptions.baseUrl).toBe(baseUrl);
        });
    });
});
