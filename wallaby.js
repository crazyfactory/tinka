module.exports = function (w) {
    return {
        files: [
            'src/**/*.ts',
            '!src/**/*.spec.ts'
        ],
        bootstrap: function() {
            global.fetch = require('node-fetch');
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
