/// <reference path="../app/http-client.ts"/>

import {HttpClient} from '../app/http-client';
import IHttpClientConfiguration = HttpClient.IHttpClientConfiguration;
import IHttpClientRequestOptions = HttpClient.IHttpClientRequestOptions;

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
    it('should have a method middleware', () =>{
        expect(http.addMiddleware).toBeDefined();
    });
    it('add middleware should return HttpClient', () => {
        let fluent = http.addMiddleware((config:IHttpClientRequestOptions, next: (IHttpClientRequestOptions) => Promise)
            => {
            return next(config);
        });
        expect(fluent).toBe(http);
    });
});
