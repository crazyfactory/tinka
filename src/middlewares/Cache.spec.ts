import {Cache, ICacheMiddlewareStore} from "./Cache";
import {FetchResponse} from "./Fetch";

// noinspection TsLint
declare const Response: FetchResponse<string>;
declare const localStorage: ICacheMiddlewareStore;

describe("Cache", () => {
    it("is defined", () => {
        expect(Cache).toBeDefined();
    });

    describe("constructor()", () => {
        it("can be instantiated", () => {
            expect(new Cache() instanceof Cache).toBeTruthy();
        });

        it("accepts config in instantiation", () => {
            expect(new Cache({ maxAge: 10 }) instanceof Cache).toBeTruthy();
            expect(new Cache({ storage: "memory" }) instanceof Cache).toBeTruthy();
            expect(new Cache({ storage: "redis" }) instanceof Cache).toBeTruthy();
        });
    });

    describe("addBucket()", () => {
        const cache = new Cache({ maxAge: 10, storage: "localStorage" });
        it("is a function", () => {
            expect(typeof cache.addBucket).toBe("function");
        });

        it("accepts cache options", () => {
            expect(cache.addBucket({ enable: true, path: "/api/v1/user", key: "api_v1_user" })).toBeUndefined();
        });
    });

    describe("process()", () => {
        const ttl: number = 20;
        const cache = new Cache({ maxAge: ttl, storage: "localStorage" });
        cache.addBucket({ enable: true, path: "/api", key: "api" });

        it("is a function", () => {
            expect(typeof cache.process).toBe("function");
        });

        it("returns cached response data as promise", () => {
            const responseText: string = "cached response text";

            // Seed the cache for test
            localStorage.setItem(
                "api?cache=exist",
                JSON.stringify({ value: responseText, expiry: +Date.now() + ttl * 1000 }),
                ttl
            );

            const cached = cache.process({ url: "/api", queryParameters: { cache: "exist" } }, () => false as any);
            expect(cached instanceof Promise).toBeTruthy();

            cached.then((response: FetchResponse<string>) => response.text().then(
                (text: string) => expect(text).toBe(responseText))
            );
        });

        it("sets cached response data if cacheable", (done) => {
            const responseText: string = "this response text is going to be cached";
            const mock = Promise.resolve(new Response(responseText, undefined));

            cache.process({ url: "/api", queryParameters: { cache: "no_exist" } }, () => mock as any);

            setTimeout(
                () => {
                    const cached = localStorage.getItem("api?cache=no_exist") as string;

                    expect(cached).toBeTruthy();
                    expect(JSON.parse(cached).value).toBe(responseText); done();
                },
                10
            );
        });
    });
});