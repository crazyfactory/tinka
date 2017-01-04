// Karma configuration
module.exports = function (config) {
    config.set({

        frameworks: ["karma-typescript", "jasmine"],

        files: [
            {pattern: "src/**/*.ts"}
        ],

        preprocessors: {
            "src/**/*!(\.d).ts": ["karma-typescript"]
        },

        karmaTypescriptConfig: {
            excludeFromCoverage: /(\.d|\.spec|\.test)\.ts/,
            reports: {
                "clover": "coverage",
                "html": "coverage",
                "json-summary": "coverage",
                "json": "coverage",
                "text": null
            }
        },

        reporters: ["progress", "karma-typescript"],

        customLaunchers: {
            ChromeTravis: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        browsers: process.env.TRAVIS
            ? ['Firefox', 'ChromeTravis']
            : ['Chrome'],

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
