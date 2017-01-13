import {Client, IRequest} from "./Client";

describe("Client", () => {
    it("is defined", () => {
        expect(Client).toBeDefined();
    });
    describe("construct()", () => {
        it("has a default implementation", () => {
           expect(new Client() instanceof Client).toBeTruthy();
        });
        it("accepts as defaultOptions-object", () => {
            const options: IRequest = {
                method: "POST"
            };

            const client = new Client(options);

            expect(client.defaultOptions.method).toBe("POST");
        });
        it("accepts a defaultOptions-function", () => {
            const fn = () => {
                return {
                    method: "POST"
                } as IRequest;
            };
            const client = new Client(fn);

            expect(client.defaultOptions.method).toBe("POST");
        });
    });
});
