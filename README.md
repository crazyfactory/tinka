# ts-http-client

A dependency-free library to gracefully cache and handle fetch requests. It's intended to replace [aurelia-fetch-client](https://github.com/aurelia/fetch-client) as a base dependency for api-sdk, but should work standalone as well.

Main customer's will be BaseApi classes in...
- [pim-aurelia-sdk](https://github.com/crazyfactory/pim-aurelia-sdk/)
- shop-api-sdk
- logistics-api-sdk
- erp-api-sdk

## Must haves
- **Legacy compatible**: Definetely support IE10... either via [fetch polyfill](https://github.com/github/fetch/) or by using XHRHttpRequests. With some bad luck we'll have to support IE9 as well, which could require writing (or customizing) a polyfill ourselves.

- **NodeJS compatible** Should run flawlessly on NodeJS for serverside rendering
  
- **Response Caching** Can cache and return cached responses if set via request config. Will require a small caching interface, which may result in a separate package. (Which then can offer file-storage on Node, localStorage in the browser, memoryStorage in legacy browsers etc.)

- **Middleware support** Support pre/post-request middleware to handle advanced scenarios like header-authorization, refresh-token-usage, caching(?)

- **Library is class-based** Using it requires instanciation (no unnecessary static voodoo, we want to use this in DI-scenarios!). Aware of all running request and their state. 

- **Configurable per request** Every request can receive it's own config object, which will extend a default config object. The resulting object will be passed along the middlewares and the final version of it is the whole source of knowledge used for doing the actual request.

- **BaseApi** A class to set up SDKs for APIs, see [pim-aurelia-sdk](https://github.com/crazyfactory/pim-aurelia-sdk/) ```BaseApi```-class for sample usage and inspiration.

- **TypeScript** Written in TypeScript, fully typed during development, compiled and served as plain JS module. Supplies .d.ts files for all classes.

- **Deploy** Tested via travis. Tagged commits shall be deployed as npm/jspm packages. 
  
