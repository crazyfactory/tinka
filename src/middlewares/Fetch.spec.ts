import {Fetch} from "./Fetch";

describe("Fetch", () => {
    describe("process()", () => {
        it("is defined", () => {
            const obj = new Fetch();
            expect(obj.process).toBeDefined();
        });

        it("throws on non-object options", () => {
            const obj = new Fetch();
            expect(() => obj.process(false as any, null as any)).toThrow();
        });

        it("throws on null options", () => {
            const obj = new Fetch();
            expect(() => obj.process(null as any, null as any)).toThrow();
        });
    });
});
