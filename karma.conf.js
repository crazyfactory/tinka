// Karma configuration
module.exports = function (config) {
    config.set({

        frameworks: ["karma-typescript", "jasmine"],

        files: [
            "node_modules/es6-shim/es6-shim.js",
            {pattern: "src/**/*.ts"},
            {pattern: "test/**/*.ts"}
        ],

        preprocessors: {
            "src/**/*!(\.d).ts": ["karma-typescript"],
            "test/**/*!(\.d).ts": ["karma-typescript"]
        },

        karmaTypescriptConfig: {
            compilerOptions: {
                target: "ES6"
            },
            excludeFromCoverage: /(\.d|\.spec|\.test)\.ts/,
            reports: {
                "clover": "coverage",
                // "cobertura": "coverage",
                "html": "coverage",
                "json-summary": "coverage",
                "json": "coverage",
                // "lcovonly": "coverage",
                //"teamcity": "coverage", // "destination/path" or null or ""
                // "text-lcov": "coverage", // ...
                "text": null
            }
        },

        reporters: ["progress", "karma-typescript"],

        browsers: ['Chrome'],

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
