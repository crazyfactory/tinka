import {HttpClient} from "../src/main";
import {IHttpClientRequestOptions} from "../src/main";

describe("HttpClient", () => {
    let http: HttpClient;
    beforeEach(() => {
        http = new HttpClient();
    });
    it("should be imported", () => {
        expect(HttpClient).toBeDefined();
    });
    it("should have a method configure", () => {
        expect(http.configure).toBeDefined();
    });
    it("should throw error when trying to configure without a function", () => {
        expect(() => {
            http.configure(undefined);
        }).toThrowError();
    });
    it("should have a method addMiddleware", () => {
        expect(http.addMiddleware).toBeDefined();
    });
    it("addMiddleware should be chainable", () => {
        let fluent = http.addMiddleware((config: IHttpClientRequestOptions,
                                         next: (options: IHttpClientRequestOptions) => Promise<any>) => {
            return next(config);
        });
        expect(fluent).toBe(http);
    });
    it("should have getCombinedUrl", () => {
        expect(HttpClient.getCombinedUrl).toBeDefined();
    });
    it("should concat url with base url", () => {
        let combinedUrl = HttpClient.getCombinedUrl("http://jsonplaceholder.typicode.com/", "posts/1");
        expect(combinedUrl)
            .toBe("http://jsonplaceholder.typicode.com/posts/1");
    });
    it("should ignore baseUrl if path itself is a full url", () => {
        let combinedUrl = HttpClient.getCombinedUrl("http://jsonplaceholder.typicode.com/", "http://jsonplaceholder.typicode.com/posts/1");
        expect(combinedUrl)
            .toBe("http://jsonplaceholder.typicode.com/posts/1");
    });
    it("should do a fetch and return a promise", () => {
        http.configure(config => {
            config.withBaseUrl("http://jsonplaceholder.typicode.com");
        });
        http.fetch("/posts/1").then((res) => {
            expect(res).toBeDefined();
        });
    });
    it("should give me json object", () => {
        http.configure(config => {
            config.withBaseUrl("http://jsonplaceholder.typicode.com");
        });
        http.fetch("/posts/1").then(res => {
            expect(res).toBeDefined();
        });
    });
    it("supports the addition of middleware", () => {
        expect(http.addMiddleware((config, next) => {
            config.baseUrl = "http://jsonplaceholder.typicode.com/posts";
            return next(config);
        })).toBe(http);
    });
    it("should throw an Error if fetch is undefined", () => {
        expect(() => {
            ((window || self) as any).fetch = undefined;
            new HttpClient();
        }).toThrowError();
    });
});
