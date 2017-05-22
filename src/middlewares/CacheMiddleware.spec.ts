import {CacheMiddleware, ICacheMiddlewareStore} from "./CacheMiddleware";
import {IFetchResponse} from "./FetchMiddleware";

declare const Response: IFetchResponse<string>;
declare const localStorage: ICacheMiddlewareStore;

describe("CacheMiddleware", () => {
    it("is defined", () => {
        expect(CacheMiddleware).toBeDefined();
    });

    describe("constructor()", () => {
        it("can be instantiated", () => {
            expect(new CacheMiddleware() instanceof CacheMiddleware).toBeTruthy();
        });

        it("accepts storage engine in instantiation", () => {
            expect(new CacheMiddleware(localStorage) instanceof CacheMiddleware).toBeTruthy();
        });
    });

    describe("process()", () => {
        it("is a function", () => {
            expect(typeof (new CacheMiddleware()).process).toBe("function");
        });

        it("calls next() if cache not enabled", () => {
            const cached = new CacheMiddleware().process({}, () => "just any thing" as any);

            expect(cached).toBe("just any thing");
        });

        it("calls next() if cache expired", (done) => {
            const cache = { enable: true, maxAge: 10 }; // 10 seconds
            const mock: Promise<any> = Promise.resolve(new (Response as any)("fetched response", undefined));

            // Seed the cache with expired timestamp for test
            localStorage.setItem(
                "/test",
                JSON.stringify({
                    value: "cached response",
                    timestamp: +Date.now() - 12000, // 12 seconds before
                    headers: { "Content-Type": "text/html" }
                })
            );

            const cached = new CacheMiddleware(localStorage)
                .process({ url: "/test", cache }, () => {
                    done();
                    return new Promise((resolve) => resolve(undefined));
                });

            expect(cached instanceof Promise).toBeTruthy();
        });

        it("calls next() if cache invalid/corrupt", (done) => {
            const cache = { enable: true, maxAge: 10 };
            const mock: Promise<any> = Promise.resolve(new (Response as any)("fetched response", undefined));

            // Seed the cache with invalid value
            localStorage.setItem("/test1", "\"");

            const cached = new CacheMiddleware(localStorage)
                .process({ url: "/test1", cache }, () => {
                    done();
                    return new Promise((resolve) => resolve(undefined));
                });

            expect(cached instanceof Promise).toBeTruthy();
        });

        it("returns cached response data as promise", () => {
            const responseText: string = "cached response text";
            const cache = { enable: true, maxAge: 1000 };

            // Seed the cache for test
            localStorage.setItem(
                "/api?cache=exist",
                JSON.stringify({
                    value: responseText,
                    type: "basic",
                    url: "/api?cache=exist",
                    status: 200,
                    statusText: "OK",
                    timestamp: +Date.now(),
                    headers: { "Content-Type": "text/html" }
                })
            );

            const cached = new CacheMiddleware(localStorage)
                .process({ url: "/api", queryParameters: { cache: "exist" }, cache }, () => new Promise((resolve) => resolve()));
            expect(cached instanceof Promise).toBeTruthy();

            cached.then((response: IFetchResponse<string>) => {
                const cacheMeta = response.cache;

                if (cacheMeta) { // not required but build fails as it is optional type.
                    expect(cacheMeta).toBeTruthy("the cached response should have a cache property");
                    expect(cacheMeta.used).toBeTruthy();
                    expect(typeof cacheMeta.timestamp).toBe("number");
                }

                response.text().then((text: string) => expect(text).toBe(responseText));
            });
        });

        it("sets response cache when configured", (done) => {
            const responseText: string = "this response text is going to be cached";
            const mock: Promise<any> = Promise.resolve(new (Response as any)(responseText, { headers: { "Content-Type": "text/html" }}));
            const cache = { enable: true, maxAge: 1000 };
            const memoryCache = new CacheMiddleware();

            new CacheMiddleware(localStorage)
                .process({ url: "/api", queryParameters: { cache: "no_exist" }, cache }, () => mock);

            memoryCache.process({ url: "", cache }, () => mock as any);

            setTimeout(
                () => {
                    const cached = localStorage.getItem("/api?cache=no_exist") as string;

                    expect(cached).toBeTruthy();
                    expect(JSON.parse(cached).value).toBe(responseText);

                    // Without maxAge
                    memoryCache.process({ url: "", cache: { enable: true } }, () => false as any).then((response: IFetchResponse<string>) => {
                        response.text().then((text: string) => {
                            expect(text).toBe(responseText);
                            done();
                        });
                    });
                },
                30
            );
        });
    });
});
