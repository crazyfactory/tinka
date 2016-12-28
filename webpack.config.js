module.exports = {
    /** Build from built js file */
    entry: {
      typestyle: './lib/index.js',
    },
    output: {
        filename: './umd/index.js',
        libraryTarget: 'umd',
        /** The library name on window */
        library: '@crazy-factory/cf-service-client'
    }
};
