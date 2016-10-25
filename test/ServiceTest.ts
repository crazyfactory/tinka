import {Service} from "../src/lib/Service";
import {ServiceClient} from "../src/lib/ServiceClient";

describe("Service", () => {
    it("throws when used with an empty constructor", () => {
        expect(() => new Service(undefined)).toThrowError();
    });
    it("accepts a string during construction", () => {
        expect(new Service("http://api.example.com")).toBeTruthy();
    });
    it("accepts a ServiceClient during construction", () => {
        expect(new Service(new ServiceClient())).toBeTruthy();
    });
    it ("offers a client:ServiceClient protected property", () => {

        class Inheritant extends Service {
            constructor(config: any) {
                super(config);
            }
            returnClient() {
                return this.client;
            }
        }

        let obj = new Inheritant("http://api.example.com");

        expect(obj.returnClient() instanceof ServiceClient).toBeTruthy();
    });
});
