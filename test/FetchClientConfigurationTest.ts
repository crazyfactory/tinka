/// <reference path="../typings/index.d.ts" />
import {FetchClientConfiguration} from "../src/FetchClientConfiguration";

describe("FetchClientConfiguration", () => {
    let httpClientConfiguration: FetchClientConfiguration;
    beforeEach(() => {
        httpClientConfiguration = new FetchClientConfiguration;
    });

    it("should be defined", () => {
        expect(FetchClientConfiguration).toBeDefined();
    });
    it("should have a method withBaseUrl", () => {
        expect(httpClientConfiguration.withBaseUrl).toBeDefined();
    });
    it("and should return this", () => {
        let fluent = httpClientConfiguration.withBaseUrl("https://api.crazy-factory.com/v2");
        expect(fluent).toBe(httpClientConfiguration);
    });
    it("should have defaults method", () => {
        expect(FetchClientConfiguration.defaults).toBeDefined();
    });

});
