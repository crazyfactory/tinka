# cf-service-client

[![Build Status](https://travis-ci.org/crazyfactory/ts-http-client.svg)](https://travis-ci.org/crazyfactory/ts-http-client)
[![npm](https://img.shields.io/npm/v/cf-service-client.svg)](http://www.npmjs.com/package/cf-service-client)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

An (almost) dependency-free library to gracefully handle fetch requests. 

It's main usage is as a base package for fully typed service clients such as:
- [pim-ts-service-client](https://github.com/crazyfactory/pim-ts-service-client/)
- [shop-ts-service-client](https://github.com/crazyfactory/shop-ts-service-client/)
- [dpr-ts-service-client](https://github.com/crazyfactory/dpr-ts-service-client/)
- ...

## Requirements

This project requires [nodejs](https://nodejs.org/en/download/) to be installed on your system. 

## Setup

1) Install globally required npm packages
- `npm install -g gulp typings jspm yarn`

2) Install project dependencies
- `yarn` (installs npm dependencies; mostly for development; replaces `npm install`)
- `jspm install` (installs the typescript transpiler for jspm to be used during bundling)
- `typings install` (installs typings for jasmine)

Note: If you get permission warnings you can dirty-fix it using `sudo` or take a look at the [npm docs](https://docs.npmjs.com) to [fix it the right way]((https://docs.npmjs.com/getting-started/fixing-npm-permissions).

## Tests

Since the tests and the package are written in typescript, all sources have to be compiled before running tests. You have to repeat this step every time before you're running tests.

- `npm run compile` will compile all of your sources to `/build`.
- `npm run test` will run karma and test your code. Will also create a code coverage report at `/coverage`.

You can exec `npm run compile && npm run test` to do this in one step. You may also set-up your IDE to do this for you.

Note: There is also a `npm run compile-w` command which will watch and recompile your code every time you make changes.

## Code styles

This project uses tslint to enforce similar code styles across source and test files. Passing tslint validation is a CI requirement. You can run and validate your code style locally.

- `npm run lint` lints all typescript files in the project.

Note: You can run `npm run lint-w` to continously perform linting on every file change.

## Build and deploy

This package is automatically build and deployed using TravisCI and semantic-release. You can however test the process locally:

- `npm run build` creates a minified ES5 bundle in the `/dist`-folder.
- `npm run pack` to create the final package.

Note: You'll have to edit package.json to include a version number of your choice. Don't check this in though as the version number is determined by semantic-release.

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
  
## Legacy support?

### Browsers
Legacy support may be achieved by using polyfills for Promises and Fetch. The github [fetch polyfill](https://github.com/github/fetch/) and [es6-promise polyfill](https://www.npmjs.com/package/es6-promise) should be enough to support most browsers.

### NodeJS
Runs out of the box on newer versions of Node. Older versions may need to run the [node-fetch polyfill](https://www.npmjs.com/package/node-fetch).
