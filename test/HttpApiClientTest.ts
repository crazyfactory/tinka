import {ServiceClient, FetchClient} from "../src/main";

describe("ServiceClient", () => {

    let httpApiClient: ServiceClient;

    beforeEach(() => {
        httpApiClient = new ServiceClient();
    });

    it("has an empty constructor", () => {
        let httpApiClient = new ServiceClient();
        expect(httpApiClient instanceof ServiceClient).toBeTruthy();
    });

    it("accepts a baseUrl during construction", () => {
        httpApiClient = new ServiceClient("https://myapi.crazy-factory.com");
        httpApiClient.configure((config) => {
            expect(config.options.baseUrl).toEqual("https://myapi.crazy-factory.com");
        });
    });

    describe("HttpApiClient.request", () => {

        it("throws an error for an incorrect method parameter", () => {

            expect(() => {
                httpApiClient.request("asdf", "/users/1", undefined, undefined, undefined);
            }).toThrowError();

            expect(() => {
                httpApiClient.request(null, "/users/1", undefined, undefined, undefined);
            }).toThrowError();

            expect(() => {
                httpApiClient.request(undefined, "/users/1", undefined, undefined, undefined);
            }).toThrowError();

        });

        describe("GET method parameter", () => {

            it("throws an error when files is defined", () => {
                expect(() => {
                    httpApiClient.request("GET", "/users/1", undefined, [{file: "iamafile"}], undefined);
                }).toThrowError();
                expect(() => {
                    httpApiClient.request("GET", "/users/1", undefined, null, undefined);
                }).toThrowError();
            });

            it("throws an error when data is defined", () => {

                expect(() => {
                    httpApiClient.request("GET", "/users/1", {id: 1}, undefined, undefined);
                }).toThrowError();
                expect(() => {
                    httpApiClient.request("GET", "/users/1", null, undefined, undefined);
                }).toThrowError();

            });

        });

        describe("HEAD method parameter", () => {

            it("throws an error when files is defined", () => {
                expect(() => {
                    httpApiClient.request("HEAD", "/users/1", undefined, [{file: "iamafile"}], undefined);
                }).toThrowError();
                expect(() => {
                    httpApiClient.request("HEAD", "/users/1", undefined, null, undefined);
                }).toThrowError();
            });

            it("throws an error when data is defined", () => {

                expect(() => {
                    httpApiClient.request("HEAD", "/users/1", {id: 1}, undefined, undefined);
                }).toThrowError();
                expect(() => {
                    httpApiClient.request("HEAD", "/users/1", null, undefined, undefined);
                }).toThrowError();

            });

        });

        describe("DELETE method parameter", () => {

            it("throws an error when files is defined", () => {
                expect(() => {
                    httpApiClient.request("DELETE", "/users/1", undefined, [{file: "iamafile"}], undefined);
                }).toThrowError();
                expect(() => {
                    httpApiClient.request("DELETE", "/users/1", undefined, null, undefined);
                }).toThrowError();
            });

        });

    });

    describe("get()", () => {

        it("returns a valid promise from get()", () => {

            httpApiClient.get("/users/1").then((res) => {
                expect(res).toBeDefined();
            });

            httpApiClient.addMiddleware((config, next) => {
                expect(next instanceof Promise).toBeTruthy();
            });

        });

    });

    describe("head()", () => {

        it("returns a valid promise from head()", () => {

            httpApiClient.head("/users/1").then((res) => {
                expect(res).toBeDefined();
            });

            httpApiClient.addMiddleware((config, next) => {
                expect(next instanceof Promise).toBeTruthy();
            });

        });

    });

    describe("delete()", () => {

        it("returns a valid promise from delete()", () => {

            httpApiClient.delete("/users/1").then((res) => {
                expect(res).toBeDefined();
            });

            httpApiClient.addMiddleware((config, next) => {
                expect(next instanceof Promise).toBeTruthy();
            });

        });

    });

    describe("patch()", () => {

        it("returns a valid promise from patch()", () => {

            httpApiClient.patch("/users/1").then((res) => {
                expect(res).toBeDefined();
            });

            httpApiClient.addMiddleware((config, next) => {
                expect(next instanceof Promise).toBeTruthy();
            });

        });

    });

    describe("post()", () => {

        it("returns a valid promise from post()", () => {

            httpApiClient.post("/users/1").then((res) => {
                expect(res).toBeDefined();
            });

            httpApiClient.addMiddleware((config, next) => {
                expect(next instanceof Promise).toBeTruthy();
            });

        });

    });

    describe("put()", () => {

        it("returns a valid promise from put()", () => {

            httpApiClient.put("/users/1").then((res) => {
                expect(res).toBeDefined();
            });

            httpApiClient.addMiddleware((config, next) => {
                expect(next instanceof Promise).toBeTruthy();
            });

        });

    });

});
