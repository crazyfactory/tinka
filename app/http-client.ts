//import {HttpClientConfiguration} from "./http-client-configuration";

import {HttpClient as IHttpClient} from "http-client";
import {IHttpClientMiddleware} from "http-client";
import {HttpClientConfiguration as IHttpClientConfiguration} from "http-client";
import {IHttpClientRequestOptions} from "http-client";
import {IHttpClientResponse} from "http-client";

declare var fetch: () => Promise<any>;

export class HttpClientConfiguration implements IHttpClientConfiguration{
    defaults: IHttpClientRequestOptions;

    withBaseUrl(url: string): HttpClientConfiguration {
        // todo: fail on illegal characters????
        // if has :// make sure it's http:// or https://
        // remove trailing slash??? or ensure there is one???

        return this;
    }
}

export class HttpClient implements IHttpClient {
    private middlewares:IHttpClientMiddleware[];
    private configuration:IHttpClientConfiguration;
    private options;

    configure(fn: (config: IHttpClientConfiguration)=>void) {
        // todo make sure type is function...

        fn(this.configuration);
    }

    constructor(){
        this.configuration = new HttpClientConfiguration();
        this.middlewares = [];
        if(typeof fetch === 'undefined'){
            throw new Error('Please use a fetch polyfill');
        }
    }

    addMiddleware(func: IHttpClientMiddleware) {
        this.middlewares.push(func);
        return this;
    }

    private _fetch(url, options){
        return fetch();
    }

    fetch(url: string, options: IHttpClientRequestOptions): Promise<IHttpClientResponse<any>> {
        let httpClientRequestOptions:IHttpClientRequestOptions = Object.assign({}, this.options, options);
        httpClientRequestOptions.url = url;

        let middlewares = this.middlewares.concat([this._fetch]);

        let next = (options) => {
            let nextMW: IHttpClientMiddleware = middlewares.shift();
            if (!nextMW) {
                throw new Error("No next :( :D");
            }
            return nextMW(options, next);
        };
        return next(options);
    }
}

//
// let http = new HttpClient();
// http.configure((config) =>{
//     config.withBaseUrl('http://crazy-factory.com/api/v2');
//     config.defaults = {
//         method:'GET',
//         headers:{
//             "Content-Type":"application/json",
//             "cookie":"cookie"
//         }
//     }
// });
// http.addMiddleware((config, next) => {
//     config.defaults.headers = {
//         "Content-Type":"text/xml"
//     }
// });
// http.fetch('products', {}).then().catch();


