/// <reference path="../src/httpClient.ts"/>
/// <reference path="../typings/jasmine/jasmine.d.ts" />
import {HttpClient} from '../src/httpClient';
import {IHttpClientRequestOptions} from "http-client";
describe('HttpClient', () => {
    let http:HttpClient;
    beforeEach(() => {
        http = new HttpClient();
    });
    it('should be imported', () => {
        expect(HttpClient).toBeDefined();
    });
    it('should have a method configure', () => {
        expect(http.configure).toBeDefined();
    });
    it('should throw error when trying to configure without a function', () => {
        expect(() => {
            http.configure(undefined);
        }).toThrowError();
    });
    it('should have a method addMiddleware', () =>{
        expect(http.addMiddleware).toBeDefined();
    });
    it('addMiddleware should be chainable', () => {
        let fluent = http.addMiddleware((config:IHttpClientRequestOptions,
                                         next: (IHttpClientRequestOptions) => Promise<any>) => {
            return next(config);
        });
        expect(fluent).toBe(http);
    });
    it('should have getCombinedUrl', () => {
        expect(HttpClient.getCombinedUrl).toBeDefined();
    });
    it('should concat url with base url', () => {
        let combined_url = HttpClient.getCombinedUrl("http://jsonplaceholder.typicode.com/", "posts/1");
        expect(combined_url)
            .toBe("http://jsonplaceholder.typicode.com/posts/1");
    });
    it('should ignore base_url if path itself is a full url', () => {
        let combined_url = HttpClient.getCombinedUrl("http://jsonplaceholder.typicode.com/", "http://jsonplaceholder.typicode.com/posts/1")
        expect(combined_url)
            .toBe("http://jsonplaceholder.typicode.com/posts/1");
    });
    it('should do a fetch and return a promise', () => {
        http.configure(config => {
            config.withBaseUrl('http://jsonplaceholder.typicode.com');
        });
        http.fetch('/posts/1').then((res) => {
            expect(res).toBeDefined();
        });
    });
    it('should give me json object', () => {
        http.configure(config => {
            config.withBaseUrl('http://jsonplaceholder.typicode.com')
        });
        http.fetch('/posts/1').then(res => {
            expect(res).toBeDefined();
        });
    });
    it('supports the addition of middleware', () => {
        expect(http.addMiddleware((config, next) => {
            config.base_url = 'http://jsonplaceholder.typicode.com/posts';
            return next(config);
        })).toBe(http);
    });
});
