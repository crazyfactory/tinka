module.exports = function (w) {
    return {
        files: [
            'src/**/*.ts',
            '!src/**/*.spec.ts'
        ],
        bootstrap: function() {
            var fetch = require('node-fetch');
            global.fetch = global.fetch || fetch;
            global.Request = global.Request || fetch.Request;
            global.Response = global.Response || fetch.Response;

            var LocalStorage    = require('node-localstorage').LocalStorage;
            global.localStorage = new LocalStorage('');
        },
        tests: [
            'src/**/*.spec.ts'
        ],
        env: {
            type: 'node'
        },
        testFramework: 'jasmine'
    };
};
