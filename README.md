# ts-http-client

[![Build Status](https://travis-ci.org/crazyfactory/ts-http-client.svg)](https://travis-ci.org/crazyfactory/ts-http-client)

A dependency-free library to gracefully cache and handle fetch requests. It's intended to replace [aurelia-fetch-client](https://github.com/aurelia/fetch-client) as a base dependency for api-sdk, but should work standalone as well.

Main customer's will be BaseApi classes in...
- [pim-aurelia-sdk](https://github.com/crazyfactory/pim-aurelia-sdk/)
- shop-api-sdk
- logistics-api-sdk
- erp-api-sdk

## Setup
It's really easy to setup if we just have a look at how travis builds this project. Long story short;

Make sure your development environment has all the necessary tools to run this project.

We require `gulp typings jspm` packages to be globally installed in your system.

To do that, just type in `npm install gulp typings jspm -g` in your comand line.

If you don't have npm installed, please do it.

If you get permission warnings, you should really fix it the right way, but if you want, you can use dirty way (`sudo`).

Take a look at [npm docs](https://docs.npmjs.com/getting-started/fixing-npm-permissions) to fix the right way.

Now to install dependencies, just execute the following commands.
- `npm install` (installs npm dependencies; mostly for development)
- `jspm install` (For typescript and few polyfill; mostly for development)
- `typings install` (to install typings provided by jasmine)

## Running tests
- `npm run compile` transpiles TypeScript into es6
- `npm run test` starts karma runner and performs test
- `npm run lint` lints typescript files as described in `tsconfig.json`

## Building for production
`npm run build` and it should create a directory called `dist` with source maps and es5 compiled JavaScript.

To make the process short you can just execute `npm run compile && npm run test && npm run lint`

Just execute `npm run compile && npm run test && gulp tslint` and it should compile, test, and run a lint.

## Requirements

- **TypeScript** Written in TypeScript., fully typed during development, compiled and served as plain JS module along with it's own typings. Make us of [typescript 2.0](https://blogs.msdn.microsoft.com/typescript/2016/09/22/announcing-typescript-2-0/) Typings for underlying dependencies.

- **Deploy** Tested via travis. Tagged commits shall be deployed as npm/jspm packages. 

- **class HttpClientConfiguration** 
 - handles the configuration of the package
 - builds the final configuration to be passed on to the fetchApi. 
 - Has useful default values
 - Is strongly typed
 - May offer some functions for easy setup (see .useStandardConfiguration(), withBaseUrl(string), etc. in aurelia-fetch-client for reference).
 - May use some kind of ```interface IHttpClientRequestConfiguration``` to derive from or for it's internal data store

- **class HttpClient** Main class of the package. 
 - Default usage should be instanciation and injection, meaning no unnecessary static voodoo. Aware of all running request and their state. 
 - ```configure((HttpClientConfiguration) => void)``` allows changing the stored default values. These can be set up via the constructor as well. Uses an instance of ```class HttpClientConfiguration``` to store its configuration values to be used as defaults values for all requests being made.
 - ```.addMiddleware(IHttpClientMiddleware)``` Supports Middleware to interject/change requests being made to handle advanced scenarios like authorization header, refresh-token-usage, caching(?). Uses and exposes ```interface IHttpClientMiddleware``` for other packages to 
 - ```.fetch<T>(url: string, options?: IHttpClientRequestConfiguration): Promise<HttpClientResponse<T>>``` will be called to initiate requests, returns a promised wrapper object, offering statusCode, data, exceptions, etc. The options will be merged with the default options, before being passed on to the Middleware pipeline and if uninterrupted to the fetch Api.
 - (Consider offering a HttpClientSingleton-class for other scenarios.)

- **class ApiHttpClient** A base class to set up SDKs for APIs, see [pim-aurelia-sdk](https://github.com/crazyfactory/pim-aurelia-sdk/) ```BaseApi```-class for sample usage and inspiration. SDK packages would extend this class and use it's functionality with the target of most SDKs being auto-generated out of the API itself.
 - Has it's own HttpClient instance and default values for making request.
 - Will make use of Json Headers/Data by default. May use gzipped binary content in production mode. 
 - Offers its own ```.fetch(url: string, data?: any, files?: any[], options?: IHttpClientRequestConfiguration): Promise<HttpClientRequest<any>>``` to be used for convenience by
  - ```.get(url: string, options?: IHttpClientRequestConfiguration): Promise<HttpClientRequest<any>>```
  - ```.head(url: string, options?: IHttpClientRequestConfiguration): Promise<HttpClientRequest<any>>```
  - ```.delete(url: string, data: any, options?: IHttpClientRequestConfiguration): Promise<HttpClientRequest<any>>```
  - ```.patch(url: string, data: any, files?: any[], options?: IHttpClientRequestConfiguration): Promise<HttpClientRequest<any>>```
  - ```.post(url: string, data: any, files?: any[], options?: IHttpClientRequestConfiguration): Promise<HttpClientRequest<any>>```
  - ```.put(url: string, data: any, files?: any[], options?: IHttpClientRequestConfiguration): Promise<HttpClientRequest<any>>``` 

## Additional packages
  
**Middlewares**
Packages to be registered as middleware during configuration of a HttpClient or HttpApiClient object.
- **HttpClientCookieAuthorizationMiddleware** Reads a js session cookie and adds it to all requests as authorization-header.
- **HttpClientBearerAuthorizationMiddleware** Reads in a JWT and adds it to all requests as authorization-header. Recognizes if the token has run out beforehand and, if present, will try to use a refreshToken to obtain a new token before firing the actual request.
- **HttpClient__________Middleware** Handles incoming "real" cookies to nodeJS and transforms them into a authorization headers to supply SSR with the correct data.
- **HttpClientCacheMiddleware** Will cache requests by signature and, if requested via options by a future request, return this result instead of making the actual call. Caches should become invalid after a set amount of time or by dropping them by signature.
 - Probably makes sense to have "theoretical" support for this in IHttpClientRequestOptions and HttpClientResponse. (IsCached: bool, MaxAge, etc. etc.). Default values should indicate there is no caching being done.
 - Should offer an interface to allow for different kinds of storages (e.g. localstorage on the clientside, filestorage on the serverside
- **HttpClientMockMiddleware** For testing purposes and development. Can be configured to automatically return a set of mock data for certain call signatures.
 - ```addMockResponse(fn: (options: IHttpClientRequestOptions) => HttpClientRequest<any> | any, options?: IMockResponseOptions)``` all registered functions will get called. The first returned value !== ```undefined``` will be used as a mocked response. IMockResponseOptions allows configuration for delays (and maybe other things). If the response is not an instance of HttpClientRequest it will be wrapped in a default object provided by HttpClientMockMiddleware (or it's configuration). The default configuration will assume there have been no errors whatsoever and the response type was json and the result is it's decoded literal or native type form. Make sure ```null``` is valid return value, though by standard ```null``` should have a NoContent-status-code instead of Ok.
  
**Specific api packages**
At some point hopefully all of these will be auto-generated. Initially they will be created by hand.
- **TsShopApiClient** To access the Shop Api
- (**TsShopLegacyApiClient**)?: To access the Legacy Shop Api. 
- **TsPimApiClient** To access the PIM Api
- **TsLogisticsApiClient** To access the Shop Api
- **TsErpApiClient** To access the Shop Api
- **TsImageServiceApiClient** To access the Shop Api
- ...


  
## Prove and provide samples/documentation
- **Legacy compatible**: We have to support IE10. There is a [fetch polyfill](https://github.com/github/fetch/) which might be sufficient. If it works it should be covered in documentation only to show usage.

- **NodeJS compatible** Should run flawlessly on NodeJS for serverside rendering. This is achieved via node-fetch package (or similar). Configured in SSR entry point. Should be tested, sampled and documented though.
