import {Client} from "./Client";

describe("Client", () => {
    it("is defined", () => {
        expect(Client).toBeDefined();
    });
    describe("construct()", () => {
        it("has a default implementation", () => {
           expect(new Client() instanceof Client).toBeTruthy();
        });
        it("accepts a defaultOptions-object", () => {
            expect(new Client({ method: "POST" }) instanceof Client).toBeTruthy();
        });
    });
});
