# tinka

[![npm](https://img.shields.io/npm/v/@crazyfactory/tinka.svg)](http://www.npmjs.com/package/@crazyfactory/tinka)
[![Build Status](https://travis-ci.org/crazyfactory/tinka.svg?branch=master)](https://travis-ci.org/crazyfactory/tinka)
[![codecov](https://codecov.io/gh/crazyfactory/tinka/branch/master/graph/badge.svg)](https://codecov.io/gh/crazyfactory/tinka)
[![dependencies Status](https://david-dm.org/crazyfactory/tinka/status.svg)](https://david-dm.org/crazyfactory/tinka)
[![devDependencies Status](https://david-dm.org/crazyfactory/tinka/dev-status.svg)](https://david-dm.org/crazyfactory/tinka?type=dev)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/crazyfactory/tinka.svg)](https://greenkeeper.io/)

An (almost) dependency-free library to gracefully handle fetch requests.

## Usage

Tinka can be used as a standalone requirement or better yet as a basis for fully typed API SDKs.

## Contribute

Clone this repository and install project dependencies.
- `npm install`

### Tests

This package is tested using [jest](https://github.com/facebook/jest), which you can use via CLI or through most IDEs directly. 
- on CLI execute `npm test` to run the tests.

This will also create a code coverage report at `/coverage`.

For continuous testing use [wallabyjs](wallabyjs.com) with our default configuration at `./wallaby.js`

### Code styles

This project uses tslint to enforce similar code styles across source and test files. Passing tslint validation is a CI requirement. You can run and validate your code style locally.

- `npm run lint` lints all typescript files in the project.
- `npm run lint-fix` to also fix most common errors automatically.

The project also comes with project based code-style settings for intelliJ-based IDEs like PhpStorm, Webstorm etc. You can safely use their auto cleanup features.

### Build and deploy

This package is automatically build and deployed using TravisCI and semantic-release. You can however test the process locally:

- `npm run build` compile sources into all desired formats.
- `npm run pack` to create the final package.

Note: You'll have to edit package.json to include a version number of your choice. Don't check this in though as the version number is determined by semantic-release.
