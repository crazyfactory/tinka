import {Client} from "./Client";
import {Service} from "./Service";

describe("Service", () => {
    it("is defined", () => {
        expect(Service).toBeDefined();
    });
    describe("construct()", () => {
        it ("has a default implementation", () => {
            expect((new Service()) instanceof Service).toBeTruthy();
        });

        it("accepts a fetchRequest-object", () => {
            expect(() => new Service({ method: "GET" })).not.toThrow();
        });

        it("accepts a Client-instance", () => {
            const cl = new Client();
            const obj = new Service(cl);
            expect(obj.client).toBe(cl);
        });

        it("accepts a Service-instance", () => {
            const srv = new Service();
            const obj = new Service(srv);
            expect(obj.client).toBe(srv.client);
        });

        it("throws on wrong type", () => {
            expect(() => new Service(false as any)).toThrow();
        });
    });
});
