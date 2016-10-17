import {HttpApiClient, HttpClient} from "../src/main";

describe("HttpApiClient", () => {
    let httpApiClient: HttpApiClient;

    it("should return a valid baseUrl after construction", () => {

        let defaultBaseUrl: string;

        let httpClient = new HttpClient();
        httpClient.configure((cfg) => {
            defaultBaseUrl = cfg.options.baseUrl;
        });

        httpApiClient = new HttpApiClient();
        httpApiClient.configure((cfg) => {
            expect(cfg.options.baseUrl).toEqual(defaultBaseUrl);
        });

        httpApiClient = new HttpApiClient();
        expect(httpApiClient.baseUrl).toBeUndefined();

        httpApiClient = new HttpApiClient("https://myapi.crazy-factory.com");
        expect(httpApiClient.baseUrl).toEqual("https://myapi.crazy-factory.com");

    });

    it("should throw errors for incorrect parameters", () => {

        expect(() => {
            httpApiClient.request("asdf", "/users/1", undefined, undefined, undefined);
        }).toThrowError();

    });

    it("should throw an error on incorrect GET parameters", () => {

        expect(() => {
            httpApiClient.request("GET", "/users/1", {id: 1}, undefined, undefined);
        }).toThrowError();

        expect(() => {
            httpApiClient.request("GET", "/users/1", undefined, [{file: "iamafile"}], undefined);
        }).toThrowError();

    });

    it("should throw an error on incorrect HEAD parameters", () => {

        expect(() => {
            httpApiClient.request("HEAD", "/users/1", {id: 1}, undefined, undefined);
        }).toThrowError();

        expect(() => {
            httpApiClient.request("HEAD", "/users/1", undefined, [{file: "iamafile"}], undefined);
        }).toThrowError();

    });

    it("should throw an error on incorrect DELETE parameters", () => {

        expect(() => {
            httpApiClient.request("DELETE", "/users/1", undefined, [{file: "iamafile"}], undefined);
        }).toThrowError();

    });

    it("should return a valid promise from get()", () => {

        httpApiClient = new HttpApiClient();
        httpApiClient.get("/users/1").then((res) => {
            expect(res).toBeDefined();
        });

    });

    it("should return a valid promise from head()", () => {
        httpApiClient = new HttpApiClient();
        httpApiClient.head("/users/1").then((res) => {
            expect(res).toBeDefined();
        });
    });

    it("should return a valid promise from delete()", () => {
        httpApiClient = new HttpApiClient();
        httpApiClient.delete("/users/1").then((res) => {
            expect(res).toBeDefined();
        });
    });

    it("should return a valid promise from patch()", () => {
        httpApiClient = new HttpApiClient();
        httpApiClient.patch("/users").then((res) => {
            expect(res).toBeDefined();
        });
    });

    it("should return a valid promise from post()", () => {
        httpApiClient = new HttpApiClient();
        httpApiClient.post("/users").then((res) => {
            expect(res).toBeDefined();
        });
        httpApiClient = new HttpApiClient("https://myapi.crazy-factory.com");
        httpApiClient.post("/users", {name: "david"}, [{file: "iamafile"}], {headers: {Bearer: "xxx.xxx.xxx"}}).then((res) => {
            expect(res).toBeDefined();
        });
    });

    it("should return a valid promise from put()", () => {
        httpApiClient = new HttpApiClient();
        httpApiClient.put("/users").then((res) => {
            expect(res).toBeDefined();
        });
    });

});
