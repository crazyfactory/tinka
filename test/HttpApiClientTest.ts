import {HttpApiClient, HttpClient} from "../src/main";

describe("HttpApiClient", () => {

    let httpApiClient: HttpApiClient;

    it("should set the baseUrl to the same value as httpClient if omitted during construction", () => {

        let defaultBaseUrl: string;

        let httpClient = new HttpClient();
        httpClient.configure((cfg) => {
            defaultBaseUrl = cfg.options.baseUrl;
        });

        httpApiClient = new HttpApiClient();
        httpApiClient.configure((cfg) => {
            expect(cfg.options.baseUrl).toEqual(defaultBaseUrl);
        });

    });

    it("should leave the baseUrl untouched if omitted during construction", () => {

        httpApiClient = new HttpApiClient();
        httpApiClient.configure((config) => {
            expect(config.options.baseUrl).toBeUndefined();
        });

    });

    it("should set the baseUrl if added during construction", () => {

        httpApiClient = new HttpApiClient("https://myapi.crazy-factory.com");
        httpApiClient.configure((config) => {
            expect(config.options.baseUrl).toEqual("https://myapi.crazy-factory.com");
        });

    });

    describe("HttpApiClient.request", () => {

        it("should throw an error for an incorrect method parameter", () => {

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

            it("should throw an error files is defined", () => {
                expect(() => {
                    httpApiClient.request("GET", "/users/1", undefined, [{file: "iamafile"}], undefined);
                }).toThrowError();
                expect(() => {
                    httpApiClient.request("GET", "/users/1", undefined, null, undefined);
                }).toThrowError();
            });

            it("should throw an error when data is defined", () => {

                expect(() => {
                    httpApiClient.request("GET", "/users/1", {id: 1}, undefined, undefined);
                }).toThrowError();
                expect(() => {
                    httpApiClient.request("GET", "/users/1", null, undefined, undefined);
                }).toThrowError();

            });

        });

        describe("HEAD method parameter", () => {

            it("should throw an error files is defined", () => {
                expect(() => {
                    httpApiClient.request("HEAD", "/users/1", undefined, [{file: "iamafile"}], undefined);
                }).toThrowError();
                expect(() => {
                    httpApiClient.request("HEAD", "/users/1", undefined, null, undefined);
                }).toThrowError();
            });

            it("should throw an error when data is defined", () => {

                expect(() => {
                    httpApiClient.request("HEAD", "/users/1", {id: 1}, undefined, undefined);
                }).toThrowError();
                expect(() => {
                    httpApiClient.request("HEAD", "/users/1", null, undefined, undefined);
                }).toThrowError();

            });

        });

        describe("DELETE method parameter", () => {

            it("should throw an error files is defined", () => {
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

        it("should return a valid promise from get()", () => {

            httpApiClient = new HttpApiClient();
            httpApiClient.get("/users/1").then((res) => {
                expect(res).toBeDefined();
            });

            httpApiClient.addMiddleware((config, next) => {
                expect(next instanceof Promise).toBeTruthy();
            });

        });

    });

});
