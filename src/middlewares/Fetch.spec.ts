import {Fetch, IFetchRequest} from "./Fetch";

describe("Fetch", () => {
    it("is defined", () => {
        expect(Fetch).toBeDefined();
    });

    describe("preprocess()", () => {
        it("is a function", () => {
            expect(typeof (new Fetch()).preprocess).toBe("function");
        });

        it("merges in defaultOptions", () => {
            const defaultOptions: IFetchRequest = { method: "GET", url: "/default" };
            const f = new Fetch(defaultOptions);

            const res = f.preprocess({ url: "/foo"});
            expect(res).toEqual({ method: "GET", url: "/foo" });
        });

        it("appends queryParameters to urls", () => {
            const res = (new Fetch()).preprocess({
                url: "http://api.example.com/url",
                queryParameters: {
                    user: "1",
                    id: "2"
                }
            });

            expect(res.url).toBe("http://api.example.com/url?id=2&user=1");
        });

        it("appends additional queryParameters to urls", () => {
            const res = (new Fetch()).preprocess({
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
            expect(obj.process(null as any) instanceof Promise).toBeTruthy();
        });
    });

    describe("defaultOptions", () => {
        it("is a public property", () => {
            const f = (new Fetch());
            expect(f.defaultOptions).toBeDefined();
            expect(typeof f.defaultOptions).not.toBe("function");
        });
    });
});
