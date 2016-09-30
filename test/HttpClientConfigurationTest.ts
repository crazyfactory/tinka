import IHttpClientConfiguration = HttpClient.IHttpClientConfiguration;
import {HttpClientConfiguration} from "../app/http-client-configuration";
describe('HttpClientConfiguration', () => {
    let config:IHttpClientConfiguration;
    beforeEach(() => {
        config = new HttpClientConfiguration;
    });
    it('should be defined', () => {
        expect(HttpClientConfiguration).toBeDefined();
    });
    it('should have a method withBaseUrl', () => {
        expect(config.withBaseUrl).toBeDefined();
    });
    it('and should return this', () => {
        let fluent = config.withBaseUrl('https://api.crazy-factory.com/v2');
        expect(fluent).toBe(config);
    });
});