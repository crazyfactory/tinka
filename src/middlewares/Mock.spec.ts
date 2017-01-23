import {IMockHandler, Mock} from "./Mock";

describe("Mock", () => {
    it("is defined", () => {
        expect(Mock).toBeDefined();
    });

    describe("constructor()", () => {
        it("accepts IHandler array in constructor", () => {
            const handler = {
                match: () => false,
                factory: undefined as any
            };
            spyOn(handler, "match");
            const obj = new Mock([handler]);
            obj.process(undefined as any, () => undefined as any);
            expect(handler.match).toHaveBeenCalled();
        });
    });

    describe("addHandler()", () => {
        it("is a function", () => {
            expect(typeof (new Mock()).addHandler).toBe("function");
        });

        it("is able to add handler to array", () => {
            const obj = new Mock();
            const handler: IMockHandler<any, any> = {match: () => true as any, delay: 5, factory: undefined as any};
            spyOn(handler, "match");
            obj.addHandler(handler);
            obj.process({url: "posts/1"}, () => undefined as any);
            expect(handler.match).toHaveBeenCalled();
        });
    });

    describe("process()", () => {
        it("is a function", () => {
            expect(typeof (new Mock()).process).toBe("function");
        });

        it("returns mocked data", (done) => {
            const obj = new Mock();
            const mockUserData = {user: 1, post: "example post"};
            obj.addHandler(
                {
                    match: (): boolean => true,
                    factory: () => Mock.jsonResponse(mockUserData),
                    delay: 10
                }
            );
            obj.process({url: "example.com"}, () => false as any).then((res) => {
                res.json().then((json) => {
                    expect(json).toEqual(mockUserData);
                    done();
                });
            });
        });

        it("calls next when no mocks match", () => {
            const obj = new Mock(
                [{
                    match: (): boolean => false,
                    factory: () => Mock.jsonResponse({}) as any
                }]
            );
            const nextContainer = {next: () => false as any};
            spyOn(nextContainer, "next");
            obj.process(undefined as any, nextContainer.next);
            expect(nextContainer.next).toHaveBeenCalled();
        });

        it("returns promise if a factory returns promise", () => {
            const obj = new Mock([
                {
                    match: () => true,
                    factory: (): Promise<any> => {
                        return new Promise((resolve) => {
                            setTimeout(
                                () => {
                                    resolve(Mock.jsonResponse({user: 1, post: "example post"}));
                                },
                                0
                            );
                        });
                    }
                }
            ]);
            expect(obj.process(undefined as any, () => false as any) instanceof Promise).toBeTruthy();
        });
    });

    describe("jsonResponse()", () => {
        it("returns an object as a mock", (done) => {
            const mockUserData = {user: 1, post: "example post"};
            const obj = new Mock(
                [{
                    match: (): boolean => true,
                    delay: 5,
                    factory: () => Mock.jsonResponse(mockUserData)
                }]
            );
            obj.process(undefined as any, () => false as any).then((res) => {
                res.json().then((json) => {
                    expect(json).toEqual(mockUserData);
                    done();
                });
            });
        });

        it("uses 204 status code if used with null", (done) => {
            const obj = new Mock(
                [{
                    match: (): boolean => true,
                    factory: () => Mock.jsonResponse(null)
                }]
            );
            obj.process(undefined as any, () => undefined as any).then((res) => {
                expect(res.status).toBe(204);
                done();
            });
        });
    });
});
