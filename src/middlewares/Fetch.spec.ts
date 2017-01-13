import {Fetch} from "./Fetch";

describe("Fetch", () => {
    it("is defined", () => {
        expect(Fetch).toBeDefined();
    });

    describe("static preprocess()", () => {
        it("is a function", () => {
            expect(typeof Fetch.preprocess).toBe("function");
        });

        it("throws on non-object options", () => {
            const obj = new Fetch();
            expect(() => obj.process(false as any, null as any)).toThrow();
        });

        it("throws on null options", () => {
            const obj = new Fetch();
            expect(() => obj.process(null as any, null as any)).toThrow();
        });

        it("appends queryParameters to urls", () => {
            const res = Fetch.preprocess({
                url: "http://api.example.com/url",
                queryParameters: {
                    user: "1",
                    id: "2"
                }
            });

            expect(res.url).toBe("http://api.example.com/url?id=2&user=1");
        });

        it("appends additional queryParameters to urls", () => {
            const res = Fetch.preprocess({
                url: "http://api.example.com/url?bob=17",
                queryParameters: {
                    user: "1",
                    id: "2"
                }
            });

            expect(res.url).toBe("http://api.example.com/url?bob=17&id=2&user=1");
        });
    });

    describe("process()", () => {
        it("is a function", () => {
            expect(typeof (new Fetch()).process).toBe("function");
        });

        it("returns a promise", () => {
            const obj = new Fetch();
            expect(obj.process({} as any, undefined as any) instanceof Promise).toBeTruthy();
        });
    });
});
