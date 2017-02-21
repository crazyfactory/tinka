import {RedisClientMock} from "../internal/RedisClientMock";
import {RedisCache} from "./RedisCache";

describe("RedisCache", () => {
    it("is defined", () => {
        expect(RedisCache).toBeDefined();
    });

    const store = new RedisCache(new RedisClientMock());

    describe("setItem()", () => {
        it("is function", () => {
            expect(typeof store.setItem).toBe("function");
        });

        it("accepts key, value and ttl; returns nothing", () => {
            expect(store.setItem("key", "value", 5)).toBeUndefined();
        });
    });

    describe("getItem()", () => {
        it("is function", () => {
            expect(typeof store.getItem).toBe("function");
        });

        it("returns the saved value", (done) => {
            store.getItem("key", (err: any, value: any) => {
                expect(value).toBe("value");
                done();
            });
        });

        it("purges expired key", (done) => {
            store.setItem("key1", "value1", 0.01);
            setTimeout(
                () => {
                    store.getItem("key1", (err: any, value: any) => {
                        expect(value).toBeNull();
                        done();
                    });
                },
                12
            );
        });
    });

    describe("removeItem()", () => {
        it("is function", () => {
            expect(typeof store.removeItem).toBe("function");
        });

        it("removes the value by key", (done) => {
            store.removeItem("key");
            store.getItem("key", (err: any, value: any) => {
                expect(value).toBeNull();
                done();
            });
        });
    });
});
