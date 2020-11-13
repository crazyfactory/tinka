import {IMockMiddlewareHandler, MockMiddleware} from "./MockMiddleware";

jest.useFakeTimers();

describe("MockMiddleware", () => {
    it("is defined", () => {
        expect(MockMiddleware).toBeDefined();
    });

    describe("constructor()", () => {
        it("accepts IHandler array in constructor", () => {
            const handler: IMockMiddlewareHandler<any, any> = {
                match: () => true,
                resultFactory: undefined as any
            };
            spyOn(handler, "match");
            const obj = new MockMiddleware([handler]);
            obj.process(undefined as any, () => undefined as any);
            expect(handler.match).toHaveBeenCalled();
        });
    });

    describe("addHandler()", () => {
        it("is a function", () => {
            expect(typeof (new MockMiddleware()).addHandler).toBe("function");
        });

        it("is able to add handler to array", () => {
            const mock = new MockMiddleware();
            const handler: IMockMiddlewareHandler<any, any> = {
                match: () => false
            } as any;
            spyOn(handler, "match");
            mock.addHandler(handler);
            mock.process(undefined as any, () => undefined as any);
            expect(handler.match).toHaveBeenCalled();
        });
    });

    describe("process()", () => {
        it("is a function", () => {
            expect(typeof (new MockMiddleware()).process).toBe("function");
        });

        it("returns mocked data", () => {
            const obj = new MockMiddleware();
            const mockUserData = {user: 1, post: "example post"};
            const result = MockMiddleware.jsonResponse(mockUserData);
            obj.addHandler(
                {
                    match: (): boolean => true,
                    resultFactory: () => result,
                    delay: undefined
                }
            );
            expect(obj.process(undefined as any, undefined as any)).toBe(result);
        });

        it("calls next when no mocks match", () => {
            const obj = new MockMiddleware(
                [{
                    match: (): boolean => false,
                    resultFactory: undefined as any
                }]
            );
            const nextContainer = {
                next: () => false as any
            };
            spyOn(nextContainer, "next");
            obj.process(undefined as any, nextContainer.next);
            expect(nextContainer.next).toHaveBeenCalled();
        });

        it("returns promise if resultFactory returns promise", () => {
            const obj = new MockMiddleware([
                {
                    delay: 5,
                    match: () => true,
                    resultFactory: (): Promise<any> => {
                        return new Promise((resolve) => {
                            setTimeout(
                                () => {
                                    resolve(MockMiddleware.jsonResponse({user: 1, post: "example post"}));
                                },
                                0
                            );
                        });
                    }
                }
            ]);
            expect(obj.process(undefined as any, () => false as any) instanceof Promise).toBeTruthy();
        });

        it("returns a value from result factory", () => {
            const result = {foo: "bar"};
            const mock = new MockMiddleware([
                {
                    match: () => true,
                    delay: 5,
                    resultFactory: () => result
                }
            ]);
            expect(mock.process(undefined as any, undefined as any)).toBe(result);
        });
    });

    describe("static resolvingPromise()", () => {
        it("returns a promise", () => {
            expect(MockMiddleware.resolvingPromise(null) instanceof Promise).toBeTruthy();
        });

        // Multiple test-cases
        [false, 15, {foo: "bar"}].forEach((data) => {
            it("returned promise resolves with " + JSON.stringify(data), (done) => {
                const promise = MockMiddleware.resolvingPromise(data, 20);
                promise.then((exp) => {
                    expect(exp).toBe(data as any);
                    done();
                });
                jest.runAllTimers();
            });
        });

        it("accepts delay as second parameter", async () => {
            const spy = jest.fn();
            MockMiddleware.resolvingPromise({ mock: true }, 50).then(spy);
            jest.advanceTimersByTime(49);
            expect(spy).not.toHaveBeenCalled();
            jest.advanceTimersByTime(1);
            // this is required because even though it's advanced by time, Promise is on kinda background, we need to kick off promise chain
            await Promise.resolve();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe("static jsonResponse()", () => {
        it("stringifies data and returns it as native Response", (done) => {
            const mockUserData = {user: 1, post: "example post"};
            MockMiddleware.jsonResponse(mockUserData).json().then((res) => {
                expect(res).toEqual(mockUserData as any);
                done();
            });
        });

        it("uses 204 status code if used with null", () => {
            expect(MockMiddleware.jsonResponse(null).status).toBe(204 as any);
        });
    });
});
