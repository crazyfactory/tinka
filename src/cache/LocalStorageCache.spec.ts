import {LocalStorageCache} from "./LocalStorageCache";

describe("LocalStorageCache", () => {
    it("is defined", () => {
        expect(LocalStorageCache).toBeDefined();
    });

    const store = new LocalStorageCache();

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

        it("returns the saved value", () => {
            expect(store.getItem("key")).toBe("value");
        });

        it("purges expired key", (done) => {
            store.setItem("key1", "value1", 0.01);
            setTimeout(
                () => {
                    expect(store.getItem("key1")).toBeNull();
                    done();
                },
                12
            );
        });
    });

    describe("removeItem()", () => {
        it("is function", () => {
            expect(typeof store.removeItem).toBe("function");
        });

        it("removes the value by key", () => {
            store.removeItem("key");
            expect(store.getItem("key")).toBeNull();
        });
    });
});
