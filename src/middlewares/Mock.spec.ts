import {IMockHandler, Mock} from "./Mock";

describe("Mock", () => {
    it("is defined", () => {
        expect(Mock).toBeDefined();
    });

    describe("constructor()", () => {
        it("accepts IHandler array in constructor", () => {
            const handler: IMockHandler<any, any> = {
                match: () => true,
                resultFactory: undefined as any
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
            const mock = new Mock();
            const handler: IMockHandler<any, any> = {
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
            expect(typeof (new Mock()).process).toBe("function");
        });

        it("returns mocked data", (done) => {
            const obj = new Mock();
            const mockUserData = {user: 1, post: "example post"};
            obj.addHandler(
                {
                    match: (): boolean => true,
                    resultFactory: () => Mock.jsonResponse(mockUserData),
                    delay: undefined
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
            const obj = new Mock([
                {
                    delay: 50,
                    match: () => true,
                    resultFactory: (): Promise<any> => {
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

        it("returns a instance of promise", () => {
            const mock = new Mock([
                {
                    match: () => true,
                    delay: 5,
                    resultFactory: () => undefined as any
                }
            ]);
            expect(mock.process(undefined as any, undefined as any) instanceof Promise).toBeTruthy();
        });
    });

    describe("jsonResponse()", () => {
        it("returns an object as a mock", (done) => {
            const mockUserData = {user: 1, post: "example post"};
            Mock.jsonResponse(mockUserData).json().then((res) => {
                expect(res).toEqual(mockUserData);
                done();
            });
        });

        it("uses 204 status code if used with null", () => {
            expect(Mock.jsonResponse(null).status).toBe(204);
        });
    });
});
