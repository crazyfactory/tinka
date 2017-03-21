module.exports = {
    /** Build from built js file */
    entry: './lib/index.js',
    output: {
        filename: './umd/index.js',
        libraryTarget: 'umd',
        /** The library name on window */
        library: 'tinka'
    }
};
