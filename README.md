# cf-service-client

[![Greenkeeper badge](https://badges.greenkeeper.io/crazyfactory/ts-http-client.svg)](https://greenkeeper.io/)

[![npm](https://img.shields.io/npm/v/@crazy-factory/ts-service-client.svg)](http://www.npmjs.com/package/@crazy-factory/ts-service-client)
[![Build Status](https://travis-ci.org/crazyfactory/ts-http-client.svg?branch=master)](https://travis-ci.org/crazyfactory/ts-http-client)
[![codecov](https://codecov.io/gh/crazyfactory/ts-http-client/branch/master/graph/badge.svg)](https://codecov.io/gh/crazyfactory/ts-http-client)
[![dependencies Status](https://david-dm.org/crazyfactory/ts-http-client/status.svg)](https://david-dm.org/crazyfactory/ts-http-client)
[![devDependencies Status](https://david-dm.org/crazyfactory/ts-http-client/dev-status.svg)](https://david-dm.org/crazyfactory/ts-http-client?type=dev)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

An (almost) dependency-free library to gracefully handle fetch requests.

## Requirements

This project requires [nodejs](https://nodejs.org/en/download/) to be installed on your system!

## Setup

Install project dependencies
- `npm install`

## Tests

- `npm test` will run karma and test your code. Will also create a code coverage report at `/coverage`.

## Code styles

This project uses tslint to enforce similar code styles across source and test files. Passing tslint validation is a CI requirement. You can run and validate your code style locally.

- `npm run lint` lints all typescript files in the project.
- `npm run lint-fix` to also fix most common errors automatically.

## Build and deploy

This package is automatically build and deployed using TravisCI and semantic-release. You can however test the process locally:

- `npm run build` compile sources into all desired formats.
- `npm run pack` to create the final package.

Note: You'll have to edit package.json to include a version number of your choice. Don't check this in though as the version number is determined by semantic-release.
