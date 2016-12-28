const gulp = require('gulp');
const del = require('del');
const tslint = require('gulp-tslint');

const tscConfig = require('./tsconfig.json');


/**
 * Clean up tasks
 */
gulp.task('clean', function () {
    return del(['./lib', './lib.es2015', './coverage', './umd/**/*.js']);
});

/**
 * Linting
 */

gulp.task('lint', function () {
    return gulp.src("./" + tscConfig.include + ".ts")
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
});
