import {CacheMiddleware, ICacheMiddlewareStore} from "./CacheMiddleware";
import {IFetchRequest, IFetchResponse} from "./FetchMiddleware";

declare const Response: IFetchResponse<string>;

const createMockStore = (data: { [index: string]: string } = {}): ICacheMiddlewareStore => {
    return {
        setItem: (key: string, value: string) => {
            data[key] = value;
        },
        getItem: (key: string) => {
            return key in data ? data[key] : undefined;
        }
        // removeItem: (key) is not used by CacheMiddleware and therefor omitted (+cov).
    } as any;
};

describe("CacheMiddleware", () => {
    it("is defined", () => {
        expect(CacheMiddleware).toBeDefined();
    });

    describe("constructor()", () => {
        it("can be instantiated", () => {
            expect(new CacheMiddleware() instanceof CacheMiddleware).toBeTruthy();
        });

        it("accepts storage engine in instantiation", () => {
            expect(new CacheMiddleware(createMockStore()) instanceof CacheMiddleware).toBeTruthy();
        });
    });

    describe("getCacheKey()", () => {
        it("is a function", () => {
            expect(typeof (new CacheMiddleware()).getCacheKey).toBe("function");
        });

        it("returns a preset key from a request config", () => {
            const configs: IFetchRequest[] = [
                {
                    cache: {
                        key: "foo"
                    }
                },
                {
                    cache: {
                        key: "foo"
                    },
                    baseUrl: "/bar",
                    queryParameters: {
                        foo: "bar"
                    },
                    method: "GET"
                }
            ] as any;

            const mw = new CacheMiddleware();
            configs.forEach((config) => {
                const result = mw.getCacheKey(config);
                expect(result).toEqual("foo");
            });
        });

        it("combines baseUrl and Url correctly", () => {
            const configs: IFetchRequest[] = [
                {
                    url: "/foo",
                    baseUrl: "http://www.example.com"
                },
                {
                    url: "http://www.example.com/foo"
                },
                {
                    baseUrl: "http://www.example.com/foo"
                }
            ];

            const mw = new CacheMiddleware();
            let check: string;
            configs
                .map((config) => mw.getCacheKey(config))
                .forEach((str) => {
                    if (check === undefined) {
                        check = str;
                    }
                    expect(str).toBe(check);
                });
        });

        it("defaults method to GET", () => {
            const mw = new CacheMiddleware();
            const a = mw.getCacheKey({ url: "/foo", method: "GET"});
            const b = mw.getCacheKey({ url: "/foo"});

            expect(a).toBe(b);
        });

        it("generates a unique key for each configuration", () => {
            const configs: IFetchRequest[] = [
                {
                    url: "/foo"
                },
                {
                    url: "/foo",
                    method: "POST"
                },
                {
                    url: "/bar"
                },
                {
                    baseUrl: "/a",
                    url: "/foo"
                },
                {
                    url: "/foo",
                    queryParameters: {
                        a: true
                    }
                },
                {
                    url: "/foo",
                    queryParameters: {
                        a: "bar"
                    }
                },
                {
                    url: "/foo",
                    queryParameters: {
                        a: true,
                        b: 7
                    }
                }
            ] as any;

            // create an empty object.
            const check: any = {};
            const mw = new CacheMiddleware();

            // We will add each resulting key as a key in that objects, failing if its taken already.
            configs.forEach((config, index) => {
                const key = mw.getCacheKey(config);
                expect(check[key]).toBeUndefined();
                check[key] = config;
            });
        });
    });

    describe("stringifyResponse()", () => {
        it("is a function", () => {
            expect(typeof (new CacheMiddleware()).stringifyResponse).toBe("function");
        });

        it("returns a json-string as promise", (done) => {
            const response = new (Response as any)("my-response-body", { headers: { foo: "bar"} });
            const promise = (new CacheMiddleware()).stringifyResponse(response);

            promise.then((jsonString) => {
                try {
                    JSON.parse(jsonString);
                    done();
                } catch (e) {
                    expect(e).toBeUndefined("result could not be parsed as a JSON");
                }
            });
        }, 50);
    });

    describe("unstringifyResponse()", () => {
        it("is a function", () => {
            expect(typeof (new CacheMiddleware()).unstringifyResponse).toBe("function");
        });

        it("returns null for non-json-object-strings", () => {
            const mw = new CacheMiddleware();
            expect(mw.unstringifyResponse(null as any)).toBeNull();
            expect(mw.unstringifyResponse("foo")).toBeNull();
            expect(mw.unstringifyResponse(false as any)).toBeNull();
        });

        it("returns a Response instance for json-object-strings", (done) => {
            const mw = new CacheMiddleware();
            const res: any = mw.unstringifyResponse(JSON.stringify({value: "foo"}));
            expect(res instanceof (Response as any)).toBeTruthy();

            res.text().then((text: string) => {
                expect(text).toBe("foo");
                done();
            });
        }, 50);

        it("adds a cache-literal property", () => {
            const mw = new CacheMiddleware();
            const res = mw.unstringifyResponse(JSON.stringify({value: "foo", timestamp: 1337}));

            // Unnecessary IF, prevent "error TS2531: Object is possibly 'null'."
            if (res && res.cache) {
                expect(res.cache).toBeTruthy();
                expect(res.cache.fromCache).toBeTruthy();
                expect(typeof res.cache.timestamp).toBe("number");
                expect(typeof res.cache.age).toBe("number");
            }
        });
    });

    describe("setCache()", () => {
        it("is a function", () => {
            expect(typeof (new CacheMiddleware()).setCache).toBe("function");
        });

        it("it stores a key/response pair", () => {
            // run the tests twice (fallback and supplied storage)
            const storages = [
                undefined,
                createMockStore()
            ];

            storages.forEach((store) => {
                const mw = new CacheMiddleware(store);

                const mockResponse: any = {
                    clone: () => {
                        return {
                            text: () => Promise.resolve("cached response")
                        };
                    }
                };

                // result should be a promise
                const res = mw.setCache("foo", mockResponse);
                expect(res instanceof Promise).toBeTruthy();
            });
        });

        it("it stores a key/response pair in a fallback storage when storage fails", () => {
            const mw = new CacheMiddleware({ thisStoreIsBroken: true } as any);

            const mockResponse: any = {
                clone: () => {
                    return {
                        text: () => Promise.resolve("cached response")
                    };
                }
            };

            // result should be a promise
            const res = mw.setCache("foo", mockResponse);
            expect(res instanceof Promise).toBeTruthy();
        });
    });

    describe("getCache()", () => {
        it("is a function", () => {
            expect(typeof (new CacheMiddleware()).getCache).toBe("function");
        });

        it("retrieves a Response from storage", () => {
            const mw = new CacheMiddleware(createMockStore());

            const mockResponse: any = {
                clone: () => {
                    return {
                        text: () => Promise.resolve("cached response")
                    };
                }
            };

            // set the cache
            mw.setCache("foo", mockResponse).then(() => {
                expect(mw.getCache("foo") instanceof (Response as any)).toBeTruthy();
            });
        });

        it("retrieves a Response from a fallback storage", () => {
            const mw = new CacheMiddleware();

            const mockResponse: any = {
                clone: () => {
                    return {
                        text: () => Promise.resolve("cached response")
                    };
                }
            };

            // set the cache
            mw.setCache("foo", mockResponse).then(() => {
                expect(mw.getCache("foo") instanceof (Response as any)).toBeTruthy();
            });
        });

        it("returns null if there's no cache items", () => {
            expect(new CacheMiddleware().getCache("foo")).toBeNull();
        });
    });

    describe("preprocess()", () => {
        it("is a function", () => {
            expect(typeof (new CacheMiddleware()).preprocess).toBe("function");
        });

        it("returns parameter when given null or non-object", () => {
            expect(new CacheMiddleware().preprocess(null as any)).toBeNull();
            expect(new CacheMiddleware().preprocess(true as any)).toBe(true as any);
            expect(new CacheMiddleware().preprocess(undefined as any) as any).toBe(undefined);
        });

        it("returns non-null objects", () => {
            const obj = { foo: "bar" };
            expect(new CacheMiddleware().preprocess(obj as any)).toBe(obj as any);
        });

        it("set enable on maxAge > 0 if not explicitly set to false", () => {
            const mw = new CacheMiddleware();
            expect(mw.preprocess({ maxAge: 1 } as any).enable).toBeTruthy();
            expect(mw.preprocess({ maxAge: 1, enable: false }).enable).toBeFalsy();
        });
    });

    describe("process()", () => {
        it("is a function", () => {
            expect(typeof (new CacheMiddleware()).process).toBe("function");
        });

        it("calls next() if not enabled and passes through its result", () => {
            const mw = new CacheMiddleware();
            expect(mw.process({}, () => "just any thing" as any)).toBe("just any thing");
            expect(mw.process({ cache: {} } as any, () => "just any thing" as any)).toBe("just any thing");
        });

        it("calls next() if cache expired", (done) => {
            const store = createMockStore();
            const mw = new CacheMiddleware(store);

            const config = {
                url: "/test",
                cache: {
                    enable: true,
                    maxAge: 1
                }
            };

            const key = mw.getCacheKey(config);

            // Seed the cache with a mock response
            const mockResponse: any = {
                clone: () => {
                    return {
                        text: () => Promise.resolve("cached response")
                    };
                }
            };

            mw.setCache(key, mockResponse).then(() => {
                setTimeout(
                    () => {
                        // ensure cache exists (otherwise we may prematurely validate this test)
                        const cachedEntry = mw.getCache(key);

                        expect(cachedEntry).not.toBeNull();
                        expect(typeof cachedEntry).toBe("object");

                        // invoke mw with same config again
                        mw.process(config, (): any => {
                            done(); // next() was called!
                            return Promise.resolve();
                        });
                    },
                    5
                );
            });
        }, 50);

        it("calls next() if cache invalid/corrupt", (done) => {

            const config = {
                url: "/test1",
                cache: {
                    enable: true,
                    maxAge: 10
                }
            };

            const store = createMockStore();
            // Seed the cache with invalid value
            store.setItem("/test1", "\"");

            const mw = new CacheMiddleware(store);

            mw.process(config, () => {
                done();
                return new Promise((resolve) => resolve(undefined));
            });
        }, 5);

        it("returns cached response data as promise", (done) => {

            const responseText: string = "cached response text";
            const mw = new CacheMiddleware();

            const config: IFetchRequest = { url: "/api", cache: { enable: true, maxAge: 50} };
            const key = mw.getCacheKey(config);
            const mockResponse: any = {
                clone: () => {
                    return {
                        text: () => Promise.resolve(responseText)
                    };
                }
            };

            // Seed the cache for test
            mw.setCache(key, mockResponse)
                .then(() => mw.process(config, undefined as any))
                .then((response) => {
                    expect(response.cache).toBeTruthy("the cached response should have a cache property");
                    expect(response.cache.fromCache).toBeTruthy();
                    expect(typeof response.cache.timestamp).toBe("number");
                    expect(typeof response.cache.age).toBe("number");

                    response.text().then((text: string) => {
                        expect(text).toBe(responseText);
                        done();
                    });
                });
        }, 50);
    });
});
