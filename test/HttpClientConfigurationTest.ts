/// <reference path="../typings/index.d.ts" />
import {HttpClientConfiguration} from "../src/httpClient";

describe('HttpClientConfiguration', () => {
    let httpClientConfiguration: HttpClientConfiguration;
    beforeEach(() => {
        httpClientConfiguration = new HttpClientConfiguration;
    });

    it('should be defined', () => {
        expect(HttpClientConfiguration).toBeDefined();
    });
    it('should have a method withBaseUrl', () => {
        expect(httpClientConfiguration.withBaseUrl).toBeDefined();
    });
    it('and should return this', () => {
        let fluent = httpClientConfiguration.withBaseUrl('https://api.crazy-factory.com/v2');
        expect(fluent).toBe(httpClientConfiguration);
    });
    it('should have defaults method', () => {
        expect(HttpClientConfiguration.defaults).toBeDefined();
    });

});
