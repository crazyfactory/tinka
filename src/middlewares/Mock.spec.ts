import {Client, IResponse} from "../Client";
import {Mock} from "./Mock";
describe("Mock", () => {
    it("is defined", () => {
        expect(Mock).toBeDefined();
    });

    describe("constructor()", () => {
        it("accepts IHandler array in constructor", () => {
            const obj = new Mock([
                {
                    delay: 0,
                    match: undefined as any,
                    factory: undefined as any
                }
            ]);
            expect(obj).toBeDefined();
        });
    });

    describe("addHandler", () => {
        it("is a a function", () => {
            expect(typeof (new Mock()).addHandler).toBe("function");
        });

        it("is able to add handler to array", () => {
            const obj = new Mock();
            obj.addHandler({match: undefined as any, delay: 5, factory: undefined as any});
        });
    });

    describe("process", () => {
        it("process is a function", () => {
            expect(typeof (new Mock()).process).toBe("function");
        });

        it("returns mocked data", (done) => {
            const obj = new Mock();
            obj.addHandler(
                {
                    match: (): boolean => {
                        return true;
                    },
                    delay: 5,
                    factory: (): IResponse<any> => {
                        return Mock.jsonResponse({user: 1, post: "example post"});
                    }
                }
            );
            const client = new Client({baseUrl: "https://jsonplaceholder.typicode.com"});
            client.addMiddleware(obj);
            client.process({url: "/posts/1"}).then((res) => {
                res.json().then((post) => {
                    expect(post.post).toBe("example post");
                    expect(post.user).toBe(1);
                    done();
                });
            });
        });

        it("calls next when no mocks match", () => {
            const client = new Client({baseUrl: "https://api.example.com"});
            const obj = new Mock(
                [{
                    match: (): boolean => {
                        return false;
                    },
                    factory: (): IResponse<any> => {
                        return Mock.jsonResponse({});
                    }
                }]
            );
            client.addMiddleware(obj);
            expect(client.process({url: "/posts/2"}) instanceof Promise).toBeTruthy();
        });
    });

    describe("jsonResponse()", () => {
        it("returns an object as a mock", (done) => {
            const client = new Client({baseUrl: "https://api.example.com"});
            const obj = new Mock(
                [{
                    match: (): boolean => {
                        return true;
                    },
                    delay: 5,
                    factory: (): Promise<IResponse<any>> => {
                        return new Promise((resolve) => {
                            setTimeout(
                                () => {
                                    resolve(Mock.jsonResponse({user: 1, post: "example post"}));
                                },
                                0
                            );
                        });
                    }
                }]
            );
            client.addMiddleware(obj);
            client.process({url: "/posts/1"}).then((res) => {
                res.json().then((post) => {
                    expect(post.user).toBe(1);
                    expect(post.post).toBe("example post");
                    done();
                });
            });
        });

        it("uses 204 status code if used with null", (done) => {
            const client = new Client({baseUrl: "https://api.example.com"});
            const obj = new Mock(
                [{
                    match: (): boolean => {
                        return true;
                    },
                    factory: (): IResponse<any> => {
                        return Mock.jsonResponse(null);
                    }
                }]
            );
            client.addMiddleware(obj);
            client.process({url: "/posts/1"}).then((res) => {
                expect(res.status).toBe(204);
                done();
            });
        });
    });
});
